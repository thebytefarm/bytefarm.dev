#!/usr/bin/env node
/*
 * Extract the SVG from a generated sprite TSX, render it to PNG via magick,
 * and produce a side-by-side comparison vs the source reference.
 *
 * Usage:
 *   node scripts/verify-sprite.mjs <ComponentName> <reference.png>
 */

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(__dirname, "..");
const repoRoot = join(pkgRoot, "../..");

const [, , componentName, referencePath] = process.argv;
if (!componentName || !referencePath) {
  console.error("Usage: node scripts/verify-sprite.mjs <ComponentName> <reference.png>");
  process.exit(1);
}

const tsxPath = join(pkgRoot, "src/toons/sprites", `${componentName}.tsx`);
const tsx = readFileSync(tsxPath, "utf8");

// Pull viewBox + all <rect ... /> lines into a standalone SVG.
const vbMatch = tsx.match(/viewBox="([^"]+)"/);
if (!vbMatch) {
  console.error("Could not find viewBox in", tsxPath);
  process.exit(1);
}
const viewBox = vbMatch[1];
const [, , vbW, vbH] = viewBox.split(/\s+/).map(Number);

const rectRe = /<rect[^/]+\/>/g;
const rects = tsx.match(rectRe) ?? [];
if (rects.length === 0) {
  console.error("No <rect /> found in", tsxPath);
  process.exit(1);
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${vbW}" height="${vbH}" shape-rendering="crispEdges">${rects.join("")}</svg>`;

const tmpDir = join(repoRoot, ".tmp-screenshots");
const svgPath = join(tmpDir, `${componentName}.svg`);
const renderedPath = join(tmpDir, `${componentName}-rendered.png`);
const renderedZoom = join(tmpDir, `${componentName}-rendered-zoom.png`);
const refZoom = join(tmpDir, `${componentName}-ref-zoom.png`);
const compareDiff = join(tmpDir, `${componentName}-diff.png`);
const compareSxs = join(tmpDir, `${componentName}-sxs.png`);

writeFileSync(svgPath, svg);

// Render SVG at native res, then upscale 10x for comparison.
// PNG32 + -background none preserves true alpha (default emits 4-bit colormap which loses it).
execSync(`magick -background none "${svgPath}" PNG32:"${renderedPath}"`, { stdio: "inherit" });
execSync(
  `magick "${renderedPath}" -filter Point -resize ${vbW * 10}x${vbH * 10} "${renderedZoom}"`,
  { stdio: "inherit" },
);
execSync(`magick "${referencePath}" -filter Point -resize ${vbW * 10}x${vbH * 10} "${refZoom}"`, {
  stdio: "inherit",
});

// Side-by-side: rendered | reference
execSync(`magick "${renderedZoom}" "${refZoom}" +append "${compareSxs}"`, { stdio: "inherit" });

// Pixel diff (rendered vs reference downsampled). Returns RMSE.
try {
  const out = execSync(
    `magick compare -metric RMSE "${renderedPath}" "${referencePath.endsWith("-36.png") ? referencePath : "/dev/null"}" "${compareDiff}" 2>&1 || true`,
    { encoding: "utf8" },
  );
  console.log("RMSE:", out.trim());
} catch {
  // compare exits 1 even on success with diff; ignore.
}

console.log(`Wrote ${compareSxs}`);
