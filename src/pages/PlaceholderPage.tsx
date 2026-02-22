import { useLocation } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader';

/** Renders a sensible stub for any route that has no real component yet. */
export function PlaceholderPage() {
  const { pathname } = useLocation();

  // Turn '/access-policy/ssl-policy' → 'Access Policy › SSL Policy'
  const title = pathname
    .split('/')
    .filter(Boolean)
    .map(segment => segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))
    .join(' › ');

  return (
    <div>
      <PageHeader
        title={title}
        subtitle={`Page identifier: ${pathname}`}
      />
      <div className="card">
        <div className="card-body placeholder-body">
          <WrenchIcon />
          <div className="placeholder-title">Not yet implemented</div>
          <div className="placeholder-sub">
            This stub is rendered for pages that haven't been built yet.<br />
            Add a real component and register it in <code>router/index.tsx</code>.
          </div>
        </div>
      </div>
    </div>
  );
}

function WrenchIcon() {
  return (
    <svg
      width="40" height="40" viewBox="0 0 24 24"
      fill="none" stroke="var(--text-muted)" strokeWidth="1.5"
      style={{ marginBottom: 12 }}
    >
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
    </svg>
  );
}
