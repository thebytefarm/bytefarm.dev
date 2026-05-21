import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "../components/Hero";
import { Footer } from "../components/Footer";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="page">
      <Hero />
      <Footer />
    </div>
  );
}
