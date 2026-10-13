import { Link } from "@tanstack/react-router";

import type { ProjectGithub } from "~/components/project-github";
import type { Project } from "~/components/projects";
import { SiteIcon } from "~/components/site-icon";
import { ProjectTechnologies } from "~/components/project-technologies";

/**
 * Renders a project card with its brand, description, and release status.
 * @param props - Catalog entry and optional live metadata.
 * @returns A linked public project or a non-clickable coming-soon card.
 */
export function ProjectCard({
  project,
  github,
}: {
  project: Project;
  github?: ProjectGithub | null;
}) {
  const version = github?.release?.tag.replace(/^.*@/, "");
  const className = `project-tile project-tile--${project.motif}`;

  const content = (
    <>
      <div className="project-tile__main">
        <div className="project-tile__body">
          <div className="project-tile__heading">
            <span className="project-tile__category">{project.category}</span>
            {version && (
              <span className="project-tile__version" aria-label={`Published version ${version}`}>
                {version.startsWith("v") ? version : `v${version}`}
              </span>
            )}
          </div>
          {project.logo ? (
            <img
              src={project.logo}
              alt={project.name}
              className="project-tile__logo"
              loading="lazy"
            />
          ) : (
            <span className="project-tile__wordmark">{project.name}</span>
          )}
          <h3 className="sr-only">{project.name}</h3>
          <p>{project.description}</p>
          <ProjectTechnologies technologies={project.technologies} />
        </div>
      </div>
      <div className="project-tile__metadata">
        <span
          className={`project-tile__status${project.status === "open source" ? "" : " project-tile__status--pending"}`}
        >
          {project.status}
        </span>
        {github && (
          <span className="project-tile__stars" aria-label={`${github.stars} GitHub stars`}>
            <SiteIcon name="star" size={14} />
            {github.stars.toLocaleString("en-US")}
          </span>
        )}
      </div>
    </>
  );

  if (project.status === "under development") {
    return (
      <article
        className={`${className} project-tile--pending`}
        aria-label={`${project.name}, coming soon`}
      >
        {content}
      </article>
    );
  }

  return (
    <Link
      to="/projects/$slug"
      params={{ slug: project.slug }}
      className={className}
      aria-label={`View ${project.name} project`}
    >
      {content}
    </Link>
  );
}
