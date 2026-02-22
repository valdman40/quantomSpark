import type { BladeHealthEntry, BladeStatus } from '../../../../types/home';
import { Card } from '../../../../components/common/Card';

interface Props { entries: BladeHealthEntry[] }

function statusBadge(s: BladeStatus) {
  const styles: Record<BladeStatus, { bg: string; color: string; label: string }> = {
    on:     { bg: '#dcfce7', color: '#15803d', label: 'ON'     },
    bypass: { bg: '#fef3c7', color: '#b45309', label: 'BYPASS' },
    off:    { bg: '#f1f5f9', color: '#64748b', label: 'OFF'    },
  };
  const st = styles[s];
  return (
    <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: '0.7rem', fontWeight: 700, background: st.bg, color: st.color }}>
      {st.label}
    </span>
  );
}

export function BladeHealth({ entries }: Props) {
  return (
    <Card title="Blade Health" noPadding>
      <table className="data-table">
        <thead>
          <tr>
            <th>Blade</th>
            <th>Status</th>
            <th>Events (24h)</th>
            <th>Version</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(e => (
            <tr key={e.name}>
              <td>{e.name}</td>
              <td>{statusBadge(e.status)}</td>
              <td>{e.eventsLast24h.toLocaleString()}</td>
              <td className="mono" style={{ color: 'var(--text-muted)' }}>{e.version ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
