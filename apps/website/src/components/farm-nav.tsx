import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { SiteIcon } from "~/components/site-icon";

/**
 * Renders the shared navigation for ByteFarm pages.
 * @returns Home, project, mission, and community links.
 */
export function FarmNav() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const isHome = pathname === "/";
  const [hasScrolled, setHasScrolled] = useState(false);

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
      className={`farm-nav${isHome ? " farm-nav--home" : ""}${isHome && !hasScrolled ? " farm-nav--overlay" : ""}`}
      aria-label="Main navigation"
    >
      <Link to="/" className="farm-nav__brand" aria-label="ByteFarm home">
        <img src="/brand/logo.svg" alt="ByteFarm" width={160} height={41} />
      </Link>
      <div className="farm-nav__links">
        <Link to="/" hash="projects">
          projects
        </Link>
        <Link to="/mission">our mission</Link>
        <div className="farm-nav__community">
          <a
            href="https://github.com/thebytefarm"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            title="GitHub"
          >
            <SiteIcon name="github" />
          </a>
          <a
            href="https://discord.gg/dk6XfbMm48"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join Discord"
            title="Join Discord"
          >
            <SiteIcon name="discord" />
          </a>
        </div>
      </div>
    </nav>
  );
}
