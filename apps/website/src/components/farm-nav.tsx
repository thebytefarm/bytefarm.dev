import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { SiteIcon } from "~/components/site-icon";

/**
 * Renders the shared navigation for ByteFarm pages.
 * @returns Home, project, about, and community links.
 */
export function FarmNav() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const isHome = pathname === "/";
  const [hasScrolled, setHasScrolled] = useState(false);
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const isMenuOpen = menuPath === pathname;
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    const dismissOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !navRef.current?.contains(event.target)) {
        setMenuPath(null);
      }
    };
    const dismissOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuPath(null);
      toggleRef.current?.focus();
    };
    const desktop = window.matchMedia("(min-width: 721px)");
    const dismissOnDesktop = () => {
      if (desktop.matches) setMenuPath(null);
    };
    document.addEventListener("pointerdown", dismissOutside);
    document.addEventListener("keydown", dismissOnEscape);
    desktop.addEventListener("change", dismissOnDesktop);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside);
      document.removeEventListener("keydown", dismissOnEscape);
      desktop.removeEventListener("change", dismissOnDesktop);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isHome) return;

    const updateScroll = () => setHasScrolled(window.scrollY >= 96);
    const frame = window.requestAnimationFrame(updateScroll);
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateScroll);
    };
  }, [isHome]);

  return (
    <nav
      ref={navRef}
      className={`farm-nav${isHome ? " farm-nav--home" : ""}${isHome && !hasScrolled ? " farm-nav--overlay" : ""}${isMenuOpen ? " farm-nav--open" : ""}`}
      aria-label="Main navigation"
    >
      <Link
        to="/"
        className="farm-nav__brand"
        aria-label="ByteFarm home"
        onClick={() => setMenuPath(null)}
      >
        <img src="/brand/logo.svg" alt="ByteFarm" width={160} height={41} />
      </Link>
      <button
        ref={toggleRef}
        type="button"
        className="farm-nav__toggle"
        aria-expanded={isMenuOpen}
        aria-controls="farm-nav-links"
        aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
        onClick={() => setMenuPath(isMenuOpen ? null : pathname)}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          shapeRendering="crispEdges"
        >
          <path
            d={
              isMenuOpen
                ? "M4 4h4v4H4zm4 4h4v4H8zm4 4h4v4h-4zm4 4h4v4h-4zM16 4h4v4h-4zm-4 4h4v4h-4zm-4 4h4v4H8zm-4 4h4v4H4z"
                : "M3 4h18v3H3zm0 7h18v3H3zm0 7h18v3H3z"
            }
          />
        </svg>
      </button>
      <div
        className="farm-nav__links"
        id="farm-nav-links"
        onClick={(event) => {
          if (event.target instanceof Element && event.target.closest("a")) setMenuPath(null);
        }}
      >
        <Link to="/about">about</Link>
        <Link
          to="/"
          hash="projects"
          hashScrollIntoView={{ behavior: "auto", block: "start" }}
          onClick={(event) => {
            if (!isHome || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            const projects = document.getElementById("projects");
            if (!projects) return;
            event.preventDefault();
            const navHeight =
              document.querySelector(".farm-nav")?.getBoundingClientRect().height ?? 92;
            window.scrollTo({
              top: projects.getBoundingClientRect().top + window.scrollY - navHeight - 24,
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "instant"
                : "smooth",
            });
          }}
        >
          projects
        </Link>
        <div className="farm-nav__community">
          <a
            href="https://github.com/thebytefarm"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            title="GitHub"
          >
            <SiteIcon name="github" />
            <span className="farm-nav__community-label">GitHub</span>
          </a>
          <a
            href="https://discord.gg/dk6XfbMm48"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join Discord"
            title="Join Discord"
          >
            <SiteIcon name="discord" />
            <span className="farm-nav__community-label">Discord</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
