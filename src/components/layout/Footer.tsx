import { RoyPointLogo } from '../../assets/RoyPointLogo';

export function Footer() {
  return (
    <footer className="app-footer">
      <RoyPointLogo variant="dark" size={14} />
      <span className="app-footer-sep">·</span>
      <span>© 2026 Roy Point Software Technologies Ltd.</span>
      <span className="app-footer-sep">·</span>
      <span>New Spark R81.20.10</span>
      <span className="app-footer-sep">·</span>
      <a href="https://www.roypoint.com/support" target="_blank" rel="noreferrer">
        Support
      </a>
      <span className="app-footer-sep">·</span>
      <a href="https://www.roypoint.com/privacy-policy" target="_blank" rel="noreferrer">
        Privacy
      </a>
    </footer>
  );
}
