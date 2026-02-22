import { Link } from 'react-router-dom';
import { Cloud } from 'lucide-react';

export function ExtendedMonitoring() {
  return (
    <div className="card" style={{ maxWidth: 520, padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <Cloud size={20} color="var(--text-secondary)" />
        <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Extended Monitoring (Cloud)</h2>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 16 }}>
        Cloud-based extended monitoring is not configured. Connect to Check Point cloud services to
        enable real-time threat intelligence and advanced reporting.
      </p>
      <Link to="/home/cloud-services">
        <button className="btn btn-primary">Configure</button>
      </Link>
    </div>
  );
}
