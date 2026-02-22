import type { SystemStats, BladeState } from '../../../../types/home';

interface Props {
  stats: SystemStats;
  blades: BladeState[];
  deviceId: string;
}

export function GatewayInfoCard({ stats, blades, deviceId }: Props) {
  const enabledCount = blades.filter(b => b.status === 'on').length;
  return (
    <div className="system-panel-section">
      <div className="system-panel-hdr">
        <span className="system-panel-title">{deviceId}</span>
        <button className="btn btn-secondary btn-sm">WatchTower mobile app</button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Firmware</th>
              <th>MAC address</th>
              <th>Management</th>
              <th>License</th>
              <th>Blades</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 600 }}>{stats.modelName}</td>
              <td className="mono">{stats.firmwareVersion}</td>
              <td className="mono">00:1C:7F:56:9E:FE</td>
              <td>Locally managed</td>
              <td><span className="badge badge-warning">Trial license</span></td>
              <td>{enabledCount} active</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
