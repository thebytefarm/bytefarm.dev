import { parseIconCode, type PxlKitData } from "@pxlkit/core";

const DISCORD_ICON_CODE = `{
  "name": "discord",
  "size": 32,
  "category": "social",
  "grid": [
    "................................",
    "................................",
    ".....BBBBBBBBBBBBBBBBBBBBBB.....",
    "...BBBBBBBBBBBBBBBBBBBBBBBBBB...",
    "..BBBBBBBBBBBBBBBBBBBBBBBBBBBB..",
    ".BBBBBBBBBBBBBBBBBBBBBBBBBBBBBB.",
    ".BBBBBBBBBBBBBBBBBBBBBBBBBBBBBB.",
    "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
    "BBBBBB..BBBB......BBBB....BBBBBB",
    "BBBBB...BBBB......BBBB....BBBBBB",
    "BBBBB...BBBB......BBBB....BBBBBB",
    "BBBBB...BBBB......BBBB....BBBBBB",
    "BBBBBB..BBBB......BBBB....BBBBBB",
    "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
    "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
    "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
    "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
    ".BBBBBBBBBBBBBBBBBBBBBBBBBBBBBB.",
    ".BBBBBBBBBBBBBBBBBBBBBBBBBBBBBB.",
    "..BBBBBBBBBBBBBBBBBBBBBBBBBBBB..",
    "...BBBBBBBBBBBBBBBBBBBBBBBBBB...",
    ".....BBBBBBBBBBBBBBBBBBBBBB.....",
    "......BBBBBBBBBBBBBBBBBB........",
    ".....BBBBBBBBBBBBBBBB...........",
    "....BBBBBBBBBBBBB...............",
    "...BBBBBBBBBBB..................",
    "..BBBBBBBBB.....................",
    ".BBBBBBB........................",
    "BBBBBB..........................",
    "BBBB............................",
    "BB..............................",
    "................................"
  ],
  "palette": {
    "B": "#FFFFFF"
  },
  "tags": ["discord", "chat", "community", "logo"]
}`;

const parsed = parseIconCode(DISCORD_ICON_CODE);
if (!parsed) {
  throw new Error("Failed to parse discord icon code");
}

export const DiscordIcon: PxlKitData = parsed;
