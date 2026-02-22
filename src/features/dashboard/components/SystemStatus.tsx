import type { SystemStats } from '../../../types/dashboard';
import { Card } from '../../../components/common/Card';

interface Props { stats: SystemStats }

function fmt(seconds: number) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  return `${d}d ${h}h`;
}

export function SystemStatus({ stats }: Props) {
  const metrics = [
    { label: 'CPU Usage',    value: stats.cpuPercent,    unit: '%', color: stats.cpuPercent > 80 ? 'var(--red)' : 'var(--brand)' },
    { label: 'Memory Usage', value: stats.memoryPercent, unit: '%', color: stats.memoryPercent > 85 ? 'var(--red)' : 'var(--blue)' },
    { label: 'Disk Usage',   value: stats.diskPercent,   unit: '%', color: stats.diskPercent > 90 ? 'var(--red)' : 'var(--green)' },
  ];

  return (
    <Card title="System Status">
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '0.78rem', marginBottom: 14 }}>
          <InfoRow label="Model"     value={stats.modelName} />
          <InfoRow label="Serial"    value={stats.serialNumber} />
          <InfoRow label="Firmware"  value={stats.firmwareVersion} />
          <InfoRow label="Uptime"    value={fmt(stats.uptimeSeconds)} />
          <InfoRow label="Mgmt IP"   value={stats.managementIp} />
        </div>
      </div>

      {metrics.map(m => (
        <div key={m.label} className="metric-row">
          <span className="metric-label">{m.label}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '0 0 60%' }}>
            <div className="progress" style={{ flex: 1 }}>
              <div className="progress-bar" style={{ width: `${m.value}%`, background: m.color }} />
            </div>
            <span className="metric-val" style={{ width: 32, textAlign: 'right' }}>{m.value}%</span>
          </div>
        </div>
      ))}
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{label}</div>
      <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{value}</div>
    </div>
  );
}
