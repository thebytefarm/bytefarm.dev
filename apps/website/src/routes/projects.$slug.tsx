import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { InstallCommand } from "~/components/install-command";
import { getProjectGithub } from "~/components/project-github";
import { getProject, PROJECTS } from "~/components/projects";
import { SiteIcon } from "~/components/site-icon";
import { ProjectTechnologies } from "~/components/project-technologies";
import projectPageCss from "~/styles/project-page.css?url";

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ params }) => {
    const project = getProject(params.slug);
    if (!project || project.status === "under development") throw notFound();
    const github = await getProjectGithub({ data: params.slug });
    const otherProjects = PROJECTS.filter(
      (other) => other.slug !== project.slug && other.status === "open source",
    )
      .map((other) => ({ project: other, rank: Math.random() }))
      .toSorted((a, b) => a.rank - b.rank)
      .slice(0, 3)
      .map(({ project: other }) => other);
    return { project, github, otherProjects };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.project.name} | ByteFarm` : "Project | ByteFarm" },
      { name: "description", content: loaderData?.project.description },
    ],
    links: [{ rel: "stylesheet", href: projectPageCss }],
  }),
  component: ProjectPage,
});

function ProjectPage() {
  const { project, github, otherProjects } = Route.useLoaderData();
  const release = github?.release;

  return (
    <main className="project-page">
      <nav className="project-page__breadcrumb" aria-label="Breadcrumb">
        <Link to="/" hash="projects">
          <SiteIcon name="arrow-left" size={16} /> all projects
        </Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{project.name}</span>
      </nav>

      <header className="project-page__hero">
        <div className="project-page__identity">
          <div className="project-page__brand">
            {project.logo && <img src={project.logo} alt="" className="project-page__logo" />}
            <h1 className={project.logo ? "project-page__sr-only" : undefined}>{project.name}</h1>
          </div>
          <div className="project-page__tags">
            <span>{project.category}</span>
            <span className="project-page__status">
              <span className="project-page__status-light" aria-hidden="true" />
              {project.status}
            </span>
          </div>
          <p className="project-page__description">{project.description}</p>
          <p className="project-page__summary">{project.summary}</p>
          <div className="project-page__links">
            {project.docsUrl && (
              <a
                className="project-page__cta"
                href={project.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiteIcon name="book-open" size={18} /> Read the docs
              </a>
            )}
            {project.href && (
              <a
                className={`project-page__cta${project.docsUrl ? " project-page__cta--secondary" : ""}`}
                href={github?.url ?? project.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiteIcon name="github" size={18} /> View on GitHub
              </a>
            )}
          </div>
        </div>
        <figure className="project-page__screenshot">
          {project.screenshot ? (
            <>
              <img src={project.screenshot.src} alt={project.screenshot.alt} />
              {project.screenshot.caption && <figcaption>{project.screenshot.caption}</figcaption>}
            </>
          ) : (
            <div className="project-page__image-placeholder">
              <SiteIcon name="image" size={48} />
              <span>{project.name} preview</span>
              <p>Screenshot coming soon</p>
            </div>
          )}
        </figure>
      </header>

      {(github || project.technologies.length > 0) && (
        <dl className="project-page__metadata" aria-label="GitHub project metadata">
          {github && (
            <div>
              <dt>GitHub stars</dt>
              <dd>{github.stars.toLocaleString("en-US")}</dd>
            </div>
          )}
          {project.technologies.length > 0 && (
            <div>
              <dt>Core technologies</dt>
              <dd>
                <ProjectTechnologies technologies={project.technologies} />
              </dd>
            </div>
          )}
          {release && (
            <div>
              <dt>Latest release</dt>
              <dd>
                <a href={release.url}>
                  {release.tag} <SiteIcon name="external-link" size={16} />
                </a>
              </dd>
            </div>
          )}
        </dl>
      )}

      <div className="project-page__workbench">
        <section className="project-page__preview" aria-labelledby="project-preview-title">
          <div className="project-page__section-heading">
            <h2 id="project-preview-title">{project.command ? "Getting started" : "Status"}</h2>
          </div>
          {project.command ? (
            <InstallCommand key={project.command} command={project.command} />
          ) : (
            <div className="project-page__terminal">
              <div className="project-page__development">
                <p className="project-page__development-status">{project.status}</p>
                <p>{project.summary}</p>
                <p className="project-page__development-note">
                  {project.status === "under development"
                    ? "Actively being built. A public preview will land here when it’s ready."
                    : "Explore the repository for setup instructions and usage examples."}
                </p>
              </div>
            </div>
          )}
        </section>

        <section
          className="project-page__capabilities"
          aria-labelledby="project-capabilities-title"
        >
          <div className="project-page__section-heading">
            <h2 id="project-capabilities-title">
              {project.status === "under development" ? "Planned features" : "Features"}
            </h2>
          </div>
          <ul>
            {project.features.map((feature) => (
              <li key={feature.text}>
                <SiteIcon name={feature.icon} size={24} />
                <span>{feature.text}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {otherProjects.length > 0 && (
        <section className="project-page__others" aria-labelledby="project-others-title">
          <div className="project-page__others-heading">
            <h2 id="project-others-title">More from the farm</h2>
            <Link to="/" hash="projects" className="project-page__text-link">
              all projects <SiteIcon name="arrow-right" size={16} />
            </Link>
          </div>
          <div className="project-page__project-links">
            {otherProjects.map((other) => (
              <Link
                key={other.slug}
                to="/projects/$slug"
                params={{ slug: other.slug }}
                className="project-page__project-link"
              >
                <span className="project-page__related-category">{other.category}</span>
                <span className="project-page__related-name">
                  {other.name}
                  <SiteIcon name="arrow-right" size={18} />
                </span>
                <span className="project-page__related-description">{other.description}</span>
                <span className="project-page__related-status">{other.status}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
