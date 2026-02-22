import { CheckPointLogo } from '../../assets/CheckPointLogo';

export function Footer() {
  return (
    <footer className="app-footer">
      <CheckPointLogo variant="dark" size={14} />
      <span className="app-footer-sep">·</span>
      <span>© 2026 Check Point Software Technologies Ltd.</span>
      <span className="app-footer-sep">·</span>
      <span>Quantum Spark R81.20.10</span>
      <span className="app-footer-sep">·</span>
      <a href="https://www.checkpoint.com/support" target="_blank" rel="noreferrer">
        Support
      </a>
      <span className="app-footer-sep">·</span>
      <a href="https://www.checkpoint.com/privacy-policy" target="_blank" rel="noreferrer">
        Privacy
      </a>
    </footer>
  );
}
