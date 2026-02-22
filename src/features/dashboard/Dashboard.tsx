import { useAppDispatch } from '../../app/hooks';
import { useDashboard } from './hooks/useDashboard';
import { SystemStatus } from './components/SystemStatus';
import { ThreatSummary } from './components/ThreatSummary';
import { InterfaceOverview } from './components/InterfaceOverview';
import { RecentAlerts } from './components/RecentAlerts';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

const ShieldIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const AlertIcon  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const ConnectIcon= () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v4M5 17l7-6M19 17l-7-6"/></svg>;
const VpnIcon    = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M3.6 9h16.8M3.6 15h16.8"/></svg>;

export function Dashboard() {
  const dispatch = useAppDispatch();
  const { data, isLoading, error } = useDashboard();

  if (isLoading) {
    return <div className="loading-box"><span className="spinner" /><span>Loading dashboard…</span></div>;
  }
  if (error || !data) {
    return <div className="empty">Failed to load dashboard data.</div>;
  }

  const { systemStats, threatStats, interfaces, recentAlerts } = data;

  const stats = [
    { label: 'Blocked Threats', value: threatStats.blockedThreats.toLocaleString(), icon: <ShieldIcon />, color: '#fee2e2', iconColor: '#c8102e' },
    { label: 'Active VPNs',     value: '2',                                          icon: <VpnIcon />,    color: '#dbeafe', iconColor: '#1d4ed8' },
    { label: 'Online Interfaces',value: `${interfaces.filter(i => i.status === 'up').length} / ${interfaces.length}`, icon: <ConnectIcon />, color: '#dcfce7', iconColor: '#15803d' },
    { label: 'Security Events',  value: recentAlerts.length.toString(),              icon: <AlertIcon />,  color: '#fef3c7', iconColor: '#b45309' },
  ];

  return (
    <div>
      <PageHeader
        title="Overview"
        subtitle="System status and security summary"
        actions={
          <Button variant="ghost" size="sm" onClick={() => dispatch({ type: 'dashboard/refresh' })}>
            ↻ Refresh
          </Button>
        }
      />

      {/* Stat cards */}
      <div className="stat-grid">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.color, color: s.iconColor }}>
              {s.icon}
            </div>
            <div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Status row */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <Badge variant="success" dot>Threat Prevention: Active</Badge>
        <Badge variant="success" dot>IPS: Prevent Mode</Badge>
        <Badge variant="success" dot>Anti-Virus: Active</Badge>
        <Badge variant="info"    dot>Policy: Installed</Badge>
        <Badge variant="warning" dot>Update Available: R81.20.10</Badge>
      </div>

      {/* Main 2-column section */}
      <div className="card-grid-2">
        <SystemStatus stats={systemStats} />
        <ThreatSummary stats={threatStats} />
      </div>

      {/* Interface overview */}
      <div style={{ marginBottom: 20 }}>
        <InterfaceOverview interfaces={interfaces} />
      </div>

      {/* Recent alerts */}
      <RecentAlerts alerts={recentAlerts} />
    </div>
  );
}
