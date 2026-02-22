import { useState } from 'react';
import type { InterfaceSummary } from '../../../../types/home';

// ─── Port definitions ──────────────────────────────────────────────────────
interface PortDef {
  id: string;
  label: string;
  cx: number;        // SVG center X
  cy: number;        // SVG center Y
  w: number;         // port body width
  h: number;         // port body height
  kind: 'rj45' | 'usb' | 'console';
  ifaceName?: string;  // matched to InterfaceSummary.name
  interactive: boolean;
}

interface TooltipData {
  port: PortDef;
  iface?: InterfaceSummary;
  clientX: number;
  clientY: number;
}

interface Props {
  interfaces: InterfaceSummary[];
}

// Quantum Spark 1570 — back-panel port layout
// Left→Right: LED panel | CON | USB×2 | [sep] | WAN | [sep] | LAN 1-8 | [branding]
const CY = 91;  // all port centers share the same Y (single row)

const PORTS: PortDef[] = [
  { id: 'con',  label: 'CON',  cx: 110, cy: CY,     w: 28, h: 22, kind: 'console', interactive: false },
  { id: 'usb1', label: 'USB3', cx: 152, cy: CY - 9, w: 17, h: 9,  kind: 'usb',    interactive: false },
  { id: 'usb2', label: '',     cx: 152, cy: CY + 9, w: 17, h: 9,  kind: 'usb',    interactive: false },
  { id: 'wan',  label: 'WAN',  cx: 216, cy: CY,     w: 30, h: 24, kind: 'rj45',   ifaceName: 'eth0', interactive: true },
  { id: 'lan1', label: '1',    cx: 280, cy: CY,     w: 28, h: 22, kind: 'rj45',   ifaceName: 'eth1', interactive: true },
  { id: 'lan2', label: '2',    cx: 323, cy: CY,     w: 28, h: 22, kind: 'rj45',   ifaceName: 'eth2', interactive: true },
  { id: 'lan3', label: '3',    cx: 366, cy: CY,     w: 28, h: 22, kind: 'rj45',   ifaceName: 'eth3', interactive: true },
  { id: 'lan4', label: '4',    cx: 409, cy: CY,     w: 28, h: 22, kind: 'rj45',   interactive: true },
  { id: 'lan5', label: '5',    cx: 452, cy: CY,     w: 28, h: 22, kind: 'rj45',   interactive: true },
  { id: 'lan6', label: '6',    cx: 495, cy: CY,     w: 28, h: 22, kind: 'rj45',   interactive: true },
  { id: 'lan7', label: '7',    cx: 538, cy: CY,     w: 28, h: 22, kind: 'rj45',   interactive: true },
  { id: 'lan8', label: '8',    cx: 581, cy: CY,     w: 28, h: 22, kind: 'rj45',   interactive: true },
];

function portStatus(port: PortDef, ifaces: InterfaceSummary[]): 'up' | 'down' | 'empty' | 'passive' {
  if (!port.interactive) return 'passive';
  if (!port.ifaceName) return 'empty';
  const iface = ifaces.find(i => i.name === port.ifaceName);
  if (!iface) return 'empty';
  return iface.status;
}

// ─── Color maps ────────────────────────────────────────────────────────────
const BORDER: Record<string, string> = {
  up:      '#22c55e',
  down:    '#ef4444',
  empty:   '#2d2d2d',
  passive: '#2a2a2a',
};
const LED: Record<string, string> = {
  up:      '#22c55e',
  down:    '#ef4444',
  empty:   '#1e2937',
  passive: 'transparent',
};
const PINS: Record<string, string> = {
  up:      '#22c55e',
  down:    '#3b1515',
  empty:   '#1a1a1a',
  passive: '#1a1a1a',
};

// ─── Sub-renderers ─────────────────────────────────────────────────────────
function Rj45Port({ port, status }: { port: PortDef; status: string }) {
  const px = port.cx - port.w / 2;
  const py = port.cy - port.h / 2;
  const pinCount = 8;
  const pinAreaW = port.w - 6;
  const pinStep = pinAreaW / (pinCount - 1);
  return (
    <>
      {/* Housing */}
      <rect x={px} y={py} width={port.w} height={port.h} rx={2} fill="#111" stroke={BORDER[status]} strokeWidth={1.5} />
      {/* Inner socket cavity */}
      <rect x={px + 3} y={py + 3} width={port.w - 6} height={port.h - 7} rx={1} fill="#080808" />
      {/* 8 contact pins */}
      {Array.from({ length: pinCount }, (_, i) => (
        <rect
          key={i}
          x={px + 3 + i * pinStep - 0.75}
          y={py + 5}
          width={1.5}
          height={port.h - 11}
          fill={PINS[status]}
        />
      ))}
      {/* Locking tab relief at bottom */}
      <rect x={px + port.w / 2 - 5} y={py + port.h - 4} width={10} height={3} rx={1} fill="#080808" stroke="#1a1a1a" strokeWidth={0.5} />
    </>
  );
}

function UsbPort({ port }: { port: PortDef }) {
  const px = port.cx - port.w / 2;
  const py = port.cy - port.h / 2;
  return (
    <>
      <rect x={px} y={py} width={port.w} height={port.h} rx={1.5} fill="#101820" stroke="#1a3a5c" strokeWidth={1} />
      <rect x={px + 2} y={py + 2} width={port.w - 4} height={port.h - 4} rx={1} fill="#060e18" />
      {/* USB symbol horizontal bar */}
      <rect x={px + 4} y={py + port.h / 2 - 0.5} width={port.w - 8} height={1} fill="#1a4a7c" />
    </>
  );
}

export function GatewayModel1570({ interfaces }: Props) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const onEnter = (e: React.MouseEvent, port: PortDef) => {
    const iface = port.ifaceName ? interfaces.find(i => i.name === port.ifaceName) : undefined;
    setTooltip({ port, iface, clientX: e.clientX, clientY: e.clientY });
  };
  const onMove = (e: React.MouseEvent) => {
    setTooltip(t => t ? { ...t, clientX: e.clientX, clientY: e.clientY } : null);
  };
  const onLeave = () => setTooltip(null);

  return (
    <div className="gw-model-wrap">
      <svg
        viewBox="0 0 880 212"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ display: 'block' }}
      >
        {/* ── Chassis shadow ── */}
        <rect x="4" y="5" width="875" height="183" rx="11" fill="rgba(0,0,0,0.38)" />

        {/* ── Main chassis body ── */}
        <rect x="0" y="0" width="880" height="182" rx="10" fill="#191919" />

        {/* Top bevel highlight */}
        <rect x="4" y="2" width="872" height="3" rx="1.5" fill="#3c3c3c" opacity="0.55" />
        {/* Bottom shadow edge */}
        <rect x="4" y="177" width="872" height="3" rx="1.5" fill="#111" opacity="0.8" />

        {/* ── Main face panel ── */}
        <rect x="5" y="10" width="870" height="162" rx="4" fill="#242424" />

        {/* ── Left LED section ── */}
        <rect x="5" y="10" width="84" height="162" rx="4" fill="#1d1d1d" />
        {/* Right edge of LED section */}
        <line x1="89" y1="14" x2="89" y2="168" stroke="#2e2e2e" strokeWidth="1" />

        {/* LED indicators */}
        {[
          { label: 'PWR',   y: 48,  color: '#22c55e', glow: true  },
          { label: 'SYS',   y: 68,  color: '#22c55e', glow: true  },
          { label: 'CLOUD', y: 88,  color: '#f59e0b', glow: false },
          { label: 'WIFI',  y: 108, color: '#22c55e', glow: true  },
          { label: 'WIFI2', y: 128, color: '#22c55e', glow: true  },
        ].map(led => (
          <g key={led.label}>
            <circle
              cx={30}
              cy={led.y}
              r={4.5}
              fill={led.color}
              className={led.glow ? 'port-led-up' : ''}
            />
            <text x={40} y={led.y + 3.5} fill="#5a6878" fontSize="7.5" fontFamily="'SFMono-Regular',Consolas,monospace">
              {led.label}
            </text>
          </g>
        ))}

        {/* ── Right branding section ── */}
        {/* Ventilation grille (vertical slits) */}
        {Array.from({ length: 7 }, (_, i) => (
          <rect key={i} x={628 + i * 11} y={22} width={6} height={138} rx={3} fill="#181818" />
        ))}

        {/* Quantum Spark flame icon */}
        <g transform="translate(710, 54) scale(0.95)">
          <circle cx="16" cy="16" r="16" fill="#f97316" />
          <path
            d="M16 6 C16 6 22 12 20 17 C20 17 18 14 14 15 C14 15 18 18 16 26 C16 26 9 20 11 14 C11 14 13 17 15 16 C15 16 12 11 16 6Z"
            fill="#fff"
          />
        </g>

        {/* Check Point circle+checkmark */}
        <g transform="translate(752, 54) scale(0.85)">
          <circle cx="16" cy="16" r="16" fill="#c8102e" />
          <polyline
            points="8,16 13,21 24,11"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>

        {/* Branding text */}
        <text x="800" y="75"  textAnchor="middle" fill="#ffffff"  fontSize="8"  fontWeight="700" fontFamily="sans-serif" letterSpacing="0.06em">CHECK POINT</text>
        <text x="800" y="90"  textAnchor="middle" fill="#7a8a9a"  fontSize="7.5" fontFamily="sans-serif">Quantum Spark</text>
        <text x="800" y="108" textAnchor="middle" fill="#94a3b8"  fontSize="14" fontWeight="700" fontFamily="'SFMono-Regular',Consolas,monospace">1570</text>

        {/* Reset button */}
        <circle cx="843" cy="145" r="7" fill="#181818" stroke="#333" strokeWidth="1" />
        <circle cx="843" cy="145" r="4" fill="#141414" stroke="#2a2a2a" strokeWidth="0.5" />
        <text x="843" y="158" textAnchor="middle" fill="#4a5568" fontSize="6.5" fontFamily="monospace">RESET</text>

        {/* ── Static port labels ── */}
        {/* CON label */}
        <text x="110" y="124" textAnchor="middle" fill="#4a5568" fontSize="7.5" fontFamily="monospace">CON</text>
        {/* USB3 label (shared for both stacked USB ports) */}
        <text x="152" y="124" textAnchor="middle" fill="#4a5568" fontSize="7.5" fontFamily="monospace">USB3</text>
        {/* WAN label */}
        <text x="216" y="130" textAnchor="middle" fill="#6b8fa0" fontSize="8" fontFamily="monospace">WAN</text>
        {/* LAN group label */}
        <text x="430" y="140" textAnchor="middle" fill="#4a5568" fontSize="8" fontFamily="monospace">LAN  ( 1 – 8 )</text>

        {/* ── Separator dashed lines ── */}
        <line x1="182" y1="18" x2="182" y2="164" stroke="#2e2e2e" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="254" y1="18" x2="254" y2="164" stroke="#2e2e2e" strokeWidth="1" strokeDasharray="3 3" />

        {/* ── Non-interactive ports ── */}
        {/* Console */}
        <Rj45Port port={PORTS[0]} status="passive" />
        {/* USB × 2 */}
        <UsbPort port={PORTS[1]} />
        <UsbPort port={PORTS[2]} />

        {/* ── Interactive ports ── */}
        {PORTS.slice(3).map(port => {
          const status = portStatus(port, interfaces);
          const ledVisible = status !== 'passive';
          const ledCy = port.cy - port.h / 2 - 9;

          return (
            <g
              key={port.id}
              style={{ cursor: 'crosshair' }}
              onMouseEnter={e => onEnter(e, port)}
              onMouseLeave={onLeave}
            >
              {/* Status LED above port */}
              {ledVisible && (
                <>
                  {/* LED halo ring */}
                  {status === 'up' && (
                    <circle cx={port.cx} cy={ledCy} r={8} fill="none" stroke="#22c55e" strokeWidth={0.8} opacity={0.3} className="port-led-up" />
                  )}
                  {/* LED dot */}
                  <circle
                    cx={port.cx}
                    cy={ledCy}
                    r={4.5}
                    fill={LED[status]}
                    className={status === 'up' ? 'port-led-up' : ''}
                  />
                </>
              )}

              {/* Port body */}
              <Rj45Port port={port} status={status} />

              {/* Port label below (LAN ports only; WAN has separate label) */}
              {port.id !== 'wan' && (
                <text
                  x={port.cx}
                  y={port.cy + port.h / 2 + 13}
                  textAnchor="middle"
                  fill={status === 'up' ? '#22c55e' : status === 'down' ? '#ef4444' : '#374151'}
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {port.label}
                </text>
              )}
            </g>
          );
        })}

        {/* ── Bottom legend ── */}
        <g transform="translate(0, 192)">
          <text x="8" y="12" fill="#4a5568" fontSize="8" fontFamily="sans-serif">Status</text>
          {/* Up */}
          <circle cx="52" cy="8"  r="4" fill="#22c55e" className="port-led-up" />
          <text x="60" y="12" fill="#6b7280" fontSize="8" fontFamily="sans-serif">Up</text>
          {/* Down */}
          <circle cx="86" cy="8"  r="4" fill="#ef4444" />
          <text x="94" y="12" fill="#6b7280" fontSize="8" fontFamily="sans-serif">Down</text>
          {/* No link */}
          <circle cx="122" cy="8" r="4" fill="#1e2937" stroke="#333" strokeWidth="1" />
          <text x="130" y="12" fill="#6b7280" fontSize="8" fontFamily="sans-serif">No link</text>
          {/* Empty / N/A */}
          <circle cx="165" cy="8" r="4" fill="#1e2937" stroke="#374151" strokeWidth="1" strokeDasharray="2 1" />
          <text x="173" y="12" fill="#6b7280" fontSize="8" fontFamily="sans-serif">N/A</text>
        </g>
      </svg>

      {/* ── Floating tooltip ── */}
      {tooltip && (
        <div
          className="gw-port-tooltip"
          style={{
            position: 'fixed',
            left: tooltip.clientX + 14,
            top:  tooltip.clientY - 48,
            zIndex: 9999,
          }}
        >
          <div className="gw-port-tooltip-title">
            {tooltip.port.id === 'wan'
              ? '🌐 WAN'
              : `LAN ${tooltip.port.label}`}
          </div>
          <table style={{ borderSpacing: 0 }}>
            <tbody>
              <tr>
                <td className="gw-tt-key">Status</td>
                <td
                  style={{
                    color: tooltip.iface?.status === 'up'
                      ? '#22c55e'
                      : tooltip.iface?.status === 'down'
                      ? '#ef4444'
                      : '#64748b',
                  }}
                >
                  {tooltip.iface
                    ? tooltip.iface.status === 'up' ? 'Connected' : 'Disconnected'
                    : 'No link / N/A'}
                </td>
              </tr>
              {tooltip.iface && (
                <>
                  <tr>
                    <td className="gw-tt-key">Operation</td>
                    <td style={{ textTransform: 'capitalize' }}>{tooltip.iface.type}</td>
                  </tr>
                  <tr>
                    <td className="gw-tt-key">IPv4 address</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>
                      {tooltip.iface.ipAddress}
                    </td>
                  </tr>
                  <tr>
                    <td className="gw-tt-key">Throughput</td>
                    <td>
                      {tooltip.iface.speedMbps > 0
                        ? `${tooltip.iface.speedMbps} Mbps`
                        : 'N/A'}
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
