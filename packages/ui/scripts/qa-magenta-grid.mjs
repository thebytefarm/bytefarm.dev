#!/usr/bin/env node
/*
 * Render every sprite SVG onto a magenta (#ff00ff) background tile, then
 * tile them into a labeled grid. Magenta makes any leaked/stray pixels pop.
 *
 * Output: .tmp-screenshots/qa-grid.png
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(__dirname, "..");
const repoRoot = join(pkgRoot, "../..");
const tmpDir = join(repoRoot, ".tmp-screenshots");
const spritesDir = join(pkgRoot, "src/toons/sprites");

const TILE = 240;
const COLS = 5;

const files = readdirSync(spritesDir)
  .filter((f) => f.endsWith(".tsx"))
  .sort();
const tiles = [];

for (const file of files) {
  const name = basename(file, ".tsx");
  const tsx = readFileSync(join(spritesDir, file), "utf8");
  const vbMatch = tsx.match(/viewBox="([^"]+)"/);
  if (!vbMatch) continue;
  const viewBox = vbMatch[1];
  const [, , vbW, vbH] = viewBox.split(/\s+/).map(Number);
  const rects = (tsx.match(/<rect[^/]+\/>/g) ?? []).join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${vbW}" height="${vbH}" shape-rendering="crispEdges">${rects}</svg>`;
  const svgPath = join(tmpDir, `${name}-qa.svg`);
  const pngPath = join(tmpDir, `${name}-qa.png`);
  const tilePath = join(tmpDir, `${name}-qa-tile.png`);
  writeFileSync(svgPath, svg);

  // Render at native res, then composite onto a magenta tile (nearest-neighbor scale).
  // PNG32 + -background none preserves alpha (default emits 4-bit colormap PNG).
  execSync(`magick -background none "${svgPath}" PNG32:"${pngPath}"`);
  // Step 1: pixelated scale (up or down) so every sprite fills its tile —
  // small hand-crafted sprites (32x40) and large auto-gen ones (175x235)
  // both display at similar visual size.
  const upscaled = join(tmpDir, `${name}-qa-up.png`);
  execSync(`magick "${pngPath}" -filter Point -resize ${TILE - 20}x${TILE - 20} "${upscaled}"`);
  // Step 2: composite the upscaled (transparent) sprite over a solid magenta canvas.
  execSync(
    `magick -size ${TILE}x${TILE} canvas:"#ff00ff" "${upscaled}" -gravity center -composite ` +
      `-bordercolor "#333" -border 1 "${tilePath}"`,
  );
  tiles.push({ path: tilePath, name });
}

const rows = [];
for (let i = 0; i < tiles.length; i += COLS) {
  const slice = tiles.slice(i, i + COLS);
  while (slice.length < COLS) {
    const blank = join(tmpDir, `qa-blank.png`);
    execSync(`magick -size ${TILE + 2}x${TILE + 2} canvas:"#222" "${blank}"`);
    slice.push({ path: blank, name: "" });
  }
  const rowPath = join(tmpDir, `qa-row-${i}.png`);
  execSync(`magick ${slice.map((t) => `"${t.path}"`).join(" ")} +append "${rowPath}"`);
  rows.push(rowPath);
}

const out = join(tmpDir, "qa-grid.png");
execSync(`magick ${rows.map((r) => `"${r}"`).join(" ")} -append "${out}"`);
console.log(`Wrote ${out}`);
console.log(`Sprite order (left-to-right, top-to-bottom, ${COLS} per row):`);
for (let i = 0; i < tiles.length; i += COLS) {
  console.log(
    "  " +
      tiles
        .slice(i, i + COLS)
        .map((t) => t.name)
        .join(" | "),
  );
}
