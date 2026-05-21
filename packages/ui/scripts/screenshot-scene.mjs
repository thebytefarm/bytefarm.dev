#!/usr/bin/env node
/*
 * Headless-Chrome screenshot of a Storybook story, then composite
 * reference + live into a diff image.
 */

import { execSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "../../..");
const tmpDir = join(repoRoot, ".tmp-screenshots");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const STORY = process.argv[2] ?? "toons-scene--live";
const url = `http://localhost:6006/iframe.html?id=${STORY}&viewMode=story`;
const out = join(tmpDir, `scene-${STORY.replace("toons-scene--", "")}.png`);

execSync(
  `"${CHROME}" --headless=new --disable-gpu --hide-scrollbars --window-size=2000,900 --virtual-time-budget=8000 --screenshot="${out}" "${url}"`,
  { stdio: "ignore" },
);

const ref = join(repoRoot, "packages/ui/.storybook/public/bytefarm-reference.png");
const refResized = join(tmpDir, "ref-2000.png");
const liveResized = join(tmpDir, "live-2000.png");
const sxs = join(tmpDir, "scene-vs-ref.png");

execSync(`magick "${ref}" -resize 2000x "${refResized}"`);
execSync(`magick "${out}" -resize 2000x "${liveResized}"`);
execSync(`magick "${refResized}" "${liveResized}" -append "${sxs}"`);
console.log(`Live: ${out}`);
console.log(`SxS:  ${sxs}`);
