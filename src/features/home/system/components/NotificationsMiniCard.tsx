import type { SystemNotification } from '../../../../types/home';

interface Props {
  notifications: SystemNotification[];
}

const SEV_DOT: Record<string, string> = {
  error:   'dot-red',
  warning: 'dot-yellow',
  info:    'dot-blue',
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  return 'just now';
}

export function NotificationsMiniCard({ notifications }: Props) {
  const unread  = notifications.filter(n => !n.read).length;
  const preview = notifications.slice(0, 3);

  return (
    <div className="system-panel-section">
      <div className="system-panel-hdr">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="system-panel-title">Notifications</span>
          {unread > 0 && <span className="badge badge-error">{unread}</span>}
        </div>
        <a href="/home/notifications" style={{ fontSize: '0.72rem', color: 'var(--brand)' }}>
          All notifications
        </a>
      </div>

      <div>
        {preview.map(n => (
          <div
            key={n.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
              padding: '8px 14px',
              borderBottom: '1px solid #f1f5f9',
              fontSize: '0.75rem',
            }}
          >
            <span className={`dot ${SEV_DOT[n.severity] ?? 'dot-blue'}`} style={{ marginTop: 4, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: 'var(--text)', lineHeight: 1.4 }}>{n.message}</div>
              <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>
                {relativeTime(n.timestamp)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
