import { PixelButton, PixelCard, PixelChip, PixelDivider } from "@pxlkit/ui-kit";

type ProjectStatus = "live" | "coming-soon";

type Project = {
  name: string;
  description: string;
  logo: string;
  href: string;
  status: ProjectStatus;
};

const PROJECTS: Project[] = [
  {
    name: "hopper",
    description:
      "An IDE built for agents. Plan, run, and review code with your fleet by your side.",
    logo: "/projects/hopper-logo.svg",
    href: "https://github.com/thebytefarm/hopper",
    status: "coming-soon",
  },
  {
    name: "ciderpress",
    description:
      "Opinionated docs framework for monorepos. Zero-config — point it at your markdown.",
    logo: "/projects/ciderpress-logo.svg",
    href: "https://github.com/thebytefarm/ciderpress",
    status: "live",
  },
  {
    name: "maltty",
    description:
      "Full-featured CLI framework for Node.js. Prebuilt components and Storybook for the terminal.",
    logo: "/projects/maltty-logo.svg",
    href: "https://github.com/thebytefarm/maltty",
    status: "live",
  },
  {
    name: "marxml",
    description:
      "Fast markdown + XML query and mutation. Rust core with JS bindings, built for speed.",
    logo: "/projects/marxml-logo.svg",
    href: "https://github.com/thebytefarm/marxml",
    status: "live",
  },
];

export function Hero() {
  return (
    <section className="hero">
      <div className="hero__inner">
        <span className="hero__logo-wrap">
          <img src="/brand/logo.svg" alt="bytefarm" className="hero__logo" />
          <span className="hero__logo-shimmer" aria-hidden="true" />
        </span>

        <p className="hero__tagline">
          a little farm growing open source,
          <br className="hero__tagline-break" /> one byte at a time.
        </p>

        <div className="hero__divider">
          <PixelDivider spacing="sm" />
        </div>

        <div className="hero__projects" aria-label="Projects">
          {PROJECTS.map((project) => {
            const isLive = project.status === "live";
            return (
              <div
                key={project.name}
                className={`project-card${isLive ? "" : " project-card--soon"}`}
              >
                <PixelCard
                  title={
                    (
                      <span className="project-card__title">
                        <span>{project.name}</span>
                        {isLive ? (
                          <PixelChip label="alpha" tone="cyan" />
                        ) : (
                          <PixelChip label="coming soon" tone="gold" />
                        )}
                      </span>
                    ) as unknown as string
                  }
                  footer={
                    isLive ? (
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-card__cta"
                        aria-label={`view ${project.name}`}
                      >
                        <PixelButton tone="green" size="sm">
                          view →
                        </PixelButton>
                      </a>
                    ) : (
                      <PixelButton tone="green" size="sm" disabled>
                        view →
                      </PixelButton>
                    )
                  }
                >
                  <img
                    src={project.logo}
                    alt={`${project.name} logo`}
                    className="project-card__logo"
                  />
                  <p className="project-card__desc">{project.description}</p>
                </PixelCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
