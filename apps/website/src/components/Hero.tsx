import { Link } from "@tanstack/react-router";

import { FarmBackground } from "~/components/farm-background";
import { ProjectCard } from "~/components/project-card";
import { SiteIcon } from "~/components/site-icon";
import type { ProjectGithub } from "~/components/project-github";
import { PROJECTS } from "~/components/projects";

export function Hero({ github }: { github: Record<string, ProjectGithub | null> }) {
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
            <Link to="/about" className="farm-section__cta">
              about the farm <SiteIcon name="arrow-right" size={18} />
            </Link>
          </div>
        </section>

        <section className="farm-projects" id="projects" aria-labelledby="projects-title">
          <div className="farm-projects__heading">
            <div>
              <p className="farm-intro__eyebrow">our projects</p>
              <h2 id="projects-title">what we’re growing</h2>
            </div>
          </div>
          <div className="hero__projects" aria-label="Projects">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.slug} project={project} github={github[project.slug]} />
            ))}
          </div>
        </section>

        <section className="farm-build" aria-labelledby="build-title">
          <p className="farm-intro__eyebrow">built in the open</p>
          <h2 id="build-title">grow something with us.</h2>
          <p>
            Explore the code on GitHub, or join us on Discord to ask questions, share feedback, and
            show us what you're building.
          </p>
          <div className="farm-build__actions">
            <a
              href="https://github.com/thebytefarm"
              target="_blank"
              rel="noopener noreferrer"
              className="farm-build__button"
            >
              <SiteIcon name="github" size={20} /> Visit our GitHub
            </a>
            <a
              href="https://discord.gg/dk6XfbMm48"
              target="_blank"
              rel="noopener noreferrer"
              className="farm-build__button farm-build__button--secondary"
            >
              <SiteIcon name="discord" size={20} /> Join on Discord
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
