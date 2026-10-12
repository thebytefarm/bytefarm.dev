import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/mission")({
  head: () => ({ meta: [{ title: "Our mission | ByteFarm" }] }),
  component: Mission,
});

function Mission() {
  return (
    <main className="mission">
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

        <header className="mission__heading">
          <p className="farm-intro__eyebrow">our mission</p>
          <h1>tools for the way we build now.</h1>
          <p>For the engineers building with agents, and the ones building for them.</p>
        </header>

        <div className="mission__body">
          <MissionSection title="why we’re here">
            <p>
              bytefarm is a workshop for open source. small tools, shipped in the open, built for a
              new kind of developer where you're at the wheel and agents are the engine.
            </p>
            <p>
              we build for the engineers of the next decade: the ones building with agents, and the
              ones building for them. bytefarm exists to ship the pieces we wish already existed.
            </p>
          </MissionSection>

          <MissionSection title="what we ship">
            <p>
              primary focus: tooling for the AI-coding era. that means tools that help you code with
              AI, tools that help you build with AI, and the primitives other people use to build
              their own AI developer tools.
            </p>
          </MissionSection>

          <MissionSection title="how we work">
            <p>
              in the open by default. small, opinionated, type-safe. conventional commits, batteries
              included, no nonsense. we like shipping more than meetings.
            </p>
          </MissionSection>

          <div className="mission__back">
            <Link to="/" hash="projects" className="farm-section__cta">
              explore the projects <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

type MissionSectionProps = {
  title: string;
  children: ReactNode;
};

function MissionSection({ title, children }: MissionSectionProps) {
  return (
    <section className="mission-card">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
