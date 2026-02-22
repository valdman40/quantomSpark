import type { InterfaceSummary } from '../../../../types/home';
import { Card } from '../../../../components/common/Card';
import { Badge } from '../../../../components/common/Badge';

interface Props { interfaces: InterfaceSummary[] }

const typeLabel: Record<string, string> = {
  external: 'WAN', internal: 'LAN', dmz: 'DMZ', vpn: 'VPN',
};

export function InterfaceOverview({ interfaces }: Props) {
  return (
    <Card title="Network Interfaces">
      <div className="iface-grid">
        {interfaces.map(iface => (
          <div key={iface.name} className="iface-card">
            <div className="iface-name">
              <span className={`dot dot-${iface.status === 'up' ? 'green' : 'red'}`} />
              {iface.name}
            </div>
            <div className="iface-ip">{iface.ipAddress || '—'}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <Badge variant={iface.status === 'up' ? 'success' : 'error'}>
                {iface.status.toUpperCase()}
              </Badge>
              <span className="iface-type">{typeLabel[iface.type] ?? iface.type}</span>
            </div>
            {iface.speedMbps > 0 && (
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {iface.speedMbps >= 1000 ? `${iface.speedMbps / 1000} Gbps` : `${iface.speedMbps} Mbps`}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
