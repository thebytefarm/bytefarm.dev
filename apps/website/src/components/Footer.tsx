const ORG_URL = "https://github.com/thebytefarm";
const PXLKIT_URL = "https://pxlkit.xyz";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer__inner">
        <span className="footer__copyright">© {year} thebytefarm</span>
        <div className="footer__links">
          <a
            className="footer__link"
            href={ORG_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <span className="footer__dot" aria-hidden="true">
            ·
          </span>
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
