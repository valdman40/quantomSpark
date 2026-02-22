import { useState, useEffect } from 'react';
import { Wifi, Clock, ShieldCheck } from 'lucide-react';
import { mockSystemOverview } from '../../mocks/data/home';

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${d}d:${String(h).padStart(2, '0')}h:${String(m).padStart(2, '0')}m:${String(s).padStart(2, '0')}s`;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export function StatusBar() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const uptime = mockSystemOverview.systemStats.uptimeSeconds;

  return (
    <div className="status-bar" role="status" aria-label="System status">
      {/* Internet connectivity */}
      <div className="status-bar-item">
        <span className="dot dot-green" />
        <Wifi size={12} />
        <span>Connected to the Internet</span>
      </div>

      <div className="status-bar-sep" />

      {/* Uptime */}
      <div className="status-bar-item status-bar-uptime">
        <Clock size={12} />
        <span>Uptime: {formatUptime(uptime)}</span>
      </div>

      <div className="status-bar-sep status-bar-uptime" />

      {/* License */}
      <div className="status-bar-item status-bar-license">
        <ShieldCheck size={12} />
        <span>Trial license</span>
      </div>

      <div className="status-bar-sep status-bar-license" />

      {/* Clock */}
      <div className="status-bar-item" style={{ marginLeft: 'auto' }}>
        <Clock size={12} />
        <span>{formatTime(now)}</span>
      </div>
    </div>
  );
}
