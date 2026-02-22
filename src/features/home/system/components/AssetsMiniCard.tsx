import type { ConnectedAsset } from '../../../../types/home';

interface Props {
  assets: ConnectedAsset[];
}

export function AssetsMiniCard({ assets }: Props) {
  const total   = assets.length;
  const infected = 0; // mock: no infected assets

  return (
    <div className="system-panel-section">
      <div className="system-panel-hdr">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="system-panel-title">Assets</span>
          <span className="badge badge-neutral">{total}</span>
        </div>
        <div style={{ display: 'flex', gap: 12, fontSize: '0.72rem' }}>
          <a href="/home/assets" style={{ color: 'var(--brand)' }}>Manage assets</a>
          <a href="/home/assets?type=IoT" style={{ color: 'var(--brand)' }}>IoT</a>
        </div>
      </div>

      <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem' }}>
        {infected === 0 ? (
          <>
            <span className="dot dot-green" />
            <span style={{ color: 'var(--text-secondary)' }}>No infected assets found</span>
          </>
        ) : (
          <>
            <span className="dot dot-red" />
            <span style={{ color: 'var(--red)' }}>{infected} infected asset{infected !== 1 ? 's' : ''} found</span>
          </>
        )}
      </div>
    </div>
  );
}
