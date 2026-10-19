import type { SiteIconName } from "~/components/site-icon";
import type { ProjectTechnology } from "~/components/project-technologies";

export type Project = {
  slug: string;
  name: string;
  description: string;
  summary: string;
  logo?: string;
  href?: string;
  docsUrl?: string;
  screenshot?: {
    src: string;
    alt: string;
    caption?: string;
  };
  status: "open source" | "under development";
  category: string;
  technologies: readonly ProjectTechnology[];
  features: readonly { text: string; icon: SiteIconName }[];
  command?: string;
  output: readonly string[];
  motif: "press" | "terminal" | "query" | "index" | "agents" | "storage";
};

export const PROJECTS: readonly Project[] = [
  {
    slug: "ciderpress",
    name: "ciderpress",
    description:
      "A documentation framework for monorepos. Point it at your existing markdown and get a full site.",
    summary: "Press your existing markdown into a documentation site that fits your repository.",
    logo: "/projects/ciderpress-logo.svg",
    href: "https://github.com/thebytefarm/ciderpress",
    docsUrl: "https://ciderpress.dev",
    screenshot: {
      src: "/projects/ciderpress-preview.png",
      alt: "Ciderpress Quick Start documentation with sidebar navigation and highlighted code examples",
    },
    status: "open source",
    category: "documentation framework",
    technologies: ["TypeScript", "Markdown"],
    features: [
      { text: "Fits your repository", icon: "folder" },
      {
        text: "One config for the whole site",
        icon: "sliders",
      },
      { text: "Four themes, plus custom themes", icon: "layout" },
      { text: "Monorepo-ready integrations", icon: "code" },
    ],
    command: "npm install ciderpress",
    output: ["existing markdown → documentation site", "dev · build · serve"],
    motif: "press",
  },
  {
    slug: "maltty",
    name: "maltty",
    description: "A typed CLI framework with file-based command loading and TUI component stories.",
    summary:
      "Build commands that load like routes and develop TUI components in a Storybook-style terminal viewer.",
    logo: "/projects/maltty-logo.svg",
    href: "https://github.com/thebytefarm/maltty",
    docsUrl: "https://maltty.sh",
    screenshot: {
      src: "/projects/maltty-preview.svg",
      alt: "Maltty development terminal beside a typed deploy command",
    },
    status: "open source",
    category: "terminal framework",
    technologies: ["TypeScript", "Bun"],
    features: [
      { text: "TUI component stories", icon: "layout" },
      { text: "Command autoloading", icon: "folder" },
      { text: "Standalone binaries", icon: "archive" },
      { text: "Typed schemas and handlers", icon: "code" },
      { text: "Hot reload and diagnostics", icon: "refresh" },
    ],
    command: "npm install maltty",
    output: ["schema + handler → typed command", "dev · build · compile"],
    motif: "terminal",
  },
  {
    slug: "marxml",
    name: "marxml",
    description:
      "Fast markdown + XML query and mutation. Rust core with JS bindings, built for speed.",
    summary: "Find and update XML-shaped tags without rewriting the markdown around them.",
    logo: "/projects/marxml-logo.svg",
    href: "https://github.com/thebytefarm/marxml",
    screenshot: {
      src: "/projects/marxml-preview.svg",
      alt: "Marxml updates a task status from todo to done while preserving the surrounding markdown",
    },
    status: "open source",
    category: "markup toolkit",
    technologies: ["Rust", "TypeScript", "Markdown"],
    features: [
      { text: "CSS-style tag selectors", icon: "search" },
      { text: "Byte-preserving edits", icon: "edit" },
      { text: "Schema validation", icon: "shield" },
      {
        text: "Native Rust and Node APIs",
        icon: "terminal",
      },
    ],
    command: "pnpm add marxml",
    output: ["select tags → update attributes", "untouched prose stays byte-identical"],
    motif: "query",
  },
  {
    slug: "almanac",
    name: "almanac",
    description:
      "A Git-aware index that keeps repository documentation discoverable to coding agents.",
    summary: "Keep AGENTS.md current with a deterministic map of your repository documentation.",
    logo: "/projects/almanac-logo.svg",
    href: "https://github.com/thebytefarm/almanac",
    screenshot: {
      src: "/projects/almanac-preview.svg",
      alt: "Almanac sync command beside an AGENTS.md index with managed documentation boundaries",
    },
    status: "open source",
    category: "documentation index",
    technologies: ["TypeScript", "Markdown"],
    features: [
      { text: "Git-aware doc discovery", icon: "search" },
      { text: "Deterministic AGENTS.md", icon: "notes" },
      { text: "Protected managed regions", icon: "shield" },
      {
        text: "Pre-commit index refresh",
        icon: "git-branch",
      },
      { text: "Read-only CI checks", icon: "check" },
    ],
    command: "pnpm add -D almanac-md",
    output: ["tracked markdown → agent documentation index", "init · sync · check"],
    motif: "index",
  },
  {
    slug: "hopper",
    name: "hopper",
    description:
      "An IDE built for agents. Plan, run, and review code with your fleet by your side.",
    summary: "A home for planning, running, and reviewing code alongside your agent fleet.",
    logo: "/projects/hopper-logo.svg",
    status: "under development",
    category: "agent IDE",
    technologies: ["TypeScript", "Rust"],
    features: [
      { text: "Plan with agents", icon: "notes" },
      { text: "Run your agent fleet", icon: "terminal" },
      { text: "Review the code together", icon: "code" },
    ],
    output: ["agent fleet: under development"],
    motif: "agents",
  },
  {
    slug: "granary",
    name: "granary",
    description:
      "Versioned context packs for coding agents. Bring docs, source, and examples into your repo.",
    summary: "Give coding agents the docs and source they need, right inside your repo.",
    logo: "/projects/granary-logo.svg",
    status: "under development",
    category: "agent context packs",
    technologies: ["TypeScript", "Markdown"],
    features: [
      { text: "Versioned context packs", icon: "archive" },
      { text: "Docs, source, and examples", icon: "book-open" },
      { text: "Local and Git sources", icon: "git-branch" },
      { text: "Reproducible installs", icon: "check" },
      { text: "Works with any agent", icon: "code" },
    ],
    output: ["context packs: under development"],
    motif: "storage",
  },
];

/**
 * Looks up a project by its catalog slug.
 * @param slug - Exact project slug.
 * @returns The matching project, or undefined for an unknown slug.
 */
export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}
