#!/usr/bin/env node
/*
 * PNG -> SVG sprite generator.
 *
 * Reads a downsampled PNG (pixel-art native resolution), quantizes colors
 * to a tight palette, and emits a React component that renders one <rect>
 * per non-transparent pixel — guaranteeing a pixel-perfect match.
 *
 * Usage:
 *   node scripts/png-to-svg-sprite.mjs <input.png> <ComponentName> [maxColors]
 *
 * Output goes to src/toons/sprites/<ComponentName>.tsx
 */

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(__dirname, "..");

const [, , inputPath, componentName, maxColorsArg] = process.argv;
if (!inputPath || !componentName) {
  console.error(
    "Usage: node scripts/png-to-svg-sprite.mjs <input.png> <ComponentName> [maxColors=8]",
  );
  process.exit(1);
}
const maxColors = Number(maxColorsArg ?? 8);

// 1. Read pixels from PNG via ImageMagick `txt:` format (file, not stdout —
//    stdout can blow Node's default exec buffer on high-res sprites).
const txtPath = join(tmpdir(), `png2svg-${Date.now()}-${Math.random().toString(36).slice(2)}.txt`);
execSync(`magick "${inputPath}" "${txtPath}"`);
const raw = readFileSync(txtPath, "utf8");
unlinkSync(txtPath);
const lines = raw.split("\n");
const header = lines[0]; // # ImageMagick pixel enumeration: W,H,...
const headerMatch = header.match(/enumeration:\s*(\d+),(\d+)/);
if (!headerMatch) {
  console.error("Could not parse image header:", header);
  process.exit(1);
}
const width = Number(headerMatch[1]);
const height = Number(headerMatch[2]);

// Load every pixel as RGBA. Pixels with alpha < 128 are treated as bg.
// magick's txt: format includes alpha as the 4th channel for RGBA images
// (e.g. "(255,0,0,128)"); RGB-only images have 3 channels.
const allPixels = Array.from({ length: width * height }, () => null);
const pixRe = /^(\d+),(\d+):\s*\(([^)]+)\)\s+(#[0-9A-Fa-f]+)/;
for (const line of lines.slice(1)) {
  const m = pixRe.exec(line);
  if (!m) continue;
  const x = Number(m[1]);
  const y = Number(m[2]);
  const ch = m[3].split(",").map((s) => Number(s.trim()));
  const alpha = ch.length >= 4 ? ch[3] : 255;
  if (alpha < 128) continue; // skip transparent pixels — already marked bg upstream
  allPixels[y * width + x] = { r: ch[0], g: ch[1], b: ch[2] };
}

// Bg removal is handled upstream by build-all-sprites.mjs:
//   magick ... -fuzz 15% -transparent black
// makes pure-black + trapped-black pockets transparent. allPixels[i] === null
// for those — they were skipped during load. Anything left is sprite content.
const pixels = allPixels.slice();

// 2. Quantize to maxColors using simple k-means on RGB.
const samples = pixels.filter(Boolean);
const k = Math.min(maxColors, samples.length);

// Initial centroids: pick maxColors evenly distributed samples by luminance.
samples.sort((a, b) => luma(a) - luma(b));
const centroids = [];
for (let i = 0; i < k; i++) {
  const idx = Math.floor((i * samples.length) / k);
  centroids.push({ ...samples[idx] });
}

for (let iter = 0; iter < 30; iter++) {
  const buckets = Array.from({ length: k }, () => []);
  for (const px of samples) {
    let best = 0;
    let bestD = Infinity;
    for (let c = 0; c < k; c++) {
      const d = dist2(px, centroids[c]);
      if (d < bestD) {
        bestD = d;
        best = c;
      }
    }
    buckets[best].push(px);
  }
  let moved = 0;
  for (let c = 0; c < k; c++) {
    if (buckets[c].length === 0) continue;
    const avg = buckets[c].reduce((a, p) => ({ r: a.r + p.r, g: a.g + p.g, b: a.b + p.b }), {
      r: 0,
      g: 0,
      b: 0,
    });
    const n = buckets[c].length;
    const nx = {
      r: Math.round(avg.r / n),
      g: Math.round(avg.g / n),
      b: Math.round(avg.b / n),
    };
    if (dist2(nx, centroids[c]) > 1) moved++;
    centroids[c] = nx;
  }
  if (moved === 0) break;
}

// 3. Map each pixel to nearest centroid hex.
const palette = centroids.map(toHex);
const colorOf = (px) => {
  let best = 0;
  let bestD = Infinity;
  for (let c = 0; c < centroids.length; c++) {
    const d = dist2(px, centroids[c]);
    if (d < bestD) {
      bestD = d;
      best = c;
    }
  }
  return palette[best];
};

// 4. Despeckle: drop truly isolated sprite pixels (≤ 1 sprite neighbor in
//    the 8-neighborhood). Single-pass, conservative — 1-pixel-wide features
//    like the weather-vane post or thin window mullions naturally have 2
//    neighbors along their length, so a stricter threshold would erode them.
//    The connected-component pass below picks up everything else.
function isPixel(x, y) {
  return x >= 0 && x < width && y >= 0 && y < height && pixels[y * width + x] != null;
}
{
  const toDrop = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!isPixel(x, y)) continue;
      let on = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          if (isPixel(x + dx, y + dy)) on++;
        }
      }
      if (on <= 1) toDrop.push(y * width + x);
    }
  }
  for (const idx of toDrop) pixels[idx] = null;
}

// 4b. Connected-component cleanup. Find every 8-connected blob of remaining
//     sprite pixels; keep the largest (main body) plus any blob >= MIN_BLOB.
//     This removes multi-pixel scatter clusters (e.g. weather-vane fragments,
//     tractor edge noise) that despeckle can't reach because each scatter
//     pixel has 3+ neighbors within its own little cluster.
const MIN_BLOB = 18;
{
  const compId = new Int32Array(width * height).fill(-1);
  const components = []; // array of pixel-count
  let nextId = 0;
  for (let i = 0; i < width * height; i++) {
    if (pixels[i] == null || compId[i] !== -1) continue;
    const id = nextId++;
    let count = 0;
    const q = [i];
    compId[i] = id;
    while (q.length) {
      const j = q.pop();
      count++;
      const x = j % width;
      const y = (j - x) / width;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
          const nIdx = ny * width + nx;
          if (pixels[nIdx] == null || compId[nIdx] !== -1) continue;
          compId[nIdx] = id;
          q.push(nIdx);
        }
      }
    }
    components.push(count);
  }
  // Determine the largest component (definitely keep) and threshold for the rest.
  let maxId = 0;
  for (let c = 1; c < components.length; c++) {
    if (components[c] > components[maxId]) maxId = c;
  }
  for (let i = 0; i < width * height; i++) {
    if (pixels[i] == null) continue;
    const id = compId[i];
    if (id === maxId) continue;
    if (components[id] >= MIN_BLOB) continue;
    pixels[i] = null;
  }
}

// 5. Emit rects, run-length-encoded per row for fewer DOM nodes.
const rects = [];
for (let y = 0; y < height; y++) {
  let runStart = -1;
  let runColor = null;
  for (let x = 0; x <= width; x++) {
    const px = x < width ? pixels[y * width + x] : null;
    const color = px ? colorOf(px) : null;
    if (color === runColor) continue;
    if (runColor !== null) {
      rects.push(
        `      <rect x="${runStart}" y="${y}" width="${x - runStart}" height="1" fill="${runColor}" />`,
      );
    }
    runColor = color;
    runStart = x;
  }
}

// 5. Write the React component.
const out = `// AUTO-GENERATED from ${inputPath.replace(pkgRoot + "/", "")}.
// Regenerate with: node scripts/png-to-svg-sprite.mjs <input.png> ${componentName}
export function ${componentName}({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 ${width} ${height}"
      className={className}
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
${rects.join("\n")}
    </svg>
  );
}
`;

const outPath = join(pkgRoot, "src/toons/sprites", `${componentName}.tsx`);
writeFileSync(outPath, out);
console.log(
  `Wrote ${outPath} (${width}x${height}, ${rects.length} rects, palette: ${palette.join(",")})`,
);

function luma(p) {
  return 0.299 * p.r + 0.587 * p.g + 0.114 * p.b;
}
function dist2(a, b) {
  const dr = a.r - b.r;
  const dg = a.g - b.g;
  const db = a.b - b.b;
  return dr * dr + dg * dg + db * db;
}
function toHex(p) {
  const h = (n) => n.toString(16).padStart(2, "0");
  return `#${h(p.r)}${h(p.g)}${h(p.b)}`;
}
