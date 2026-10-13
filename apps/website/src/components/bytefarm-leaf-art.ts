import { fromDrawing } from "ascii.rest/kit";
import type { Drawing } from "ascii.rest/kit";

import drawing from "./bytefarm-leaf.json" with { type: "json" };

export default fromDrawing(drawing as Drawing, {
  name: "bytefarm leaf",
  category: "companies",
  glint: { every: 6 },
});
