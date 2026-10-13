import { createServerFn } from "@tanstack/react-start";

import { getProject, PROJECTS } from "~/components/projects";

export type ProjectGithub = {
  stars: number;
  language: string | null;
  release: {
    tag: string;
    name: string;
    url: string;
    publishedAt: string | null;
    body: string;
  } | null;
  url: string;
};

const CACHE_DURATION_MS = 15 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 5000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function parseRelease(value: unknown): ProjectGithub["release"] {
  if (
    !isRecord(value) ||
    typeof value.tag_name !== "string" ||
    !isNullableString(value.name) ||
    typeof value.html_url !== "string" ||
    !isNullableString(value.published_at) ||
    !isNullableString(value.body_text)
  ) {
    return null;
  }

  return {
    tag: value.tag_name,
    name: value.name ?? value.tag_name,
    url: value.html_url,
    publishedAt: value.published_at,
    body: value.body_text ?? "",
  };
}

async function fetchProjectGithub(
  repository: string,
  request: typeof fetch,
): Promise<ProjectGithub | null> {
  try {
    const options: RequestInit = {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2026-03-10",
        "User-Agent": "bytefarm.dev",
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    };
    const endpoint = `https://api.github.com/repos/${repository}`;
    const [repoResponse, releaseResponse] = await Promise.all([
      request(endpoint, options),
      request(`${endpoint}/releases?per_page=100`, {
        ...options,
        headers: { ...options.headers, Accept: "application/vnd.github.text+json" },
      }),
    ]);

    if (!repoResponse.ok || (!releaseResponse.ok && releaseResponse.status !== 404)) {
      return null;
    }

    const repo: unknown = await repoResponse.json();
    if (
      !isRecord(repo) ||
      typeof repo.stargazers_count !== "number" ||
      !Number.isSafeInteger(repo.stargazers_count) ||
      repo.stargazers_count < 0 ||
      !isNullableString(repo.language) ||
      typeof repo.html_url !== "string"
    ) {
      return null;
    }

    const releaseList: unknown = releaseResponse.status === 404 ? [] : await releaseResponse.json();
    if (!Array.isArray(releaseList)) {
      return null;
    }
    const releases = releaseList
      .filter((value) => !isRecord(value) || value.draft !== true)
      .map(parseRelease);
    if (releases.some((value) => value === null)) {
      return null;
    }
    const release = releases.reduce<ProjectGithub["release"]>(
      (latest, candidate) =>
        candidate?.publishedAt && candidate.publishedAt > (latest?.publishedAt ?? "")
          ? candidate
          : latest,
      null,
    );

    return {
      stars: repo.stargazers_count,
      language: repo.language,
      release,
      url: repo.html_url,
    };
  } catch {
    // Metadata is optional: network failures, timeouts, and invalid JSON are unavailable data.
    return null;
  }
}

/**
 * Creates an isolated reader with successful-response caching and in-flight deduplication.
 * @param options - Optional request and clock implementations for deterministic testing.
 * @returns A reader restricted to public GitHub repositories in the project catalog.
 */
export function createProjectGithubReader(
  options: { request?: typeof fetch; now?: () => number } = {},
): (slug: string) => Promise<ProjectGithub | null> {
  const request = options.request ?? fetch;
  const now = options.now ?? Date.now;
  let cache: Readonly<Record<string, { data: ProjectGithub; expiresAt: number }>> = {};
  let pending: Readonly<Record<string, Promise<ProjectGithub | null>>> = {};

  return (slug) => {
    const project = getProject(slug);
    const repository =
      project?.status === "open source"
        ? project.href?.match(/^https:\/\/github\.com\/([^/]+\/[^/]+)$/)?.[1]
        : undefined;
    if (!repository) {
      return Promise.resolve(null);
    }

    const cached = cache[repository];
    if (cached && cached.expiresAt > now()) {
      return Promise.resolve(cached.data);
    }
    const inFlight = pending[repository];
    if (inFlight) {
      return inFlight;
    }

    const result = fetchProjectGithub(repository, request)
      .then((data) => {
        if (data !== null) {
          cache = { ...cache, [repository]: { data, expiresAt: now() + CACHE_DURATION_MS } };
        }
        return data;
      })
      .finally(() => {
        pending = Object.fromEntries(Object.entries(pending).filter(([key]) => key !== repository));
      });
    pending = { ...pending, [repository]: result };
    return result;
  };
}

const readProjectGithub = createProjectGithubReader();

/** Returns cached live GitHub metadata for a public catalog slug, or null when unavailable. */
export const getProjectGithub = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(({ data }): Promise<ProjectGithub | null> => readProjectGithub(data));

/** Returns GitHub metadata keyed by the four public project slugs. */
export const getGithubProjects = createServerFn({ method: "GET" }).handler(
  async (): Promise<Record<string, ProjectGithub | null>> => {
    const entries = await Promise.all(
      PROJECTS.filter((project) => project.status === "open source" && project.href).map(
        async (project) => [project.slug, await readProjectGithub(project.slug)] as const,
      ),
    );
    return Object.fromEntries(entries);
  },
);
