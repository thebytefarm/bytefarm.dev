import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/mission")({
  beforeLoad: () => {
    throw redirect({ to: "/about", statusCode: 301 });
  },
});
