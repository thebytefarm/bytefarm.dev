// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

import { createProjectGithubReader } from "./project-github";

const repository = {
  stargazers_count: 42,
  language: "TypeScript",
  html_url: "https://github.com/thebytefarm/ciderpress",
};

const release = {
  tag_name: "v1.2.3",
  name: "Harvest",
  html_url: "https://github.com/thebytefarm/ciderpress/releases/tag/v1.2.3",
  published_at: "2026-10-01T12:00:00Z",
  body_text: "Release notes from GitHub.",
};

function responses(repo: unknown = repository, latest: unknown = [release], releaseStatus = 200) {
  return vi
    .fn<typeof fetch>()
    .mockResolvedValueOnce(Response.json(repo))
    .mockResolvedValueOnce(Response.json(latest, { status: releaseStatus }));
}

describe("project GitHub metadata", () => {
  it("selects the newest published release including RCs instead of preferring stable releases", async () => {
    const rc = {
      ...release,
      tag_name: "ciderpress@2.0.0-rc.1",
      prerelease: true,
      published_at: "2026-10-03T12:00:00Z",
    };
    const request = responses(repository, [release, rc]);
    expect((await createProjectGithubReader({ request })("ciderpress"))?.release?.tag).toBe(
      rc.tag_name,
    );
  });

  it("ignores drafts and unpublished releases", async () => {
    const request = responses(repository, [
      { ...release, tag_name: "v3.0.0", draft: true, published_at: "2026-10-05T12:00:00Z" },
      { ...release, tag_name: "v2.0.0", published_at: null },
      release,
    ]);
    expect((await createProjectGithubReader({ request })("ciderpress"))?.release?.tag).toBe(
      release.tag_name,
    );
  });

  it("preserves repository metadata when no releases have been published", async () => {
    const request = responses(repository, []);
    expect(await createProjectGithubReader({ request })("ciderpress")).toMatchObject({
      stars: repository.stargazers_count,
      release: null,
    });
  });

  it("restricts requests to the exact public catalog allowlist", async () => {
    const request = vi.fn<typeof fetch>();
    const read = createProjectGithubReader({ request });

    const slugs = [
      "hopper",
      "granary",
      "unknown",
      "https://github.com/other/repo",
      "../ciderpress",
      "constructor",
    ];
    expect(await Promise.all(slugs.map((slug) => read(slug)))).toEqual(slugs.map(() => null));
    expect(request).not.toHaveBeenCalled();
  });

  it("maps real repository and release fields with unauthenticated, bounded requests", async () => {
    const request = responses();
    const read = createProjectGithubReader({ request });

    expect(await read("ciderpress")).toEqual({
      stars: 42,
      language: "TypeScript",
      url: repository.html_url,
      release: {
        tag: release.tag_name,
        name: release.name,
        url: release.html_url,
        publishedAt: release.published_at,
        body: release.body_text,
      },
    });
    expect(request.mock.calls.map(([url]) => url)).toEqual([
      "https://api.github.com/repos/thebytefarm/ciderpress",
      "https://api.github.com/repos/thebytefarm/ciderpress/releases?per_page=100",
    ]);
    const options = request.mock.calls[0]?.[1];
    expect(options?.signal).toBeInstanceOf(AbortSignal);
    expect(options?.headers).toEqual({
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2026-03-10",
      "User-Agent": "bytefarm.dev",
    });
    expect(request.mock.calls[1]?.[1]?.headers).toEqual({
      Accept: "application/vnd.github.text+json",
      "X-GitHub-Api-Version": "2026-03-10",
      "User-Agent": "bytefarm.dev",
    });
  });

  it("uses GitHub's plain-text release notes instead of raw Markdown", async () => {
    const request = responses(repository, [
      {
        ...release,
        body: "## Changes\n\n- **Fixed** [navigation](https://example.com).",
        body_text: "Changes\n\nFixed navigation.",
      },
    ]);

    expect((await createProjectGithubReader({ request })("ciderpress"))?.release?.body).toBe(
      "Changes\n\nFixed navigation.",
    );
  });

  it("treats a releases 404 as no release and preserves real zero stars", async () => {
    const request = responses({ ...repository, stargazers_count: 0, language: null }, {}, 404);
    const read = createProjectGithubReader({ request });

    expect(await read("ciderpress")).toEqual({
      stars: 0,
      language: null,
      url: repository.html_url,
      release: null,
    });
  });

  it("normalizes nullable release text without losing the actual tag", async () => {
    const request = responses(repository, [
      {
        ...release,
        name: null,
        body_text: null,
      },
    ]);
    const read = createProjectGithubReader({ request });

    expect((await read("ciderpress"))?.release).toEqual({
      tag: release.tag_name,
      name: release.tag_name,
      url: release.html_url,
      publishedAt: release.published_at,
      body: "",
    });
  });

  it.each([403, 429, 500])("does not report release HTTP %s as no release", async (status) => {
    const read = createProjectGithubReader({ request: responses(repository, {}, status) });
    expect(await read("ciderpress")).toBeNull();
  });

  it("does not confuse a missing repository with a missing release", async () => {
    const request = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(Response.json({}, { status: 404 }))
      .mockResolvedValueOnce(Response.json({}, { status: 404 }));
    expect(await createProjectGithubReader({ request })("ciderpress")).toBeNull();
  });

  it.each([
    { ...repository, stargazers_count: -1 },
    { ...repository, stargazers_count: "42" },
    { ...repository, language: 42 },
    { message: "API limit exceeded" },
  ])("rejects malformed repository data instead of making up metadata", async (repo) => {
    expect(await createProjectGithubReader({ request: responses(repo) })("ciderpress")).toBeNull();
  });

  it("rejects malformed release data and JSON", async () => {
    const malformedRelease = createProjectGithubReader({ request: responses(repository, {}) });
    expect(await malformedRelease("ciderpress")).toBeNull();

    const request = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(new Response("not JSON"))
      .mockResolvedValueOnce(Response.json([release]));
    expect(await createProjectGithubReader({ request })("ciderpress")).toBeNull();
  });

  it("deduplicates concurrent reads and refreshes successful data after fifteen minutes", async () => {
    let time = 1000;
    const request = responses();
    const read = createProjectGithubReader({ request, now: () => time });

    const first = read("ciderpress");
    const concurrent = read("ciderpress");
    expect(concurrent).toBe(first);
    const data = await first;
    expect(await concurrent).toEqual(data);
    time += 15 * 60 * 1000 - 1;
    expect(await read("ciderpress")).toEqual(data);
    expect(request).toHaveBeenCalledTimes(2);

    request
      .mockResolvedValueOnce(Response.json({ ...repository, stargazers_count: 43 }))
      .mockResolvedValueOnce(Response.json([release]));
    time += 1;
    expect((await read("ciderpress"))?.stars).toBe(43);
    expect(request).toHaveBeenCalledTimes(4);
  });

  it("retries after network failure instead of caching unavailable data", async () => {
    const request = vi
      .fn<typeof fetch>()
      .mockRejectedValueOnce(new TypeError("network unavailable"))
      .mockResolvedValueOnce(Response.json([release]))
      .mockResolvedValueOnce(Response.json(repository))
      .mockResolvedValueOnce(Response.json([release]));
    const read = createProjectGithubReader({ request });

    expect(await read("ciderpress")).toBeNull();
    expect((await read("ciderpress"))?.stars).toBe(42);
    expect(request).toHaveBeenCalledTimes(4);
  });

  it("returns unavailable when the bounded request times out", async () => {
    vi.useFakeTimers();
    const timeout = vi.spyOn(AbortSignal, "timeout").mockImplementation((duration) => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), duration);
      return controller.signal;
    });
    const request = vi.fn<typeof fetch>().mockImplementation(
      (_url, options) =>
        new Promise((_resolve, reject) => {
          options?.signal?.addEventListener("abort", () => reject(new Error("aborted")));
        }),
    );

    try {
      const result = createProjectGithubReader({ request })("ciderpress");
      await vi.advanceTimersByTimeAsync(5000);
      expect(await result).toBeNull();
      expect(timeout).toHaveBeenCalledWith(5000);
    } finally {
      timeout.mockRestore();
      vi.useRealTimers();
    }
  });
});
