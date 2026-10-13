import { writeFile } from "node:fs/promises";
import { fromDrawing, fromImage, sample } from "ascii.rest/kit";
import type { Drawing } from "ascii.rest/kit";
import { svg } from "ascii.rest/svg";

import barnReferenceArt from "./barn-reference-art.ts";
import barn3 from "./barn3-ascii.json" with { type: "json" };
import { createBarn3Layers } from "./barn3-layers.ts";

const brand = new URL("../../public/brand/", import.meta.url);

await Promise.all(
  [
    { name: "bytefarm-logo", file: "logo.png", width: 160 },
    { name: "bytefarm-leaf", file: "logo-icon.png", width: 48 },
  ].map(async (image) => {
    const source = await fromImage(new URL(image.file, brand), {
      name: image.name,
      category: "companies",
      width: image.width,
      style: "logo",
      background: "remove",
      glint: { every: 6 },
    });
    const drawing = {
      ...source.drawing,
      art: source.drawing.art.map((row, y) =>
        [...row]
          .map((char, x) => {
            const index = Number.parseInt(source.drawing.ink[y]?.[x] ?? " ", 36);
            const color = source.drawing.colors[index];
            return char === "8" && color && color[0] < 100 && color[1] > color[0] && color[2] < 20
              ? ":"
              : char;
          })
          .join(""),
      ),
      knocked: false,
    };
    const art = fromDrawing(
      { ...drawing, mono: drawing.art },
      {
        name: image.name,
        category: "companies",
        glint: { every: 6 },
      },
    );
    await Promise.all([
      writeFile(
        new URL(`./${image.name}.json`, import.meta.url),
        `${JSON.stringify(art.drawing)}\n`,
      ),
      writeFile(new URL(`${image.name}-ascii.svg`, brand), svg(art, { dark: true, fps: 10 })),
      writeFile(new URL(`${image.name}-ascii.light.svg`, brand), svg(art, { fps: 10 })),
      writeFile(new URL(`${image.name}-ascii.txt`, brand), `${art.drawing.art.join("\n")}\n`),
    ]);
    console.log(`${image.name}: ${art.meta.cols} × ${art.meta.rows}`);
  }),
);

await Promise.all(
  [barn3].map(async (source) => {
    const name = "barn3";
    const drawing = source as Drawing;
    const art = barnReferenceArt(drawing, name, createBarn3Layers(drawing));
    await Promise.all([
      writeFile(
        new URL(`${name}-ascii.svg`, brand),
        svg(art, { dark: true, fps: 2, budget: false }),
      ),
      writeFile(new URL(`${name}-ascii.light.svg`, brand), svg(art, { fps: 2, budget: false })),
      writeFile(new URL(`${name}-ascii.txt`, brand), `${sample(art).at(0).toString()}\n`),
    ]);
    console.log(`${name}: ${art.meta.cols} × ${art.meta.rows}`);
  }),
);
