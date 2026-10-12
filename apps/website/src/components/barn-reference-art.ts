import { clamp, piece } from "ascii.rest/kit";
import type { Drawing } from "ascii.rest/kit";

export const inkAlphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/";

export default function barnReferenceArt(
  drawing: Drawing,
  name: string,
  layers: {
    cloudMask: readonly boolean[];
    cloudOffsetY?: number;
    skyPlate: ReadonlyArray<{ char: string; color: number }>;
  },
) {
  const loop = 120;
  const colors = drawing.colors.map(
    (color) => `#${color.map((value) => value.toString(16).padStart(2, "0")).join("")}`,
  );
  const cells = drawing.art.flatMap((row, y) =>
    [...row].map((char, x) => {
      const color = inkAlphabet.indexOf(drawing.ink[y]?.[x] ?? "0");
      const [red, green, blue] = drawing.colors[color]!;
      const cloudColor = red > 150 && green > 190 && blue > 165 && blue - red < 65;
      const sky =
        y < drawing.rows * 0.6 &&
        ((green > 160 && blue > red + 15 && blue >= green * 0.9) || cloudColor);
      const cloud = sky && layers.cloudMask[y * drawing.cols + x]!;
      const grass =
        y > drawing.rows * 0.74 &&
        (x < drawing.cols * 0.3 || x > drawing.cols * 0.67) &&
        red < 125 &&
        green > red * 1.08 &&
        green > blue * 1.2;
      return { x, y, char, color, sky, cloud, grass };
    }),
  );
  return piece(
    {
      name,
      category: "scenes",
      cols: drawing.cols,
      rows: drawing.rows,
      cell: 2,
      fps: 12,
      loop,
      still: 0,
      ground: "#14131e",
      palette: colors,
    },
    (t, surface) => {
      const phase = ((t % 12) / 12) * Math.PI * 2;
      const drift = Math.floor(((t % loop) / loop) * drawing.cols);
      cells.forEach((cell) => {
        const { x, y } = cell;
        let { char, color } = cell;
        if (cell.sky) {
          const sourceX = (x - drift + drawing.cols) % drawing.cols;
          const sourceY = y - (layers.cloudOffsetY ?? 0);
          const source = sourceY >= 0 ? cells[sourceY * drawing.cols + sourceX] : undefined;
          ({ char, color } = layers.skyPlate[y * drawing.cols + x]!);
          if (source?.cloud) ({ char, color } = source);
        }
        if (cell.grass) {
          const tipHeight = clamp((drawing.rows - 1 - y) / (drawing.rows * 0.26));
          const sway = Math.round(Math.sin(phase + x * 0.025) * tipHeight * 1.8);
          const sourceX = clamp(x + sway, 0, drawing.cols - 1);
          const source = cells[y * drawing.cols + sourceX]!;
          if (source.grass) ({ char, color } = source);
        }
        surface.set(x, y, char, color);
      });
    },
  );
}
