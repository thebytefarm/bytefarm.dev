import type { Drawing } from "ascii.rest/kit";

import drawing from "./barn3-ascii.json" with { type: "json" };
import barnReferenceArt from "./barn-reference-art.ts";
import { createBarn3Layers } from "./barn3-layers.ts";

export default barnReferenceArt(drawing as Drawing, "barn3", createBarn3Layers(drawing as Drawing));
