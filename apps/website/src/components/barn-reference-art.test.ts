import { sample } from "ascii.rest/kit";
import type { Drawing } from "ascii.rest/kit";
import { describe, expect, it } from "vitest";

import barn3 from "./barn3-ascii.json" with { type: "json" };
import barnReferenceArt, { inkAlphabet } from "./barn-reference-art";
import { createBarn3Layers } from "./barn3-layers";

describe("barn3 animation", () => {
  const drawing = barn3 as Drawing;
  const layers = createBarn3Layers(drawing);
  const art = barnReferenceArt(drawing, "barn3", layers);
  const sampler = sample(art);

  it("moves and returns to the same frame after one loop", () => {
    const start = sampler.at(0).clone();
    const moving = sampler.at(3).clone();
    const end = sampler.at(120).clone();
    expect(moving.toString()).not.toBe(start.toString());
    expect(end.toString()).toBe(start.toString());
    expect(end.colors).toEqual(start.colors);
  });

  it("moves clouds only to the right without adding birds", () => {
    const y = Math.floor(drawing.rows * 0.2);
    const cloudCells = [...drawing.ink[y]!].flatMap((ink, x) => {
      const [red, green, blue] = drawing.colors[inkAlphabet.indexOf(ink)]!;
      return red > 190 && green > 190 && blue > 165 && x < drawing.cols - 12 ? [x] : [];
    });
    expect(cloudCells.length).toBeGreaterThan(0);
    for (const t of [1, 2]) {
      const frame = sampler.at(t).clone();
      const shift = Math.floor((t * drawing.cols) / 120);
      for (const x of cloudCells) {
        expect(frame.get(x + shift, y + layers.cloudOffsetY)).toBe(drawing.art[y]![x]);
        expect(frame.colorAt(x + shift, y + layers.cloudOffsetY)).toBe(
          inkAlphabet.indexOf(drawing.ink[y]![x]!),
        );
      }
      expect(frame.toString()).not.toMatch(/[\\/‾_]/);
    }
  });

  it("moves cloud shading with the highlights without leaving a shadow", () => {
    const cloudDrawing = {
      style: "shade",
      cols: 8,
      rows: 2,
      colors: [
        [100, 182, 220],
        [110, 189, 222],
        [118, 195, 224],
        [124, 199, 226],
        [249, 247, 232],
        [173, 216, 222],
        [97, 151, 168],
      ],
      art: ["abWHcdxy", "RRRRRRRR"],
      ink: ["01452301", "66666666"],
    } as Drawing;
    const cloudLayers = {
      cloudMask: Array.from({ length: 16 }, (_, index) => index === 2 || index === 3),
      skyPlate: cloudDrawing.art.flatMap((row, y) =>
        [...row].map((char, x) => ({
          char: y === 0 && x === 2 ? "b" : y === 0 && x === 3 ? "c" : char,
          color:
            y === 0 && x === 2
              ? 1
              : y === 0 && x === 3
                ? 2
                : inkAlphabet.indexOf(cloudDrawing.ink[y]![x]!),
        })),
      ),
    };
    const frame = sample(barnReferenceArt(cloudDrawing, "cloud-shading", cloudLayers))
      .at(60)
      .clone();
    expect(frame.get(6, 0)).toBe("W");
    expect(frame.colorAt(6, 0)).toBe(4);
    expect(frame.get(7, 0)).toBe("H");
    expect(frame.colorAt(7, 0)).toBe(5);
    expect(frame.colorAt(2, 0)).toBe(1);
    expect(frame.colorAt(3, 0)).toBe(2);
    expect(frame.get(0, 0)).toBe("a");
    expect(frame.colorAt(0, 0)).toBe(0);
    expect(frame.get(1, 0)).toBe("b");
    expect(frame.colorAt(1, 0)).toBe(1);
    for (let x = 0; x < cloudDrawing.cols; x += 1) {
      expect(frame.get(x, 1)).toBe("R");
      expect(frame.colorAt(x, 1)).toBe(6);
    }

    const occluded = {
      ...cloudDrawing,
      art: ["abWHcdRR", "RRRRRRRR"],
      ink: ["01452366", "66666666"],
    };
    const behindRoof = sample(barnReferenceArt(occluded, "cloud-occlusion", cloudLayers))
      .at(60)
      .clone();
    expect(behindRoof.colorAt(2, 0)).toBe(1);
    expect(behindRoof.colorAt(3, 0)).toBe(2);
    expect(behindRoof.get(6, 0)).toBe("R");
    expect(behindRoof.get(7, 0)).toBe("R");

    const paleShading = {
      ...cloudDrawing,
      colors: cloudDrawing.colors.map((color, index) => (index === 5 ? [159, 219, 233] : color)),
    } as Drawing;
    const paleFrame = sample(barnReferenceArt(paleShading, "pale-shading", cloudLayers))
      .at(60)
      .clone();
    expect(paleFrame.colorAt(7, 0)).toBe(5);
    expect(paleFrame.colorAt(3, 0)).toBe(2);
  });

  it("reveals the clean sky plate without source-cloud streaks", () => {
    const frame = sampler.at(60).clone();
    let cleared = 0;
    for (let y = 14; y < 40; y += 1) {
      for (let x = 0; x < 160; x += 1) {
        const index = y * drawing.cols + x;
        const source = (y - layers.cloudOffsetY) * drawing.cols + ((x + 160) % drawing.cols);
        if (!layers.cloudMask[index] || layers.cloudMask[source]) continue;
        expect(frame.get(x, y)).toBe(layers.skyPlate[index]!.char);
        expect(frame.colorAt(x, y)).toBe(layers.skyPlate[index]!.color);
        cleared += 1;
      }
    }
    expect(cleared).toBeGreaterThan(1000);
  });

  it("keeps the clear upper sky fixed throughout the cloud loop", () => {
    const start = sampler.at(0).clone();
    for (const t of [3, 15, 30, 45, 59]) {
      const frame = sampler.at(t).clone();
      for (let y = 0; y < 8; y += 1) {
        for (let x = 0; x < drawing.cols; x += 1) {
          expect(frame.get(x, y)).toBe(start.get(x, y));
          expect(frame.colorAt(x, y)).toBe(start.colorAt(x, y));
        }
      }
    }
  });

  it("keeps the red barns stationary", () => {
    const start = sampler.at(0).clone();
    const moving = sampler.at(3).clone();
    const barnCells = drawing.ink.flatMap((row, y) =>
      [...row].flatMap((ink, x) => {
        const [red, green, blue] = drawing.colors[inkAlphabet.indexOf(ink)]!;
        return red > green * 1.2 && red > blue * 1.2 ? [{ x, y }] : [];
      }),
    );
    expect(barnCells.length).toBeGreaterThan(0);
    for (const { x, y } of barnCells) {
      expect(moving.get(x, y)).toBe(start.get(x, y));
      expect(moving.colorAt(x, y)).toBe(start.colorAt(x, y));
    }
  });

  it("keeps field colours steady without a moving shine", () => {
    expect(art.meta.palette).toHaveLength(64);
    const start = sampler.at(0).clone();
    const moving = sampler.at(6).clone();
    for (let y = Math.ceil(drawing.rows * 0.6); y < drawing.rows * 0.74; y += 1) {
      for (let x = 0; x < drawing.cols; x += 1) {
        expect(moving.get(x, y)).toBe(start.get(x, y));
        expect(moving.colorAt(x, y)).toBe(start.colorAt(x, y));
      }
    }
  });

  it("sways the close grass while keeping the middle and roots still", () => {
    const start = sampler.at(0).clone();
    const moving = sampler.at(3).clone();
    let moved = 0;
    for (let y = Math.ceil(drawing.rows * 0.74); y < drawing.rows; y += 1) {
      for (let x = 0; x < drawing.cols; x += 1) {
        const isStill =
          (x >= drawing.cols * 0.3 && x <= drawing.cols * 0.67) || y >= drawing.rows - 3;
        if (isStill) {
          expect(moving.get(x, y)).toBe(start.get(x, y));
          expect(moving.colorAt(x, y)).toBe(start.colorAt(x, y));
        } else if (
          moving.get(x, y) !== start.get(x, y) ||
          moving.colorAt(x, y) !== start.colorAt(x, y)
        ) {
          moved += 1;
        }
      }
    }
    expect(moved).toBeGreaterThan(0);
  });
});
