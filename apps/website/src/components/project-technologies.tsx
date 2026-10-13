const TECHNOLOGIES = {
  TypeScript: { label: "TypeScript" },
  Rust: { label: "Rust" },
  Markdown: { label: "Markdown" },
  Bun: { label: "Bun" },
} as const;

export type ProjectTechnology = keyof typeof TECHNOLOGIES;

/**
 * Shows only a project's primary languages, formats, and runtime.
 * @param props - Core technologies confirmed for the project.
 * @returns Compact badges with colored Iconify brand marks.
 */
export function ProjectTechnologies({
  technologies,
}: {
  technologies: readonly ProjectTechnology[];
}) {
  if (technologies.length === 0) return null;

  return (
    <ul className="project-technologies" aria-label="Core technologies">
      {technologies.map((name) => {
        const technology = TECHNOLOGIES[name];
        return (
          <li key={name} title={technology.label}>
            <img
              className="project-technologies__icon"
              src={`/projects/${name.toLowerCase()}-icon.svg`}
              width={18}
              height={18}
              alt=""
              aria-hidden="true"
            />
            <span className="sr-only">{technology.label}</span>
          </li>
        );
      })}
    </ul>
  );
}
