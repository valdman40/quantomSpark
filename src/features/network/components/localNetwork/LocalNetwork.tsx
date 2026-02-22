import { useState } from 'react';
import { Plus, ChevronDown, Search } from 'lucide-react';
import { useAppDispatch } from '../../../../app/hooks';
import { addNotification } from '../../../../app/uiSlice';

// ── Donut chart data ─────────────────────────────────────────────────────────

interface DonutSegment { label: string; value: number; color: string; }

const CHARTS: { title: string; segments: DonutSegment[] }[] = [
  {
    title: 'Interfaces by Type',
    segments: [
      { label: 'LAN',     value: 10, color: '#3b82f6' },
      { label: 'Internet', value: 2, color: '#22c55e' },
      { label: 'DMZ',      value: 1, color: '#f59e0b' },
      { label: 'VLAN',     value: 1, color: '#a78bfa' },
      { label: 'Bridge',   value: 1, color: '#94a3b8' },
    ],
  },
  {
    title: 'IP Assignment',
    segments: [
      { label: 'Static',      value: 2, color: '#3b82f6' },
      { label: 'DHCP Server', value: 7, color: '#22c55e' },
      { label: 'DHCP Relay',  value: 1, color: '#f59e0b' },
      { label: 'Dynamic',     value: 2, color: '#94a3b8' },
    ],
  },
  {
    title: 'Link Status',
    segments: [
      { label: 'Up',   value: 12, color: '#22c55e' },
      { label: 'Down', value: 3,  color: '#ef4444' },
    ],
  },
];

// ── Interface table data ─────────────────────────────────────────────────────

interface Iface {
  name: string; ip: string; mask: string;
  type: string; dhcp: string; status: 'Up' | 'Down';
}

const INTERFACES: Iface[] = [
  { name: 'br0',     ip: '192.168.1.1', mask: '255.255.255.0',   type: 'Bridge', dhcp: 'DHCP Server', status: 'Up'   },
  { name: 'LAN9',    ip: '—',           mask: '—',                type: 'LAN',    dhcp: '—',           status: 'Down' },
  { name: 'DMZ',     ip: '172.16.0.1',  mask: '255.255.255.0',   type: 'DMZ',    dhcp: 'Static',      status: 'Up'   },
  { name: 'LAN1 HA', ip: '10.0.0.1',   mask: '255.255.255.252', type: 'LAN',    dhcp: 'Static',      status: 'Up'   },
  { name: 'LAN1.1847', ip: '—',         mask: '—',                type: 'VLAN',   dhcp: '—',           status: 'Down' },
  { name: 'LAN2 HA', ip: '10.0.0.2',   mask: '255.255.255.252', type: 'LAN',    dhcp: 'Static',      status: 'Up'   },
];

// ── Minimal SVG donut (no animation needed) ──────────────────────────────────

function DonutChart({ segments }: { segments: DonutSegment[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const r = 24; const cx = 30; const cy = 30; const strokeW = 10;
  let offset = 0;
  const circ = 2 * Math.PI * r;

  return (
    <svg width={60} height={60} viewBox="0 0 60 60" style={{ flexShrink: 0 }}>
      {segments.map(seg => {
        const frac = seg.value / total;
        const dash = frac * circ;
        const el = (
          <circle
            key={seg.label}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeW}
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={-offset * circ / total * r * 2 * Math.PI / circ * r}
            style={{ transform: `rotate(${-90 + offset * 360 / total}deg)`, transformOrigin: '30px 30px' }}
          />
        );
        offset += seg.value;
        return el;
      })}
    </svg>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export function LocalNetwork() {
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState('');

  const fire = (msg: string) =>
    dispatch(addNotification({ type: 'info', message: msg }));

  const filtered = INTERFACES.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 4 }}>Local Network</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Manage local network interfaces and settings
        </p>
      </div>

      {/* Donut charts row */}
      <div className="localnet-charts">
        {CHARTS.map(chart => (
          <div key={chart.title} className="localnet-chart-card">
            <div className="localnet-chart-title">{chart.title}</div>
            <div className="localnet-donut-wrap">
              <DonutChart segments={chart.segments} />
              <div className="localnet-legend">
                {chart.segments.map(seg => (
                  <div key={seg.label}>
                    <span
                      className="localnet-legend-dot"
                      style={{ background: seg.color }}
                    />
                    {seg.label}: {seg.value}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="localnet-toolbar">
        <button className="btn btn-secondary btn-sm" onClick={() => fire('New interface…')}>
          <Plus size={13} style={{ marginRight: 3 }} />
          New
          <ChevronDown size={12} style={{ marginLeft: 2 }} />
        </button>
        <button className="btn btn-secondary btn-sm" onClick={() => fire('Edit selected interface…')}>Edit</button>
        <button className="btn btn-secondary btn-sm" onClick={() => fire('Delete selected interface…')}>Delete</button>
        <button className="btn btn-secondary btn-sm" onClick={() => fire('Disable selected interface…')}>Disable</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <input
            className="form-control"
            style={{ width: 160, height: 28, fontSize: '0.78rem' }}
            placeholder="Search interfaces…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Search size={14} color="var(--text-muted)" />
        </div>
        <span className="localnet-count">{INTERFACES.length} interfaces</span>
      </div>

      {/* Interface table */}
      <table className="data-table" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>IP</th>
            <th>Subnet Mask</th>
            <th>Interface Type</th>
            <th>DHCP Mode</th>
            <th>Link Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(iface => (
            <tr key={iface.name}>
              <td style={{ fontWeight: 500 }}>{iface.name}</td>
              <td>{iface.ip}</td>
              <td>{iface.mask}</td>
              <td>{iface.type}</td>
              <td>{iface.dhcp}</td>
              <td>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: 4, flexShrink: 0,
                    background: iface.status === 'Up' ? '#22c55e' : '#ef4444',
                  }} />
                  {iface.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
