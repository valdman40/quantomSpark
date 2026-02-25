import { Globe, CheckCircle, XCircle } from 'lucide-react';
import { useAppDispatch } from '../../../app/hooks';
import { addNotification } from '../../../app/uiSlice';

const SERVICES = [
  { id: 'threatcloud', name: 'ThreatCloud',    desc: 'Real-time threat intelligence database',              connected: true  },
  { id: 'usercheck',   name: 'UserCheck',       desc: 'User notifications and interaction',                  connected: true  },
  { id: 'smartevent',  name: 'SmartEvent',      desc: 'Security event management and correlation',           connected: false },
  { id: 'infinity',    name: 'Infinity Portal', desc: 'Unified security management portal',                  connected: false },
  { id: 'iot',         name: 'IoT Protect',     desc: 'IoT device discovery and protection',                 connected: false },
];

export function CloudServices() {
  const dispatch = useAppDispatch();

  const handleConfigure = (name: string) =>
    dispatch(addNotification({ type: 'info', message: `Opening configuration for ${name}…` }));

  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Cloud Services</h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Connect to Roy Point cloud services to enhance security
          </p>
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => dispatch(addNotification({ type: 'info', message: 'Connecting all cloud services…' }))}
        >
          Connect All
        </button>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        {SERVICES.map((svc, i) => (
          <div
            key={svc.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              borderBottom: i < SERVICES.length - 1 ? '1px solid var(--border)' : 'none',
            }}
          >
            <Globe size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, fontSize: '0.85rem' }}>{svc.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{svc.desc}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {svc.connected ? (
                <span className="badge badge-success">
                  <CheckCircle size={11} /> Connected
                </span>
              ) : (
                <span className="badge badge-neutral">
                  <XCircle size={11} /> Not connected
                </span>
              )}
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => handleConfigure(svc.name)}
              >
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
