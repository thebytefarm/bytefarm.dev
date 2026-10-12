import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { SiteIcon } from "~/components/site-icon";

const ORG_URL = "https://github.com/thebytefarm";
const DISCORD_URL = "https://discord.gg/dk6XfbMm48";

export function Footer() {
  const [year] = useState(() => new Date().getFullYear());
  return (
    <footer className="footer">
      <div className="footer__inner">
        <span className="footer__copyright">© {year} thebytefarm</span>
        <div className="footer__links">
          <div className="footer__icons">
            <a
              className="footer__link footer__link--icon"
              href={ORG_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <SiteIcon name="github" />
            </a>
            <a
              className="footer__link footer__link--icon"
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
            >
              <SiteIcon name="discord" />
            </a>
          </div>
          <span className="footer__sep" aria-hidden="true" />
          <Link to="/mission" className="footer__link footer__link--nav">
            our mission
          </Link>
        </div>
      </div>
    </footer>
  );
}
