import {
  Shield, Globe, User, Zap, Radio, AlertTriangle,
  Bug, Bot, FlaskConical, Mail, EyeOff, Wifi, Link2,
  Lock, Settings, BarChart2,
} from 'lucide-react';
import type { BladeControl } from '../../../../types/home';

// ─── Lucide icon map by iconType ────────────────────────────────────────────
function BladeIcon({ type }: { type: string }) {
  const props = { size: 20, strokeWidth: 1.6, color: 'var(--text-secondary)' };
  switch (type) {
    case 'firewall':    return <Shield {...props} />;
    case 'app-filter':  return <Globe {...props} />;
    case 'user-aware':  return <User {...props} />;
    case 'qos':         return <Zap {...props} />;
    case 'sdwan':       return <Radio {...props} />;
    case 'ips':         return <AlertTriangle {...props} />;
    case 'antivirus':   return <Bug {...props} />;
    case 'antibot':     return <Bot {...props} />;
    case 'emulation':   return <FlaskConical {...props} />;
    case 'antispam':    return <Mail {...props} />;
    case 'phishing':    return <EyeOff {...props} />;
    case 'iot':         return <Wifi {...props} />;
    case 'vpn-remote':  return <Lock {...props} />;
    case 'vpn-s2s':     return <Link2 {...props} />;
    default:            return <Shield {...props} />;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
interface Props {
  blade: BladeControl;
  enabled: boolean;
  onToggle: (id: string) => void;
}

export function BladeCard({ blade, enabled, onToggle }: Props) {
  const hasTrialStripe = blade.license === 'trial';
  return (
    <div className={`blade-card${hasTrialStripe ? ' blade-card-stripe' : ''}`}>
      <div className="blade-icon">
        <BladeIcon type={blade.iconType} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="blade-name">{blade.name}</div>
        {blade.license === 'trial' && (
          <span className="badge badge-warning" style={{ marginTop: 2 }}>Trial license</span>
        )}
      </div>
      <div className="blade-actions">
        <button className="blade-icon-btn" title="Settings" onClick={e => e.stopPropagation()}>
          <Settings size={13} />
        </button>
        <button className="blade-icon-btn" title="Statistics" onClick={e => e.stopPropagation()}>
          <BarChart2 size={13} />
        </button>
        <label className="toggle-wrap" title={enabled ? 'Disable' : 'Enable'}>
          <input
            type="checkbox"
            className="toggle-input"
            checked={enabled}
            onChange={() => onToggle(blade.id)}
          />
          <div className="toggle-track" />
        </label>
      </div>
    </div>
  );
}
