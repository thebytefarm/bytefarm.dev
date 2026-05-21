#!/usr/bin/env node
/*
 * Build a standalone HTML scene preview by:
 *   1. Inlining every sprite SVG from src/toons/sprites/*.tsx
 *   2. Reading scene.css verbatim
 *   3. Rendering the Scene composition as static HTML matching Scene.tsx
 *
 * Output: .storybook/public/scene.html  (served by the existing preview server)
 */

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(__dirname, "..");
const spritesDir = join(pkgRoot, "src/toons/sprites");
const cssPath = join(pkgRoot, "src/toons/scene.css");

const css = readFileSync(cssPath, "utf8");

// Inline every sprite as a reusable SVG string keyed by component name.
const svgs = {};
for (const file of readdirSync(spritesDir).filter((f) => f.endsWith(".tsx"))) {
  const name = basename(file, ".tsx");
  const tsx = readFileSync(join(spritesDir, file), "utf8");
  const vbMatch = tsx.match(/viewBox="([^"]+)"/);
  if (!vbMatch) continue;
  const rects = (tsx.match(/<rect[^/]+\/>/g) ?? []).join("");
  svgs[name] = (cls) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vbMatch[1]}" class="${cls}" aria-hidden="true" shape-rendering="crispEdges" preserveAspectRatio="xMidYMid meet">${rects}</svg>`;
}

// Mirror Scene.tsx structure 1:1.
const sceneBody = `
  <div class="scene" role="img" aria-label="ByteFarm — animated pixel farm scene">
    <div class="scene__bg-sky"></div>
    <div class="scene__bg-grass"></div>
    <div class="scene__bg-dirt"></div>

    ${svgs.Cloud("cloud cloud--1")}
    ${svgs.Cloud("cloud cloud--2")}
    ${svgs.Cloud("cloud cloud--3")}
    ${svgs.Cloud("cloud cloud--4")}

    <div class="scene__logo">
      <span class="scene__logo-byte">byte</span><span class="scene__logo-farm">farm</span>
      ${svgs.Leaf("scene__logo-leaf")}
    </div>

    ${svgs.TreeOak("sprite tree--left")}
    ${svgs.AppleTree("sprite tree--apple")}

    ${svgs.Barn("sprite barn")}
    ${svgs.Silo("sprite silo")}
    ${svgs.Bush("sprite bush--barn")}

    ${svgs.Pumpkin("sprite pumpkin--1")}
    ${svgs.Sprout("sprite sprout--1")}

    ${svgs.Tractor("sprite tractor")}

    ${svgs.Corn("sprite corn corn--1")}
    ${svgs.Corn("sprite corn corn--2")}
    ${svgs.Corn("sprite corn corn--3")}
    ${svgs.Sunflower("sprite sunflower--1")}
    ${svgs.Cabbage("sprite cabbage--1")}

    ${svgs.Fence("sprite fence")}
    ${svgs.Cow("sprite cow")}
    ${svgs.Pig("sprite pig")}
    ${svgs.Chicken("sprite chicken")}

    ${svgs.TreeOak("sprite tree--right")}
    ${svgs.Windmill("sprite windmill")}
    ${svgs.LittleGuy("sprite little-guy")}
  </div>
`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>ByteFarm scene preview</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&display=swap" rel="stylesheet" />
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: #1a1a2e; color: #e6e6f0;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
  header { padding: 12px 24px; display: flex; gap: 24px; align-items: center;
    border-bottom: 1px solid #2a2a4a; position: sticky; top: 0; background: #1a1a2e; z-index: 50; }
  header h1 { margin: 0; font-size: 14px; font-weight: 600; }
  header label { font-size: 12px; display: flex; gap: 8px; align-items: center; }
  header input { accent-color: #6dd33b; }
  .frame { padding: 24px; display: flex; flex-direction: column; gap: 24px; }
  .frame .panel { background: #0d0d1a; border: 1px solid #2a2a4a; border-radius: 8px;
    padding: 8px; }
  .frame .panel h2 { margin: 0 0 6px; font-size: 11px; text-transform: uppercase;
    letter-spacing: 0.08em; opacity: 0.6; }
  .stack { display: flex; flex-direction: column; gap: 0; }
  .ref { width: 100%; aspect-ratio: 25 / 10; image-rendering: pixelated; display: block; }
  /* Overlay mode */
  .overlay-wrap { position: relative; width: 100%; aspect-ratio: 25 / 10; }
  .overlay-wrap > .scene { position: absolute; inset: 0; }
  .overlay-wrap > .ref { position: absolute; inset: 0; opacity: var(--ref-opacity, 0); pointer-events: none;
    z-index: 100; }
  /* embedded scene.css */
${css}
</style>
</head>
<body>
<header>
  <h1>ByteFarm scene</h1>
  <label>Reference overlay <input type="range" id="op" min="0" max="100" value="0" /> <span id="opv">0%</span></label>
  <label><input type="checkbox" id="stacked" /> Stacked view</label>
</header>
<main class="frame">
  <div class="panel" id="single">
    <h2>Live scene (overlay slider above)</h2>
    <div class="overlay-wrap">
      ${sceneBody}
      <img class="ref" src="/bytefarm-reference.png" alt="reference" />
    </div>
  </div>

  <div class="panel" id="stack" hidden>
    <h2>Reference</h2>
    <img class="ref" src="/bytefarm-reference.png" alt="reference" />
    <h2 style="margin-top:12px">Live scene</h2>
    ${sceneBody.replace('id="single"', "")}
  </div>
</main>
<script>
  const op = document.getElementById("op");
  const opv = document.getElementById("opv");
  op.addEventListener("input", () => {
    document.documentElement.style.setProperty("--ref-opacity", (op.value / 100).toFixed(2));
    opv.textContent = op.value + "%";
  });
  const stacked = document.getElementById("stacked");
  stacked.addEventListener("change", () => {
    document.getElementById("single").hidden = stacked.checked;
    document.getElementById("stack").hidden = !stacked.checked;
  });
</script>
</body>
</html>
`;

const outPath = join(pkgRoot, ".storybook/public/scene.html");
writeFileSync(outPath, html);
console.log(`Wrote ${outPath}`);
