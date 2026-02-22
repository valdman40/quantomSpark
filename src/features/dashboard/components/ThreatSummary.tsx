import type { ThreatStats } from '../../../types/dashboard';
import { Card } from '../../../components/common/Card';

interface Props { stats: ThreatStats }

const blades = [
  { key: 'ipsEvents',         label: 'IPS Events',           color: '#c8102e' },
  { key: 'avEvents',          label: 'Anti-Virus',           color: '#7c3aed' },
  { key: 'urlFilteringEvents',label: 'URL Filtering',        color: '#ea580c' },
  { key: 'antiSpamEvents',    label: 'Anti-Spam',            color: '#0891b2' },
] as const;

export function ThreatSummary({ stats }: Props) {
  const total = stats.blockedThreats;

  return (
    <Card title="Threat Prevention">
      <div style={{ textAlign: 'center', margin: '0 0 16px' }}>
        <div style={{ fontSize: '2.4rem', fontWeight: 700, color: 'var(--red)', lineHeight: 1 }}>
          {total.toLocaleString()}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>
          Threats blocked (24h)
        </div>
      </div>

      {blades.map(b => (
        <div key={b.key} className="metric-row">
          <span className="metric-label">{b.label}</span>
          <span className="metric-val" style={{ color: b.color }}>
            {(stats[b.key] as number).toLocaleString()}
          </span>
        </div>
      ))}

      <div style={{ marginTop: 12, fontSize: '0.7rem', color: 'var(--text-muted)' }}>
        Last update: {new Date(stats.lastUpdated).toLocaleTimeString()}
      </div>
    </Card>
  );
}
