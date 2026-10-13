import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Ascii } from "ascii.rest/react";
import type { Drawing } from "ascii.rest/kit";

import logo from "~/components/bytefarm-logo-art";
import leaf from "~/components/bytefarm-leaf-art";
import barn3Drawing from "~/components/barn3-ascii.json" with { type: "json" };
import barnReferenceArt from "~/components/barn-reference-art";
import { createBarn3Layers } from "~/components/barn3-layers";

const barnReferences = [
  {
    name: "barn3",
    art: barnReferenceArt(
      barn3Drawing as Drawing,
      "barn3",
      createBarn3Layers(barn3Drawing as Drawing),
    ),
  },
];

export const Route = createFileRoute("/ascii")({
  head: () => ({ meta: [{ title: "ASCII workshop | ByteFarm" }] }),
  component: AsciiWorkshop,
});

function AsciiWorkshop() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMono, setIsMono] = useState(false);

  return (
    <main className="ascii-workshop">
      <p className="farm-intro__eyebrow">from the workshop</p>
      <h1>ascii workshop</h1>
      <p>a little farm growing open source, one byte at a time.</p>

      <div className="ascii-workshop__controls">
        <button type="button" onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? "pause animations" : "play animations"}
        </button>
        <button type="button" aria-pressed={isMono} onClick={() => setIsMono(!isMono)}>
          {isMono ? "show brand colours" : "show plain ASCII"}
        </button>
      </div>

      <section className="ascii-workshop__brand" aria-labelledby="brand-heading">
        <h2 id="brand-heading">the brand, in ASCII</h2>
        <div className="ascii-workshop__logos">
          <figure className="ascii-workshop__leaf">
            <Ascii
              piece={leaf}
              mono={isMono}
              label="The Bytefarm leaf logo drawn in ASCII, with a diagonal vein"
              options={{ fps: isPlaying ? 15 : 0 }}
              className="ascii-workshop__text ascii-workshop__text--leaf"
              style={isMono ? undefined : { width: "100%", aspectRatio: "1" }}
            />
            <figcaption>
              <a href="/brand/bytefarm-leaf-ascii.svg" download>
                leaf SVG
              </a>
              <a href="/brand/bytefarm-leaf-ascii.txt" download>
                plain text
              </a>
            </figcaption>
          </figure>
          <figure className="ascii-workshop__wordmark">
            <Ascii
              piece={logo}
              mono={isMono}
              label="The original Bytefarm wordmark and sprouting leaf drawn in ASCII"
              options={{ fps: isPlaying ? 15 : 0 }}
              className="ascii-workshop__text ascii-workshop__text--logo"
              style={isMono ? undefined : { width: "100%", aspectRatio: "160 / 44" }}
            />
            <figcaption>
              <a href="/brand/bytefarm-logo-ascii.svg" download>
                logo SVG
              </a>
              <a href="/brand/bytefarm-logo-ascii.txt" download>
                plain text
              </a>
            </figcaption>
          </figure>
        </div>
      </section>

      <section aria-labelledby="barn-heading">
        <h2 id="barn-heading">the barn, in ASCII</h2>
        <p className="ascii-workshop__note">
          320 columns, 64 colours. Drifting clouds and gently swaying foreground grass.
        </p>
        {barnReferences.map(({ name, art }) => (
          <figure key={name}>
            <h3>{name}</h3>
            <div className="ascii-workshop__scene">
              <Ascii
                piece={art}
                mono={isMono}
                label={`${name}: an illustrated farm landscape converted to ASCII`}
                options={{ fps: isPlaying ? 12 : 0 }}
                className="ascii-workshop__text"
                style={
                  isMono
                    ? undefined
                    : { width: "100%", aspectRatio: `${art.meta.cols} / ${art.meta.rows * 2}` }
                }
              />
            </div>
            <figcaption className="ascii-workshop__controls">
              <a href={`/brand/${name}-ascii.svg`} download>
                dark SVG
              </a>
              <a href={`/brand/${name}-ascii.light.svg`} download>
                light SVG
              </a>
              <a href={`/brand/${name}-ascii.txt`} download>
                plain text
              </a>
            </figcaption>
          </figure>
        ))}
      </section>

      <p>
        built with <a href="https://ascii.rest/docs/kit/">ascii.rest/kit</a>. the brand pieces come
        from the original PNGs. the barn scene loops every two minutes.
      </p>
    </main>
  );
}
