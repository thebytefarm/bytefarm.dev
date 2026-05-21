#!/usr/bin/env node
/*
 * Batch-generate every sprite SVG component from its reference PNG.
 * Reads sprite config below, downsamples + quantizes + writes TSX.
 * Also produces a master comparison grid (.tmp-screenshots/all-sprites.png).
 */

import { execSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(__dirname, "..");
const repoRoot = join(pkgRoot, "../..");
const tmpDir = join(repoRoot, ".tmp-screenshots");
const refDir = join(pkgRoot, ".storybook/public/sprites");

// [component, sourcePngOrCustomPath, nativeW, nativeH, paletteSize]
// Native resolutions = ~1:1 ratio with reference (sprites in reference are
// ~120-200px wide). Higher res preserves the original pixel-art detail.
const sprites = [
  ["AppleTree", `${refDir}/apple-tree.png`, 72, 96, 12],
  ["Barn", `${refDir}/barn.png`, 175, 235, 12],
  ["Chicken", `${refDir}/chicken.png`, 54, 48, 10],
  ["Cloud", `${refDir}/cloud-medium.png`, 96, 51, 6],
  ["Corn", `${refDir}/crop-stalk-5.png`, 56, 110, 10],
  ["Cow", `${refDir}/cow.png`, 100, 70, 8],
  ["Fence", `${refDir}/fence.png`, 132, 54, 8],
  ["HayBale", `${refDir}/hay-bale.png`, 54, 42, 10],
  // Leaf is hand-crafted in src/toons/sprites/Leaf.tsx — skip auto-gen.
  ["LittleGuy", `${refDir}/sitting-farmer.png`, 40, 56, 14],
  ["Pig", `${refDir}/pig.png`, 66, 48, 10],
  ["Pumpkin", `${refDir}/sunflower-bud.png`, 42, 54, 10],
  ["Silo", `${refDir}/silo.png`, 48, 108, 10],
  ["Sunflower", `${refDir}/sunflower-full.png`, 42, 60, 10],
  ["Tractor", `${refDir}/tractor.png`, 145, 145, 14],
  ["TreeOak", `${refDir}/tree-oak.png`, 70, 80, 10],
  ["Windmill", `${refDir}/windmill.png`, 66, 108, 10],
  ["Bush", `${refDir}/bush.png`, 54, 48, 10],
  ["BushSmall", `${refDir}/bush-small.png`, 42, 36, 8],
  ["BushPink", `${refDir}/bush-pink.png`, 54, 48, 10],
  ["Sprout", `${refDir}/sprout.png`, 42, 54, 8],
  ["Cabbage", `${refDir}/cabbage.png`, 70, 88, 10],
  ["Crate", `${refDir}/crate-1.png`, 48, 42, 8],
];

const gen = join(__dirname, "png-to-svg-sprite.mjs");

const results = [];
for (const [name, src, w, h, colors] of sprites) {
  const downsampled = join(tmpDir, `${name}-src.png`);
  const trimmed = join(tmpDir, `${name}-trim.png`);
  // Source format: [black bg][asymmetric white frame][sprite].
  // 1. black-trim removes outer black bg.
  // 2. shave 4px from each side strips any remaining asymmetric white frame
  //    (trim doesn't help here since the frame isn't uniform on all sides).
  // 3. black-trim removes any newly-exposed black between frame and sprite.
  execSync(
    `magick "${src}" ` +
      `-bordercolor black -border 1 -fuzz 10% -trim +repage ` +
      `-shave 4x4 ` +
      `-bordercolor black -border 1 -fuzz 10% -trim +repage ` +
      `"${trimmed}"`,
  );
  // Downsample, then convert black bg to true alpha=0. Generator will skip
  // any pixel with alpha < 128. Fuzz=15% catches anti-aliased near-black
  // transitions without eating dark sprite colors (red barn etc. are saturated).
  execSync(
    `magick "${trimmed}" -filter Point -resize ${w}x${h} ` +
      `-alpha set -fuzz 15% -transparent "#000000" ` +
      `"${downsampled}"`,
  );
  execSync(`node "${gen}" "${downsampled}" ${name} ${colors}`, { stdio: "inherit" });

  // Verify - render generated SVG, build side-by-side.
  execSync(`node "${join(__dirname, "verify-sprite.mjs")}" ${name} "${downsampled}"`, {
    stdio: "ignore",
  });

  results.push({ name, sxs: join(tmpDir, `${name}-sxs.png`) });
}

// Build a master grid: 4 columns of side-by-sides (no labels - print name list).
const rows = [];
const COLS = 4;
for (let i = 0; i < results.length; i += COLS) {
  const slice = results.slice(i, i + COLS);
  const resized = slice.map((r) => {
    const out = join(tmpDir, `${r.name}-grid.png`);
    execSync(
      `magick "${r.sxs}" -resize 320x -background white -gravity center -extent 320x180 "${out}"`,
    );
    return out;
  });
  const row = join(tmpDir, `row-${i}.png`);
  execSync(`magick ${resized.map((f) => `"${f}"`).join(" ")} +append "${row}"`);
  rows.push(row);
}

const grid = join(tmpDir, "all-sprites.png");
execSync(`magick ${rows.map((r) => `"${r}"`).join(" ")} -append "${grid}"`);
console.log(`\nMaster comparison grid: ${grid}`);
console.log(`Order (row-major, ${COLS} per row):`);
for (let i = 0; i < results.length; i += COLS) {
  console.log(
    "  " +
      results
        .slice(i, i + COLS)
        .map((r) => r.name)
        .join(" | "),
  );
}
