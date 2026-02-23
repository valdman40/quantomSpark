import { useState } from 'react';
import { AlertTriangle, Search } from 'lucide-react';
import { useAppDispatch } from '../../../../app/hooks';
import { addNotification } from '../../../../app/uiSlice';

type SettingType = 'bool' | 'int' | 'options';

interface AdvSetting {
  attribute: string;
  type: SettingType;
  value: string;
  description: string;
}

const SETTINGS: AdvSetting[] = [
  { attribute: 'APPI policy - Bypass Check Point products', type: 'bool', value: 'true', description: 'Bypass Check Point products for Application Control default rules' },
  { attribute: 'Acceleration settings - Enable acceleration and exceptions', type: 'bool', value: 'true', description: 'Change the acceleration state (enable/disable) and add/remove exceptions' },
  { attribute: 'Admin Lockout - Mobile application session timeout', type: 'int', value: '30', description: 'Allowed mobile application session before automatic logout is executed (in days)' },
  { attribute: 'Admin Lockout - Mobile seamless login session timeout', type: 'int', value: '1', description: 'Allowed mobile application seamless login session before automatic logout is executed (in days)' },
  { attribute: 'Administrators RADIUS authentication - Default Shell', type: 'options', value: 'Clish', description: 'Default shell for Super Administrators. To enable this feature, contact Check Point Support.' },
  { attribute: 'Administrators RADIUS authentication - Local authentication (RADIUS inaccessible)', type: 'bool', value: 'false', description: 'Perform local administrator authentication only if RADIUS server is not configured or is inaccessible.' },
  { attribute: 'Administrators RADIUS authentication - Restrict Super User access by RADIUS', type: 'bool', value: 'false', description: 'Restrict local Super User access based on RADIUS availability.' },
  { attribute: 'Aggressive aging - Aggressive aging enforcement method', type: 'options', value: 'Both', description: 'Defines the strategy used to enforce aggressive aging, such as enabling it when the appliance is under load, or logging events' },
  { attribute: 'Aggressive aging - Connection table percentage limit', type: 'int', value: '80', description: 'Specifies the maximum percentage of the connection table that can be filled before aggressive aging begins' },
  { attribute: 'Aggressive aging - Enable aggressive aging of connections', type: 'bool', value: 'true', description: 'Toggles the feature that aggressively removes stale connections when resources are low' },
  { attribute: 'Aggressive aging - Enable reduced timeout for ICMP connections', type: 'bool', value: 'true', description: 'Shortens the timeout for idle ICMP connections to free up resources more quickly' },
  { attribute: 'Aggressive aging - Enable reduced timeout for TCP handshake', type: 'bool', value: 'true', description: 'Lowers the timeout for incomplete TCP handshakes to prevent table congestion' },
  { attribute: 'Aggressive aging - Enable reduced timeout for TCP session', type: 'bool', value: 'true', description: 'Reduces the timeout for idle TCP sessions to clear up space in the connection table' },
  { attribute: 'Aggressive aging - Enable reduced timeout for TCP termination', type: 'bool', value: 'true', description: 'Toggles the feature that reduces the timeout for packets in the termination phase (FIN or RST)' },
  { attribute: 'Aggressive aging - Enable reduced timeout for UDP connections', type: 'bool', value: 'true', description: 'Toggles the feature that applies reduced timeouts to UDP connections to optimize resource usage' },
];

function ValueCell({ type, value }: { type: SettingType; value: string }) {
  if (type === 'bool') {
    return <span className={value === 'true' ? 'adv-val-true' : 'adv-val-false'}>{value}</span>;
  }
  if (type === 'options') {
    return <span className="adv-val-options">{value}</span>;
  }
  return <span>{value}</span>;
}

export function AdvancedSettings() {
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState('');
  const fire = (msg: string) => dispatch(addNotification({ type: 'info', message: msg }));

  const filtered = SETTINGS.filter(s =>
    s.attribute.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 4 }}>Advanced Settings</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Manage very advanced settings of the device
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 14, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
        <AlertTriangle size={14} color="var(--yellow)" style={{ flexShrink: 0, marginTop: 2 }} />
        <span>Changing these advanced settings can be harmful to the stability, security and performance of the appliance</span>
      </div>

      <div className="adv-toolbar">
        <button className="btn btn-secondary btn-sm" onClick={() => fire('Edit selected setting…')}>Edit</button>
        <button className="btn btn-secondary btn-sm" onClick={() => fire('Restoring defaults…')}>Restore Defaults</button>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <input
            className="form-control"
            style={{ width: 200, height: 28, fontSize: '0.78rem' }}
            placeholder="Type to filter"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Search size={14} color="var(--text-muted)" />
        </div>
      </div>

      <table className="data-table" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Attribute Name</th>
            <th style={{ width: 70 }}>Type</th>
            <th style={{ width: 80 }}>Value</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(s => (
            <tr key={s.attribute}>
              <td style={{ color: 'var(--brand)', cursor: 'pointer' }}
                onClick={() => fire(`Edit: ${s.attribute}`)}>
                {s.attribute}
              </td>
              <td style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{s.type}</td>
              <td><ValueCell type={s.type} value={s.value} /></td>
              <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{s.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
