import type { Drawing } from "ascii.rest/kit";

import { inkAlphabet } from "./barn-reference-art.ts";

const outline: ReadonlyArray<readonly [number, number]> = [
  [0, 47],
  [1, 45],
  [4, 43],
  [8, 42],
  [10, 40],
  [11, 36],
  [19, 33],
  [28, 33],
  [32, 29],
  [38, 25],
  [46, 23],
  [54, 24],
  [60, 27],
  [65, 23],
  [69, 22],
  [69, 20],
  [76, 18],
  [84, 16],
  [90, 14],
  [98, 12],
  [106, 12],
  [114, 13],
  [120, 16],
  [123, 20],
  [123, 27],
  [121, 32],
  [127, 32],
  [135, 32],
  [144, 34],
  [150, 38],
  [151, 41],
  [155, 41],
  [159, 39],
  [166, 39],
  [171, 42],
  [176, 44],
  [183, 46],
  [185, 49],
  [4, 49],
];

/**
 * Separates the traced barn3 cloud silhouette from a smooth, stationary sky.
 * @param drawing The converted barn3 illustration.
 * @returns The cloud mask and clean sky cells used by the animation.
 */
export function createBarn3Layers(drawing: Drawing) {
  const rgbAt = (x: number, y: number) => drawing.colors[inkAlphabet.indexOf(drawing.ink[y]![x]!)]!;
  const anchorX = Math.floor(drawing.cols * (280 / 320));
  const anchors = [0, 10, 20, 30, 38].map((row) => {
    const y = Math.floor(drawing.rows * (row / 90));
    return { y, rgb: rgbAt(anchorX, y) };
  });
  const horizontal = rgbAt(0, 0).map((value, channel) => value - anchors[0]!.rgb[channel]!);
  const skyColors = drawing.colors.flatMap(([red, green, blue], index) =>
    green > 160 && blue > red + 65 && blue >= green ? [index] : [],
  );
  const ramp = drawing.ramp ?? ".,:;irsXA253hMHGS#9B&@";
  const skyPlate = Array.from({ length: drawing.rows * drawing.cols }, (_, index) => {
    const x = index % drawing.cols;
    const y = Math.floor(index / drawing.cols);
    const upper = anchors.findLast((anchor) => anchor.y <= y) ?? anchors[0]!;
    const lower = anchors.find((anchor) => anchor.y > y);
    const left = lower ? upper : anchors[anchors.length - 2]!;
    const right = lower ?? upper;
    const blend = (y - left.y) / (right.y - left.y);
    const rgb = left.rgb.map((value, channel) =>
      Math.max(
        0,
        Math.min(
          255,
          value + (right.rgb[channel]! - value) * blend + horizontal[channel]! * (1 - x / anchorX),
        ),
      ),
    );
    const distance = (candidate: number) =>
      drawing.colors[candidate]!.reduce(
        (sum, value, channel) => sum + (value - rgb[channel]!) ** 2,
        0,
      );
    const color = skyColors.reduce(
      (nearest, candidate) => (distance(candidate) < distance(nearest) ? candidate : nearest),
      skyColors[0]!,
    );
    const light = (0.2126 * rgb[0]! + 0.7152 * rgb[1]! + 0.0722 * rgb[2]!) / 255;
    const char = ramp[Math.min(ramp.length - 1, Math.floor(light * ramp.length))]!;
    return { char, color };
  });
  const cloudMask = skyPlate.map((_, index) => {
    const x = ((index % drawing.cols) + 0.5) * (320 / drawing.cols);
    const y = (Math.floor(index / drawing.cols) + 0.5) * (90 / drawing.rows);
    return outline.reduce((inside, [ax, ay], vertex) => {
      const [bx, by] = outline[(vertex + 1) % outline.length]!;
      const crosses = ay > y !== by > y && x < ((bx - ax) * (y - ay)) / (by - ay) + ax;
      return crosses ? !inside : inside;
    }, false);
  });
  return { cloudMask, skyPlate, cloudOffsetY: Math.round(drawing.rows * (8 / 90)) };
}
