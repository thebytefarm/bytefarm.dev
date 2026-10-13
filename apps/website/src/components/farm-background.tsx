import { useState } from "react";
import { Ascii } from "ascii.rest/react";

import barn from "~/components/barn3-art";
import { SiteIcon } from "~/components/site-icon";

/**
 * Renders the farm inside the hero banner with a motion toggle.
 * @returns The animated scene, dark overlay, and pause control.
 */
export function FarmBackground() {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <>
      <div className="farm-background" aria-hidden="true">
        <div className="farm-background__scene">
          <Ascii
            piece={barn}
            options={{ fps: isPlaying ? 12 : 0 }}
            className="farm-background__art"
            style={{ width: "100%", aspectRatio: `${barn.meta.cols} / ${barn.meta.rows * 2}` }}
          />
        </div>
        <div className="farm-background__shade" />
      </div>
      <button
        type="button"
        className="farm-motion"
        aria-label={isPlaying ? "Pause scenery" : "Play scenery"}
        aria-pressed={!isPlaying}
        onClick={() => setIsPlaying(!isPlaying)}
      >
        <SiteIcon name={isPlaying ? "pause" : "play"} size={16} />
        <span className="farm-motion__tooltip" aria-hidden="true">
          {isPlaying ? "Pause scenery" : "Play scenery"}
        </span>
      </button>
    </>
  );
}
