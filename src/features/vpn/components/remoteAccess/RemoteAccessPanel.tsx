import { useRemoteAccess, useRemoteUsers } from '../../hooks/useVpn';
import { Card } from '../../../../components/common/Card';
import { Badge } from '../../../../components/common/Badge';
import { DataTable, type Column } from '../../../../components/common/DataTable';
import { PageHeader } from '../../../../components/common/PageHeader';
import type { RemoteAccessUser } from '../../../../types/vpn';

function fmtBytes(n: number) {
  if (n < 1048576) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1048576).toFixed(1)} MB`;
}

function elapsed(since: string) {
  const s = Math.floor((Date.now() - new Date(since).getTime()) / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h}h ${m}m`;
}

export function RemoteAccessPanel() {
  const { data: settings, isLoading: loadSettings } = useRemoteAccess();
  const { data: users = [], isLoading: loadUsers } = useRemoteUsers();

  const columns: Column<RemoteAccessUser>[] = [
    { key: 'username',      header: 'Username',     render: r => <span style={{ fontWeight: 600 }}>{r.username}</span> },
    { key: 'clientIp',      header: 'Client IP',    render: r => <span className="mono">{r.clientIp}</span>    },
    { key: 'assignedIp',    header: 'Assigned IP',  render: r => <span className="mono">{r.assignedIp}</span>  },
    { key: 'connectedSince',header: 'Duration',     render: r => elapsed(r.connectedSince) },
    { key: 'bytesSent',     header: 'Bytes ↑',      render: r => fmtBytes(r.bytesSent)      },
    { key: 'bytesReceived', header: 'Bytes ↓',      render: r => fmtBytes(r.bytesReceived)  },
    {
      key: 'actions', header: '',
      render: () => <button className="btn btn-ghost btn-sm">Disconnect</button>,
    },
  ];

  return (
    <div>
      <PageHeader title="Remote Access VPN" subtitle="Client-to-site VPN sessions and settings" />

      <div className="card-grid-2" style={{ marginBottom: 20 }}>
        <Card title="Remote Access Settings">
          {loadSettings ? (
            <div className="loading-box"><span className="spinner" /></div>
          ) : settings ? (
            <div>
              <div className="metric-row">
                <span className="metric-label">Blade Status</span>
                <Badge variant={settings.bladeEnabled ? 'success' : 'error'} dot>
                  {settings.bladeEnabled ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="metric-row">
                <span className="metric-label">Office Mode</span>
                <Badge variant={settings.officeModeEnabled ? 'info' : 'neutral'}>
                  {settings.officeModeEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <div className="metric-row">
                <span className="metric-label">Office Mode Network</span>
                <span className="metric-val mono">{settings.officeModeNetwork}</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Authentication</span>
                <span className="metric-val">{settings.authMethod}</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Max Connections</span>
                <span className="metric-val">{settings.maxConcurrentConnections}</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Session Timeout</span>
                <span className="metric-val">{settings.sessionTimeout} min</span>
              </div>
            </div>
          ) : null}
        </Card>

        <Card title="Connection Summary">
          <div className="stat-card" style={{ border: 'none', boxShadow: 'none', padding: 0 }}>
            <div>
              <div className="stat-value" style={{ color: 'var(--green)' }}>{users.length}</div>
              <div className="stat-label">Active Sessions</div>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Connected Users">
        <DataTable columns={columns} data={users} rowKey="id" loading={loadUsers}
          emptyMessage="No users currently connected" />
      </Card>
    </div>
  );
}
