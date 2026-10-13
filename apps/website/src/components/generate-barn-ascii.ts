import { readFile, writeFile } from "node:fs/promises";
import { readPng, sample as sampleArt } from "ascii.rest/kit";
import type { Drawing } from "ascii.rest/kit";
import { svg } from "ascii.rest/svg";

import barnReferenceArt, { inkAlphabet } from "./barn-reference-art.ts";
import { createBarn3Layers } from "./barn3-layers.ts";

type Color = [number, number, number];

function colorPalette(samples: readonly Color[]): Color[] {
  let groups: (readonly Color[])[] = [samples];
  for (let depth = 0; depth < 6; depth += 1) {
    groups = groups.flatMap((group) => {
      const ranges = [0, 1, 2].map((channel) => {
        const values = group.map((color) => color[channel]!);
        return Math.max(...values) - Math.min(...values);
      });
      const channel = ranges.indexOf(Math.max(...ranges));
      const ordered = group.toSorted((a, b) => a[channel]! - b[channel]!);
      const middle = Math.floor(ordered.length / 2);
      return [ordered.slice(0, middle), ordered.slice(middle)];
    });
  }
  return groups.map((group) => {
    const average = (channel: number) =>
      Math.round(group.reduce((sum, color) => sum + color[channel]!, 0) / group.length);
    return [average(0), average(1), average(2)];
  });
}

async function convert(source: string): Promise<Drawing> {
  const image = await readPng(await readFile(source));
  const cols = 320;
  const rows = Math.min(120, Math.max(1, Math.round((cols * image.height) / image.width / 2)));
  const samples = Array.from({ length: cols * rows }, (_, index): Color => {
    const x = index % cols;
    const y = Math.floor(index / cols);
    const left = Math.floor((x * image.width) / cols);
    const right = Math.max(left + 1, Math.floor(((x + 1) * image.width) / cols));
    const top = Math.floor((y * image.height) / rows);
    const bottom = Math.max(top + 1, Math.floor(((y + 1) * image.height) / rows));
    let red = 0;
    let green = 0;
    let blue = 0;
    for (let py = top; py < bottom; py += 1) {
      for (let px = left; px < right; px += 1) {
        const bird = [
          { left: 510 / 800, right: 545 / 800, top: 90 / 449, bottom: 114 / 449 },
          { left: 588 / 800, right: 620 / 800, top: 74 / 449, bottom: 96 / 449 },
          { left: 643 / 800, right: 680 / 800, top: 99 / 449, bottom: 126 / 449 },
        ].find(
          (box) =>
            px >= box.left * image.width &&
            px < box.right * image.width &&
            py >= box.top * image.height &&
            py < box.bottom * image.height,
        );
        // Remove the illustration's baked-in birds using nearby sky.
        const sampleY = bird ? Math.max(0, Math.floor(bird.top * image.height) - 2) : py;
        const pixel = (sampleY * image.width + px) * 4;
        red += image.data[pixel]!;
        green += image.data[pixel + 1]!;
        blue += image.data[pixel + 2]!;
      }
    }
    const count = (right - left) * (bottom - top);
    return [Math.round(red / count), Math.round(green / count), Math.round(blue / count)];
  });
  const colors = colorPalette(samples);
  const ramp = ".,:;irsXA253hMHGS#9B&@";
  const art = Array.from({ length: rows }, (_, y) =>
    samples
      .slice(y * cols, (y + 1) * cols)
      .map(([r, g, b]) => {
        const light = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        return ramp[Math.min(ramp.length - 1, Math.floor(light * ramp.length))];
      })
      .join(""),
  );
  const ink = Array.from({ length: rows }, (_, y) =>
    samples
      .slice(y * cols, (y + 1) * cols)
      .map((sample) => {
        const distances = colors.map((color) =>
          color.reduce((sum, value, channel) => sum + (value - sample[channel]!) ** 2, 0),
        );
        return inkAlphabet[distances.indexOf(Math.min(...distances))];
      })
      .join(""),
  );
  return {
    style: "shade",
    cols,
    rows,
    colors,
    art,
    ink,
    mono: art,
    knocked: false,
    ground: null,
    ramp,
  };
}

const sources = process.argv.slice(2);
if (sources.length !== 1) {
  throw new Error("Usage: node generate-barn-ascii.ts <barn3.png>");
}

await Promise.all(
  sources.map(async (source) => {
    const name = "barn3";
    const drawing = await convert(source);
    const art = barnReferenceArt(drawing, name, createBarn3Layers(drawing));
    const brand = new URL("../../public/brand/", import.meta.url);
    await Promise.all([
      writeFile(new URL(`./${name}-ascii.json`, import.meta.url), `${JSON.stringify(drawing)}\n`),
      writeFile(
        new URL(`${name}-ascii.svg`, brand),
        svg(art, { dark: true, fps: 2, budget: false }),
      ),
      writeFile(new URL(`${name}-ascii.light.svg`, brand), svg(art, { fps: 2, budget: false })),
      writeFile(new URL(`${name}-ascii.txt`, brand), `${sampleArt(art).at(0).toString()}\n`),
    ]);
    console.log(`${name}: ${art.meta.cols} × ${art.meta.rows}`);
  }),
);
