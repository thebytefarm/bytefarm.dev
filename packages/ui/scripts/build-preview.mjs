#!/usr/bin/env node
/*
 * Build a standalone HTML preview page showing each sprite SVG next to its
 * reference PNG. Output: .tmp-screenshots/preview.html
 *
 * Strips the React component shell from each *.tsx and inlines the <svg>.
 */

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(__dirname, "..");
const spritesDir = join(pkgRoot, "src/toons/sprites");

// Map ComponentName -> reference png filename.
const refMap = {
  AppleTree: "apple-tree.png",
  Barn: "barn.png",
  Bush: "bush.png",
  BushPink: "bush-pink.png",
  BushSmall: "bush-small.png",
  Cabbage: "cabbage.png",
  Chicken: "chicken.png",
  Cloud: "cloud-medium.png",
  Corn: "crop-stalk-5.png",
  Cow: "cow.png",
  Crate: "crate-1.png",
  Fence: "fence.png",
  HayBale: "hay-bale.png",
  LittleGuy: "sitting-farmer.png",
  Pig: "pig.png",
  Pumpkin: "sunflower-bud.png",
  Silo: "silo.png",
  Sprout: "sprout.png",
  Sunflower: "sunflower-full.png",
  Tractor: "tractor.png",
  TreeOak: "tree-oak.png",
  Windmill: "windmill.png",
  Leaf: null,
};

const files = readdirSync(spritesDir).filter((f) => f.endsWith(".tsx"));
const cards = [];
for (const file of files) {
  const name = basename(file, ".tsx");
  const tsx = readFileSync(join(spritesDir, file), "utf8");
  const vbMatch = tsx.match(/viewBox="([^"]+)"/);
  if (!vbMatch) continue;
  const viewBox = vbMatch[1];
  const rects = (tsx.match(/<rect[^/]+\/>/g) ?? []).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" shape-rendering="crispEdges" preserveAspectRatio="xMidYMid meet" class="sprite-svg">${rects}</svg>`;
  const refPng = refMap[name];
  const refSrc = refPng ? `/sprites/${refPng}` : "";
  cards.push({ name, svg, refSrc, viewBox, rectCount: (tsx.match(/<rect/g) ?? []).length });
}

cards.sort((a, b) => a.name.localeCompare(b.name));

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>ByteFarm sprite preview</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: #1a1a2e; color: #e6e6f0;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
  header { padding: 24px; border-bottom: 1px solid #2a2a4a; position: sticky; top: 0;
    background: #1a1a2e; z-index: 10; display: flex; gap: 24px; align-items: center; }
  header h1 { margin: 0; font-size: 18px; font-weight: 700; }
  header label { font-size: 13px; opacity: 0.7; display: flex; gap: 8px; align-items: center; }
  header input[type=range] { width: 240px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 16px; padding: 24px; }
  .card { background: #232342; border: 1px solid #2e2e54; border-radius: 8px;
    padding: 14px; }
  .card h2 { margin: 0 0 4px; font-size: 14px; font-weight: 600; }
  .card .meta { font-size: 11px; opacity: 0.6; margin-bottom: 12px; }
  .row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; align-items: end; }
  .col { display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .col span { font-size: 10px; opacity: 0.5; text-transform: uppercase; letter-spacing: 0.08em; }
  /* Magenta bg — no sprite uses this hue, so every stray/leaked pixel pops. */
  .stage { background: #ff00ff;
    border: 1px solid #555; border-radius: 4px;
    width: 100%; aspect-ratio: 1 / 1; display: flex; align-items: center; justify-content: center;
    padding: 8px; image-rendering: pixelated; }
  .stage svg, .stage img { max-width: 100%; max-height: 100%; image-rendering: pixelated;
    shape-rendering: crispEdges; display: block; }
  /* Scene preview at top */
  .scene-wrap { padding: 24px; }
  .scene-wrap h1 { margin: 0 0 12px; font-size: 16px; font-weight: 600; opacity: 0.8; }
  .scene-wrap iframe { width: 100%; aspect-ratio: 25 / 10; border: 1px solid #2e2e54;
    border-radius: 8px; background: #0d0d1a; }
</style>
</head>
<body>
<header>
  <h1>ByteFarm sprites — <span id="count">${cards.length}</span> sprites</h1>
  <label>Stage size <input type="range" id="size" min="120" max="480" value="240" /></label>
</header>
<main>
  <div class="grid" id="grid">
    ${cards
      .map(
        (c) => `
    <div class="card">
      <h2>${c.name}</h2>
      <div class="meta">${c.viewBox} · ${c.rectCount} rects</div>
      <div class="row">
        <div class="col">
          <div class="stage">${c.svg}</div>
          <span>SVG</span>
        </div>
        <div class="col">
          <div class="stage">${c.refSrc ? `<img src="${c.refSrc}" alt="${c.name} reference" />` : "<em style='opacity:0.5;font-size:11px'>no ref</em>"}</div>
          <span>Reference</span>
        </div>
      </div>
    </div>`,
      )
      .join("")}
  </div>
</main>
<script>
  const slider = document.getElementById("size");
  slider.addEventListener("input", () => {
    document.documentElement.style.setProperty(
      "--stage", slider.value + "px"
    );
    document.querySelectorAll(".grid").forEach((g) => {
      g.style.gridTemplateColumns =
        "repeat(auto-fill, minmax(" + (slider.value * 1.5) + "px, 1fr))";
    });
  });
</script>
</body>
</html>
`;

// Output into the storybook public dir so /sprites/*.png references resolve
// when we serve that directory as the docroot.
const outPath = join(pkgRoot, ".storybook/public/preview.html");
writeFileSync(outPath, html);
console.log(`Wrote ${outPath} (${cards.length} sprites)`);
