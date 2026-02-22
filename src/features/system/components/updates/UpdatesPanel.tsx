import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { useSoftwareVersion } from '../../hooks/useSystem';
import { PageHeader } from '../../../../components/common/PageHeader';
import { Button } from '../../../../components/common/Button';
import { Card } from '../../../../components/common/Card';
import { Badge } from '../../../../components/common/Badge';

export function UpdatesPanel() {
  const dispatch = useAppDispatch();
  const { updateStatus } = useAppSelector(s => s.system);
  const { data: version, isLoading } = useSoftwareVersion();

  if (isLoading) return <div className="loading-box"><span className="spinner" /></div>;
  if (!version)  return <div className="empty">Unable to load version info</div>;

  const isWorking = updateStatus.checking || updateStatus.downloading || updateStatus.installing;

  return (
    <div>
      <PageHeader title="Software Updates" subtitle="Manage firmware and security database updates" />

      <div className="card-grid-2">
        <Card title="Installed Version">
          <div className="metric-row"><span className="metric-label">Version</span><span className="metric-val">{version.current}</span></div>
          <div className="metric-row"><span className="metric-label">Build</span><span className="metric-val">{version.build}</span></div>
          <div className="metric-row"><span className="metric-label">Release Date</span><span className="metric-val">{version.releaseDate}</span></div>
          <div style={{ marginTop: 14 }}>
            <Button variant="secondary" loading={updateStatus.checking}
              onClick={() => dispatch({ type: 'system/checkUpdate' })}>
              Check for Updates
            </Button>
          </div>
        </Card>

        {version.updateAvailable && version.latestVersion ? (
          <Card title="Update Available">
            <div style={{ marginBottom: 14 }}>
              <Badge variant="warning" dot>Update Ready</Badge>
            </div>
            <div className="metric-row"><span className="metric-label">Latest Version</span><span className="metric-val" style={{ color: 'var(--brand)' }}>{version.latestVersion}</span></div>
            <div className="metric-row"><span className="metric-label">Build</span><span className="metric-val">{version.latestBuild}</span></div>
            {version.releaseNotes && (
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.5 }}>
                {version.releaseNotes}
              </p>
            )}
            {isWorking && (
              <div style={{ marginBottom: 10 }}>
                <div className="progress"><div className="progress-bar" style={{ width: '60%' }} /></div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  {updateStatus.downloading ? 'Downloading…' : updateStatus.installing ? 'Installing…' : ''}
                </div>
              </div>
            )}
            <Button variant="primary" loading={isWorking}
              onClick={() => dispatch({ type: 'system/installUpdate' })}>
              Install Update
            </Button>
          </Card>
        ) : (
          <Card title="Update Status">
            <Badge variant="success" dot>System is up to date</Badge>
          </Card>
        )}
      </div>
    </div>
  );
}
