import type { ConnectedAsset } from '../../../../types/home';

interface Props { asset: ConnectedAsset; colSpan: number }

export function AssetRowDetail({ asset, colSpan }: Props) {
  return (
    <tr>
      <td colSpan={colSpan} style={{ padding: 0, borderTop: 'none' }}>
        <div className="asset-detail-row">
          <div className="asset-detail-grid">
            <DetailItem label="Vendor"     value={asset.vendor    ?? '—'} />
            <DetailItem label="OS"         value={asset.os        ?? '—'} />
            <DetailItem label="First Seen" value={new Date(asset.firstSeen).toLocaleString()} />
            <DetailItem label="MAC"        value={asset.macAddress} mono />
            {asset.openPorts && asset.openPorts.length > 0 && (
              <DetailItem label="Open Ports" value={asset.openPorts.join(', ')} mono />
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

function DetailItem({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: '0.78rem', fontWeight: 600, fontFamily: mono ? 'monospace' : undefined }}>
        {value}
      </div>
    </div>
  );
}
