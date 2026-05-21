import { PixelDivider } from "@pxlkit/ui-kit";

type Project = {
  name: string;
  logo: string;
  href: string;
};

const PROJECTS: Project[] = [
  {
    name: "hopper",
    logo: "/logos/hopper.png",
    href: "https://github.com/thebytefarm/hopper",
  },
  {
    name: "zpress",
    logo: "/logos/zpress.svg",
    href: "https://github.com/thebytefarm/zpress",
  },
  {
    name: "kidd",
    logo: "/logos/kidd.svg",
    href: "https://github.com/thebytefarm/kidd",
  },
];

export function Hero() {
  return (
    <section className="hero">
      <div className="hero__inner">
        <img
          src="/logos/bytefarm-wordmark.png"
          alt="bytefarm"
          className="hero__logo"
        />

        <p className="hero__tagline">
          a little farm growing open source,
          <br className="hero__tagline-break" /> one byte at a time.
        </p>

        <div className="hero__divider">
          <PixelDivider spacing="sm" />
        </div>

        <div className="hero__projects" aria-label="Projects">
          {PROJECTS.map((project) => (
            <a
              key={project.name}
              className="project-card"
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={project.name}
            >
              <img
                src={project.logo}
                alt={project.name}
                className="project-card__logo"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
