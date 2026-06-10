import { PxlKitIcon } from "@pxlkit/core";
import { PixelDivider } from "@pxlkit/ui-kit";
import { GithubIcon } from "../lib/github-icon";

const ORG_URL = "https://github.com/thebytefarm";
const PXLKIT_URL = "https://pxlkit.xyz";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <PixelDivider spacing="sm" />
      <div className="footer__inner">
        <span className="footer__copyright">© {year} thebytefarm</span>
        <div className="footer__links">
          <a
            className="footer__link footer__link--icon"
            href={ORG_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <PxlKitIcon
              icon={GithubIcon}
              size={20}
              color="currentColor"
              aria-label=""
            />
          </a>
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
