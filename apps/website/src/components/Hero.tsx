import { Link } from "@tanstack/react-router";

import { FarmBackground } from "~/components/farm-background";

type ProjectStatus = "open source" | "in development" | "coming soon";

type Project = {
  name: string;
  description: string;
  logo?: string;
  href?: string;
  status: ProjectStatus;
};

const PROJECTS: Project[] = [
  {
    name: "ciderpress",
    description:
      "Opinionated docs framework for monorepos. Zero-config — point it at your markdown.",
    logo: "/projects/ciderpress-logo.svg",
    href: "https://github.com/thebytefarm/ciderpress",
    status: "open source",
  },
  {
    name: "maltty",
    description:
      "Full-featured CLI framework for Node.js. Prebuilt components and Storybook for the terminal.",
    logo: "/projects/maltty-logo.svg",
    href: "https://github.com/thebytefarm/maltty",
    status: "open source",
  },
  {
    name: "marxml",
    description:
      "Fast markdown + XML query and mutation. Rust core with JS bindings, built for speed.",
    logo: "/projects/marxml-logo.svg",
    href: "https://github.com/thebytefarm/marxml",
    status: "open source",
  },
  {
    name: "almanac",
    description:
      "A Git-aware index that keeps repository documentation discoverable to coding agents.",
    logo: "/projects/almanac-logo.svg",
    href: "https://github.com/thebytefarm/almanac",
    status: "open source",
  },
  {
    name: "hopper",
    description:
      "An IDE built for agents. Plan, run, and review code with your fleet by your side.",
    logo: "/projects/hopper-logo.svg",
    href: "https://github.com/thebytefarm/hopper",
    status: "coming soon",
  },
  {
    name: "granary",
    description:
      "Create and install context packs for coding agents. Package docs, coding standards, and project context so your tools have what they need.",
    status: "in development",
  },
];

export function Hero() {
  return (
    <main className="hero" id="top">
      <div className="hero__inner">
        <section className="farm-intro" aria-labelledby="farm-title">
          <FarmBackground />
          <p className="farm-intro__eyebrow">independent tools. open source roots.</p>
          <h1 id="farm-title" className="hero__logo-wrap">
            <img src="/brand/logo.svg" alt="bytefarm" className="hero__logo" />
          </h1>

          <p className="hero__tagline">
            a little farm growing open source,
            <br /> one byte at a time.
          </p>

          <a href="#projects" className="farm-intro__cta">
            see what’s growing <span aria-hidden="true">↓</span>
          </a>
        </section>

        <section className="farm-mission" aria-labelledby="mission-title">
          <div>
            <p className="farm-intro__eyebrow">why we’re here</p>
            <h2 id="mission-title">tools for the way we build now.</h2>
          </div>
          <div className="farm-mission__body">
            <p>
              We’re building developer tools for an AI-centric world. Tools to work with agents, and
              the building blocks to create AI tools of your own.
            </p>
            <p>
              From your terminal to your IDE, we’re growing the pieces we wish already existed.
              Small, opinionated, and open source by default.
            </p>
            <Link to="/mission" className="farm-section__cta">
              read our mission <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <section className="farm-projects" id="projects" aria-labelledby="projects-title">
          <div className="farm-projects__heading">
            <div>
              <p className="farm-intro__eyebrow">from the field</p>
              <h2 id="projects-title">what we’re growing</h2>
            </div>
          </div>
          <div className="hero__projects" aria-label="Projects">
            {PROJECTS.map((project) => {
              const isLive = project.status !== "coming soon" && Boolean(project.href);
              const content = (
                <>
                  <div className="project-card__title">
                    <span
                      className={`project-card__status${isLive ? "" : " project-card__status--soon"}`}
                    >
                      {project.status}
                    </span>
                    <span aria-hidden="true">{isLive ? "↗" : "—"}</span>
                  </div>
                  {project.logo ? (
                    <img
                      src={project.logo}
                      alt={project.name}
                      className="project-card__logo"
                      loading="lazy"
                    />
                  ) : (
                    <span className="project-card__wordmark">{project.name}</span>
                  )}
                  <h3 className="sr-only">{project.name}</h3>
                  <p className="project-card__desc">{project.description}</p>
                  <span className="project-card__cta">
                    {isLive ? "explore project →" : "still growing"}
                  </span>
                </>
              );
              return (
                <article
                  key={project.name}
                  className={`project-card${isLive ? "" : " project-card--soon"}`}
                >
                  {isLive ? (
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-card__body"
                      aria-label={`Explore ${project.name}`}
                    >
                      {content}
                    </a>
                  ) : (
                    <div className="project-card__body">{content}</div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <section className="farm-build" aria-labelledby="build-title">
          <p className="farm-intro__eyebrow">built in the open</p>
          <h2 id="build-title">grow something with us.</h2>
          <p>
            Use the tools. Read the source. Tell us what’s missing. The next useful piece starts
            with someone trying to build something.
          </p>
          <a
            href="https://github.com/thebytefarm"
            target="_blank"
            rel="noopener noreferrer"
            className="farm-section__cta"
          >
            join us on GitHub <span aria-hidden="true">↗</span>
          </a>
        </section>
      </div>
    </main>
  );
}
