import { addCollection, Icon } from "@iconify/react";
import { icons as pixelIcons } from "@iconify-json/pixel";
import { Link } from "@tanstack/react-router";

addCollection(pixelIcons);

const ORG_URL = "https://github.com/thebytefarm";
const DISCORD_URL = "https://discord.gg/dk6XfbMm48";
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
              <Icon icon="pixel:github" width={20} height={20} />
            </a>
            <a
              className="footer__link footer__link--icon"
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
            >
              <Icon icon="pixel:discord" width={20} height={20} />
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
