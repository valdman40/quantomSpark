import { useHaSettings } from '../../hooks/useSystem';
import { PageHeader } from '../../../../components/common/PageHeader';
import { Card } from '../../../../components/common/Card';
import { Badge } from '../../../../components/common/Badge';
import { StatusDot } from '../../../../components/common/StatusDot';

function stateColor(state: string): 'green' | 'red' | 'yellow' | 'blue' {
  if (state === 'active')       return 'green';
  if (state === 'standby')      return 'blue';
  if (state === 'down')         return 'red';
  return 'yellow';
}

export function HaStatus() {
  const { data: ha, isLoading } = useHaSettings();

  if (isLoading) return <div className="loading-box"><span className="spinner" /></div>;
  if (!ha)       return <div className="empty">HA not configured</div>;

  return (
    <div>
      <PageHeader title="High Availability" subtitle="Cluster status and synchronization" />

      <div style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Cluster Overview</span>
            <Badge variant={ha.enabled ? 'success' : 'neutral'} dot>
              {ha.enabled ? `HA Active — ${ha.mode}` : 'Standalone'}
            </Badge>
          </div>
          <div className="card-body">
            <div className="form-row">
              <div>
                <span className="metric-label">Mode</span>
                <div className="metric-val" style={{ marginTop: 4 }}>{ha.mode}</div>
              </div>
              <div>
                <span className="metric-label">Sync Interface</span>
                <div className="metric-val mono" style={{ marginTop: 4 }}>{ha.syncInterface}</div>
              </div>
              <div>
                <span className="metric-label">Tracking</span>
                <div className="metric-val" style={{ marginTop: 4 }}>{ha.trackingMethod}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-grid-2">
        {ha.members.map(member => (
          <Card key={member.id} title={member.name}>
            <div className="metric-row">
              <span className="metric-label">Role</span>
              <Badge variant={member.role === 'primary' ? 'info' : 'neutral'}>{member.role}</Badge>
            </div>
            <div className="metric-row">
              <span className="metric-label">State</span>
              <StatusDot color={stateColor(member.state)} label={member.state} />
            </div>
            <div className="metric-row">
              <span className="metric-label">IP Address</span>
              <span className="metric-val mono">{member.ip}</span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Sync Status</span>
              <Badge variant={member.syncStatus === 'synchronized' ? 'success' : 'warning'}>
                {member.syncStatus}
              </Badge>
            </div>
            {member.lastSync && (
              <div className="metric-row">
                <span className="metric-label">Last Sync</span>
                <span className="metric-val text-sm">{new Date(member.lastSync).toLocaleTimeString()}</span>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
