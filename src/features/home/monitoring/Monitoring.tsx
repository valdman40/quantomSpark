import { RefreshCw, Download, Network, Shield, Wrench, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../../app/hooks';
import { addNotification } from '../../../app/uiSlice';

export function Monitoring() {
  const dispatch = useAppDispatch();

  return (
    <div>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <button
          className="btn btn-ghost"
          style={{ color: 'var(--brand)', fontWeight: 600 }}
          onClick={() => dispatch(addNotification({ type: 'info', message: 'Refreshing monitoring data…' }))}
        >
          <RefreshCw size={14} /> Refresh
        </button>
        <button className="btn btn-ghost btn-sm">
          <Download size={14} />
        </button>
      </div>

      {/* Connections strip */}
      <div className="mon-connections">
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/></svg>
          <strong>0</strong> VPN Tunnels
        </span>
        <span style={{ color: 'var(--text-muted)' }}>|</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <strong>0</strong> Active Devices
        </span>
        <span style={{ color: 'var(--text-muted)' }}>|</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          <strong>56</strong> Connections
        </span>
      </div>

      {/* ── Network card ── */}
      <div className="mon-section">
        <div className="mon-section-hdr">
          <Network size={14} />
          Network
          <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--blue)', cursor: 'pointer' }}>
            Last hour ▾
          </span>
        </div>

        {/* Bandwidth row */}
        <div className="mon-inner-grid">
          <div className="mon-inner-cell">
            <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: 6 }}>Bandwidth Usage</div>
            <div style={{ display: 'flex', gap: 6, fontSize: '0.75rem', marginBottom: 14, flexWrap: 'wrap' }}>
              {['Applications', 'Categories', 'Sites', 'Users'].map((tab, i, arr) => (
                <span key={tab} style={{ display: 'flex', gap: 6 }}>
                  <span style={{ color: 'var(--blue)', cursor: 'pointer' }}>{tab}</span>
                  {i < arr.length - 1 && <span style={{ color: 'var(--text-muted)' }}>|</span>}
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div className="mon-donut">Application control<br />is inactive</div>
            </div>
          </div>
          <div className="mon-inner-cell">
            <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: 10 }}>Top Bandwidth Consuming</div>
            {[
              ['N/A | Top application',  'Application control is inactive'],
              ['N/A | Top category',     'Application control is inactive'],
              ['N/A | Top site',         'Application control is inactive'],
              ['N/A | Top user',         'Application control is inactive'],
            ].map(([label, sub]) => (
              <div key={label} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: '0.78rem' }}>{label}</div>
                <div className="mon-inactive">{sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic row */}
        <div className="mon-inner-grid" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="mon-inner-cell">
            <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              Traffic
              {['Total', 'Received', 'Sent'].map((t, i, arr) => (
                <span key={t} style={{ display: 'flex', gap: 8, fontWeight: 400 }}>
                  <span style={{ color: 'var(--blue)', fontSize: '0.75rem', cursor: 'pointer' }}>{t}</span>
                  {i < arr.length - 1 && <span style={{ color: 'var(--text-muted)' }}>|</span>}
                </span>
              ))}
            </div>
            <div className="mon-inactive">Application Control is inactive</div>
          </div>
          <div className="mon-inner-cell">
            <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: 6 }}>Total Traffic</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>N/A received</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>N/A sent</div>
          </div>
        </div>
      </div>

      {/* ── Security card ── */}
      <div className="mon-section">
        <div className="mon-section-hdr">
          <Shield size={14} />
          Security
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
          <div className="mon-inner-cell">
            <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: 8 }}>Infected Devices</div>
            <div className="mon-inactive">Anti-Bot &amp; DNS Security is inactive</div>
            <div style={{ marginTop: 14 }}>
              <Link to="/threat-prevention/infected-devices" style={{ fontSize: '0.78rem', color: 'var(--blue)' }}>
                All Infected Devices
              </Link>
            </div>
          </div>
          <div className="mon-inner-cell">
            <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: 8 }}>High Risk Applications</div>
            <div className="mon-inactive">Application control is inactive</div>
            <div style={{ marginTop: 14 }}>
              <Link to="/access-policy/policy" style={{ fontSize: '0.78rem', color: 'var(--blue)' }}>
                Applications Blade Control
              </Link>
            </div>
          </div>
          <div className="mon-inner-cell">
            <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>Security Events</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
              Detected since reboot
            </div>
            {[
              'Anti-Bot & DNS Security is inactive',
              'Anti-Virus is inactive',
              'IPS is inactive',
              'Threat Emulation blade is inactive',
            ].map(msg => (
              <div key={msg} className="mon-inactive" style={{ marginBottom: 5 }}>• {msg}</div>
            ))}
            <div style={{ marginTop: 10 }}>
              <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>SandBlast</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Troubleshooting card ── */}
      <div className="mon-section">
        <div className="mon-section-hdr">
          <Wrench size={14} />
          Troubleshooting
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
          <div className="mon-inner-cell">
            <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: 8 }}>System Resources</div>
            <Lightbulb size={28} color="var(--yellow)" style={{ marginBottom: 8 }} />
            <div>
              <Link to="/device/system-operations" style={{ fontSize: '0.78rem', color: 'var(--blue)' }}>
                CPU, memory and disk usage
              </Link>
            </div>
          </div>
          <div className="mon-inner-cell">
            <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: 8 }}>Device Info</div>
            <table style={{ fontSize: '0.78rem', borderSpacing: 0 }}>
              <tbody>
                {[
                  ['Name',    'Gateway-ID-569EFED1'],
                  ['Version', 'R82.00.15 (998001836)'],
                  ['MAC',     '00:50:56:9E:FE:D1'],
                  ['Uptime',  '6 days and 21:54:34 hours'],
                ].map(([key, val]) => (
                  <tr key={key}>
                    <td style={{ color: 'var(--text-secondary)', paddingRight: 10, paddingBottom: 3, whiteSpace: 'nowrap' }}>{key}:</td>
                    <td style={{ paddingBottom: 3 }}>{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mon-inner-cell">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {[
                { label: 'System Tools',   to: '/home/tools'       },
                { label: 'Security Logs',  to: '/logs/security'    },
                { label: 'System Logs',    to: '/logs/system'      },
                { label: 'Reports',        to: '/home/reports'     },
                { label: 'Support',        to: '/home/support'     },
              ].map(link => (
                <Link key={link.to} to={link.to} style={{ color: 'var(--blue)', fontSize: '0.82rem' }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
