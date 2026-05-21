import { createFileRoute } from "@tanstack/react-router";
import { Scene } from "@bytefarm/ui/toons/Scene";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return <Scene />;
}
