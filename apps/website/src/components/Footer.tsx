import { PxlKitIcon } from "@pxlkit/core";
import { Link } from "@tanstack/react-router";
import { DiscordIcon } from "../lib/discord-icon";
import { GithubIcon } from "../lib/github-icon";

const ORG_URL = "https://github.com/thebytefarm";
const DISCORD_URL = "#";
const PXLKIT_URL = "https://pxlkit.xyz";

export function Footer() {
  const year = new Date().getFullYear();
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
              <PxlKitIcon icon={GithubIcon} size={20} color="currentColor" aria-label="" />
            </a>
            <a
              className="footer__link footer__link--icon"
              href={DISCORD_URL}
              aria-label="Discord (coming soon)"
            >
              <PxlKitIcon icon={DiscordIcon} size={20} color="currentColor" aria-label="" />
            </a>
          </div>
          <span className="footer__sep" aria-hidden="true" />
          <Link to="/mission" className="footer__link footer__link--nav">
            our mission
          </Link>
          <span className="footer__sep" aria-hidden="true" />
          <a
            className="footer__link footer__link--muted"
            href={PXLKIT_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Built with pxlkit
          </a>
        </div>
      </div>
    </footer>
  );
}
