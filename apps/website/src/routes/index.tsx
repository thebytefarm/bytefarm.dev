import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "~/components/Hero";
import { getGithubProjects } from "~/components/project-github";

export const Route = createFileRoute("/")({
  loader: () => getGithubProjects(),
  component: Home,
});

function Home() {
  const github = Route.useLoaderData();
  return <Hero github={github} />;
}
