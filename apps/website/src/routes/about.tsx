import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteIcon } from "~/components/site-icon";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About | ByteFarm" },
      {
        name: "description",
        content:
          "ByteFarm is an independent workshop for open source developer tools. Meet the team, read our mission, and see how we work.",
      },
    ],
  }),
  component: About,
});

function About() {
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
          <p className="farm-intro__eyebrow">about bytefarm</p>
          <h1>a little farm for open source.</h1>
          <p>
            Independent tools for engineers building with agents, and the ones building for them.
          </p>
        </header>

        <div className="mission__body">
          <AboutSection title="what is bytefarm?">
            <p>
              ByteFarm is an independent workshop for open source developer tools. We build the
              pieces we wish already existed, from documentation frameworks to tools for working
              with coding agents.
            </p>
          </AboutSection>

          <AboutSection title="our mission">
            <p>
              Build useful tools for the way engineers work now. Agents are part of the workflow,
              and the tools around them should make it easier to plan, build, and review software.
            </p>
            <p>
              We build for the engineers using agents and the ones creating tools of their own.
              You're at the wheel. The tools should help you stay there.
            </p>
          </AboutSection>

          <AboutSection title="what we build">
            <p>
              Documentation sites, typed terminal apps, and the context agents need to work inside a
              repository. Some projects are tools you can use today. Others are building blocks for
              your own developer tools.
            </p>
          </AboutSection>

          <AboutSection title="who’s behind it">
            <p>
              The core ByteFarm team previously built{" "}
              <a href="https://joggr.ai" target="_blank" rel="noopener noreferrer">
                joggr.ai
              </a>
              . Our projects grow out of the tools we use and the friction we run into while
              building software.
            </p>
          </AboutSection>

          <AboutSection title="how we work">
            <p>
              Small, opinionated tools, shipped in the open. We care about types, useful docs, and
              making the everyday work less tedious. Try a project, read the source, or tell us
              what's missing.
            </p>
            <p>We like shipping more than meetings.</p>
          </AboutSection>

          <div className="mission__back">
            <Link to="/" hash="projects" className="farm-section__cta">
              explore the projects <SiteIcon name="arrow-right" size={18} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

type AboutSectionProps = {
  title: string;
  children: ReactNode;
};

function AboutSection({ title, children }: AboutSectionProps) {
  return (
    <section className="mission-card">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
