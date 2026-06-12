import { useState, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PixelButton, PixelCard, PixelDivider } from "@pxlkit/ui-kit";
import {
  AnimatedPxlKitIcon,
  PxlKitIcon,
  type AnimatedPxlKitData,
  type PxlKitData,
} from "@pxlkit/core";
import { Arrow, FireSword, Target } from "@pxlkit/gamification";
import { Footer } from "../components/Footer";

export const Route = createFileRoute("/mission")({
  component: Mission,
});

function Mission() {
  return (
    <div className="page page--scroll">
      <section className="mission">
        <div className="mission__inner">
          <div className="sprout" aria-hidden="true">
            <div className="sprout__leaves">
              <div className="sprout__leaf-slot sprout__leaf-slot--left">
                <img src="/brand/logo-icon-bare.svg" alt="" className="sprout__leaf" />
              </div>
              <div className="sprout__leaf-slot sprout__leaf-slot--right">
                <img src="/brand/logo-icon-bare.svg" alt="" className="sprout__leaf" />
              </div>
            </div>
            <div className="sprout__stem" />
            <img src="/brand/dirt.svg" alt="" className="sprout__dirt" />
          </div>

          <div className="mission__divider">
            <PixelDivider spacing="sm" />
          </div>

          <div className="mission__body">
            <MissionSection title="mission" icon={Target}>
              <p>
                bytefarm is a workshop for open source. small tools, shipped in the open, built for
                a new kind of developer where you're at the wheel and agents are the engine.
              </p>
              <p>
                we build for the engineers of the next decade: the ones building with agents, and
                the ones building for them. bytefarm exists to ship the pieces we wish already
                existed.
              </p>
            </MissionSection>

            <MissionSection title="what we ship" icon={Arrow}>
              <p>
                primary focus: tooling for the AI-coding era. that means tools that help you code
                with AI, tools that help you build with AI, and the primitives other people use to
                build their own AI developer tools.
              </p>
            </MissionSection>

            <MissionSection title="how we work" animatedIcon={FireSword}>
              <p>
                in the open by default. small, opinionated, type-safe. conventional commits,
                batteries included, no nonsense. we like shipping more than meetings.
              </p>
            </MissionSection>

            <div className="mission__back">
              <Link to="/" className="mission__back-link" aria-label="back to home">
                <PixelButton tone="green">← back home</PixelButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

type MissionSectionProps = {
  title: string;
  children: ReactNode;
} & (
  | { icon: PxlKitData; animatedIcon?: never }
  | { animatedIcon: AnimatedPxlKitData; icon?: never }
);

function MissionSection({ title, children, icon, animatedIcon }: MissionSectionProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="mission-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <PixelCard
        title={title}
        icon={
          <span className="mission-card__icon" aria-hidden="true">
            {animatedIcon ? (
              <AnimatedPxlKitIcon icon={animatedIcon} size={32} trigger="loop" playing={hovered} />
            ) : (
              <PxlKitIcon icon={icon!} size={32} />
            )}
          </span>
        }
      >
        {children}
      </PixelCard>
    </div>
  );
}
