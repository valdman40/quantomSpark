import type { ConnectionStats as ConnectionStatsType } from '../../../../types/home';
import { Card } from '../../../../components/common/Card';

interface Props { connections: ConnectionStatsType }

export function ConnectionStats({ connections }: Props) {
  const { activeConnections, httpsConnections, httpConnections, otherConnections } = connections;
  const total = httpsConnections + httpConnections + otherConnections || 1;

  const bars = [
    { label: 'HTTPS', count: httpsConnections, color: '#22c55e' },
    { label: 'HTTP',  count: httpConnections,  color: '#3b82f6' },
    { label: 'Other', count: otherConnections, color: '#94a3b8' },
  ];

  return (
    <Card title="Connection Statistics">
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--brand)', lineHeight: 1 }}>
          {activeConnections.toLocaleString()}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
          Active connections
        </div>
      </div>

      {bars.map(b => (
        <div key={b.label} className="metric-row">
          <span className="metric-label">{b.label}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '0 0 60%' }}>
            <div className="progress" style={{ flex: 1 }}>
              <div
                className="progress-bar"
                style={{ width: `${Math.round((b.count / total) * 100)}%`, background: b.color }}
              />
            </div>
            <span className="metric-val" style={{ width: 40, textAlign: 'right' }}>
              {b.count.toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </Card>
  );
}
