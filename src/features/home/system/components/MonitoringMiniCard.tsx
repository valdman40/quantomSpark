import { useState } from 'react';

// Static sparkline mock data (30 points, 0-15 range)
const SPARKLINE_DATA = [
  3, 5, 4, 7, 6, 9, 8, 12, 10, 8, 6, 9, 11, 13, 10, 8, 7, 9, 11, 10,
  8, 6, 7, 9, 8, 10, 11, 9, 7, 6,
];

const MAIN_TABS  = ['Internet', '3D-WAN'] as const;
const SUB_TABS   = ['Throughput', 'Packet Rate', 'CPU Usage', 'Memory Usage'] as const;

type MainTab = typeof MAIN_TABS[number];
type SubTab  = typeof SUB_TABS[number];

// Convert data array to SVG polyline points string
function toPolylinePoints(data: number[], w: number, h: number): string {
  const max = Math.max(...data, 1);
  return data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - (v / max) * (h - 8);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

export function MonitoringMiniCard() {
  const [mainTab, setMainTab] = useState<MainTab>('Internet');
  const [subTab,  setSubTab]  = useState<SubTab>('Throughput');

  const points = toPolylinePoints(SPARKLINE_DATA, 300, 80);
  const areaPoints = `0,80 ${points} 300,80`;

  return (
    <div className="system-panel-section">
      <div className="system-panel-hdr">
        <span className="system-panel-title">Monitoring</span>
        {/* Main tabs */}
        <div style={{ display: 'flex', gap: 2 }}>
          {MAIN_TABS.map(t => (
            <button
              key={t}
              onClick={() => setMainTab(t)}
              className={`mini-tab${mainTab === t ? ' active' : ''}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
        {SUB_TABS.map(t => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            className={`mini-subtab${subTab === t ? ' active' : ''}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Sparkline */}
      <div style={{ padding: '8px 0 4px' }}>
        <svg viewBox="0 0 300 88" style={{ width: '100%', height: 88, display: 'block' }}>
          {/* Area fill */}
          <defs>
            <linearGradient id="mg-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={areaPoints} fill="url(#mg-grad)" />
          <polyline
            points={points}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1.8"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
