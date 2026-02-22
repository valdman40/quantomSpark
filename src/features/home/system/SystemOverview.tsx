import { useSystemOverview } from './hooks/useSystemOverview';
import { useNotifications } from '../notifications/hooks/useNotifications';
import { useAssets } from '../assets/hooks/useAssets';
import { AlertBanner } from './components/AlertBanner';
import { GatewayInfoCard } from './components/GatewayInfoCard';
import { InternetSection } from './components/InternetSection';
import { GatewayModel1570 } from './components/GatewayModel1570';
import { AssetsMiniCard } from './components/AssetsMiniCard';
import { MonitoringMiniCard } from './components/MonitoringMiniCard';
import { NotificationsMiniCard } from './components/NotificationsMiniCard';
import { mockAlertItems } from '../../../mocks/data/home';

export function SystemOverview() {
  const { data: overviewData, isLoading, error } = useSystemOverview();
  const { data: notifications = [] } = useNotifications();
  const { data: assets = [] } = useAssets();

  if (isLoading) {
    return <div className="loading-box"><span className="spinner" /><span>Loading system overview…</span></div>;
  }
  if (error || !overviewData) {
    return <div className="empty">Failed to load system overview.</div>;
  }

  const { systemStats, interfaces, blades } = overviewData;

  return (
    <div>
      {/* Alert banner */}
      <AlertBanner items={mockAlertItems} />

      {/* 2-panel grid */}
      <div className="system-overview-grid">
        {/* ── Main panel ── */}
        <div className="system-main">
          <GatewayInfoCard
            stats={systemStats}
            blades={blades}
            deviceId="Gateway-ID-569EFED1"
          />
          <InternetSection interfaces={interfaces} />
          {/* 2D hardware model */}
          <div className="system-panel-section">
            <div className="system-panel-hdr">
              <span className="system-panel-title">Hardware Model — Quantum Spark 1570</span>
            </div>
            <div style={{ padding: '12px 16px 4px' }}>
              <GatewayModel1570 interfaces={interfaces} />
            </div>
          </div>
        </div>

        {/* ── Right sidebar panel ── */}
        <div className="system-panel">
          <AssetsMiniCard assets={assets} />
          <MonitoringMiniCard />
          <NotificationsMiniCard notifications={notifications} />
        </div>
      </div>
    </div>
  );
}
