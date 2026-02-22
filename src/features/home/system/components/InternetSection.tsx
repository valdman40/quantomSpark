import type { InterfaceSummary } from '../../../../types/home';

interface Props {
  interfaces: InterfaceSummary[];
}

export function InternetSection({ interfaces }: Props) {
  const wanIfaces = interfaces.filter(i => i.type === 'external');

  return (
    <div className="system-panel-section">
      <div className="system-panel-hdr">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Globe icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.8">
            <circle cx="12" cy="12" r="9"/>
            <path d="M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 010 18M12 3a15 15 0 000 18"/>
          </svg>
          <span className="system-panel-title">Internet</span>
        </div>
        <a href="/device/internet" style={{ fontSize: '0.75rem', color: 'var(--brand)' }}>
          Internet connections ({wanIfaces.length})
        </a>
      </div>

      {wanIfaces.length === 0 ? (
        <div style={{ padding: '16px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          No internet connections configured.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <tbody>
              {wanIfaces.map(iface => (
                <tr key={iface.name}>
                  <td>
                    <span className="badge badge-info" style={{ fontFamily: 'monospace' }}>
                      {iface.name}
                    </span>
                    <span style={{ marginLeft: 6, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      (primary)
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>Static IP</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>WAN</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{iface.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Simple topology illustration */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0 12px' }}>
        <svg width="180" height="60" viewBox="0 0 180 60" fill="none">
          {/* Router/device box */}
          <rect x="10" y="20" width="50" height="30" rx="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5"/>
          <text x="35" y="39" textAnchor="middle" fontSize="9" fill="#475569">Gateway</text>
          {/* Connection line */}
          <line x1="60" y1="35" x2="120" y2="35" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3"/>
          {/* Cloud shape */}
          <ellipse cx="143" cy="35" rx="25" ry="15" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5"/>
          <ellipse cx="133" cy="30" rx="12" ry="10" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5"/>
          <ellipse cx="153" cy="28" rx="10" ry="9" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5"/>
          <text x="143" y="39" textAnchor="middle" fontSize="8" fill="#1d4ed8">Internet</text>
        </svg>
      </div>
    </div>
  );
}
