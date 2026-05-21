import { parseIconCode, type PxlKitData } from "@pxlkit/core";

const GITHUB_ICON_CODE = `{
  "name": "github",
  "size": 32,
  "category": "social",
  "grid": [
    "............BBBBBBBB............",
    ".........BBBBBBBBBBBBBB.........",
    ".......BBBBBBBBBBBBBBBBBB.......",
    "......BBBBBBBBBBBBBBBBBBBB......",
    ".....BBBBBBBBBBBBBBBBBBBBBB.....",
    "....BBBBBBBBBBBBBBBBBBBBBBBB....",
    "...BBBBBBBBBBBBBBBBBBBBBBBBBB...",
    "..BBBBB....BBBBBBBBBB....BBBBB..",
    "..BBBBB..................BBBBB..",
    ".BBBBBB..................BBBBBB.",
    ".BBBBBB..................BBBBBB.",
    ".BBBBBB..................BBBBBB.",
    "BBBBBB....................BBBBBB",
    "BBBBBB....................BBBBBB",
    "BBBBBB....................BBBBBB",
    "BBBBBB....................BBBBBB",
    "BBBBBB....................BBBBBB",
    "BBBBBB....................BBBBBB",
    "BBBBBB....................BBBBBB",
    "BBBBBBB..................BBBBBBB",
    ".BBBBBB..................BBBBBB.",
    ".BBBBBBBB...............BBBBBBB.",
    ".BBBB.BBBBB...........BBBBBBBBB.",
    "..BBB..BBBBBB......BBBBBBBBBBB..",
    "..BBBB..BBBB........BBBBBBBBBB..",
    "...BBBB...B.........BBBBBBBBB...",
    "....BBB.............BBBBBBBB....",
    ".....BBBB...........BBBBBBB.....",
    "......BBBBBB........BBBBBB......",
    ".......BBBBB........BBBBB.......",
    ".........BBB........BBB.........",
    "................................"
  ],
  "palette": {
    "B": "#FFFFFF"
  },
  "tags": ["github", "octocat", "git", "code", "logo"]
}`;

const parsed = parseIconCode(GITHUB_ICON_CODE);
if (!parsed) {
  throw new Error("Failed to parse github icon code");
}

export const GithubIcon: PxlKitData = parsed;
