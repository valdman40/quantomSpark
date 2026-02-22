import { useState } from 'react';
import { AlertTriangle, Plus, ChevronDown, Search } from 'lucide-react';
import { useAppDispatch } from '../../../../app/hooks';
import { addNotification } from '../../../../app/uiSlice';

export function MacFiltering() {
  const dispatch = useAppDispatch();
  const [enabled, setEnabled] = useState(false);
  const [search, setSearch] = useState('');

  const fire = (msg: string) =>
    dispatch(addNotification({ type: 'info', message: msg }));

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 4 }}>MAC Filtering</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Allow clients with specific MAC addresses to access the network
        </p>
      </div>

      {/* Toggle */}
      <div className="mac-toggle-row">
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => setEnabled(v => !v)}
          style={{
            width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer',
            background: enabled ? 'var(--brand)' : '#cbd5e1',
            position: 'relative', transition: 'background .2s', flexShrink: 0,
          }}
        >
          <span style={{
            position: 'absolute', top: 3, left: enabled ? 20 : 3,
            width: 16, height: 16, borderRadius: 8, background: '#fff',
            transition: 'left .2s',
          }} />
        </button>
        <span>Allow LAN access only to the following clients</span>
      </div>

      {/* Warning */}
      <div className="mac-warning">
        <AlertTriangle size={14} color="var(--warning, #f59e0b)" />
        <span>MAC filtering is enforced on LAN ports only.</span>
      </div>

      {/* LAN MAC Filter section */}
      <div className="mac-section">
        <div className="mac-section-hdr">LAN MAC Filter</div>
        <div className="mac-toolbar">
          <button className="btn btn-secondary btn-sm" onClick={() => fire('Add MAC address…')}>
            <Plus size={13} style={{ marginRight: 3 }} />
            Add
            <ChevronDown size={12} style={{ marginLeft: 2 }} />
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => fire('Edit selected…')}>Edit</button>
          <button className="btn btn-secondary btn-sm" onClick={() => fire('Delete selected…')}>Delete</button>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
            <input
              className="form-control"
              style={{ width: 140, height: 28, fontSize: '0.78rem' }}
              placeholder="Type to filter"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Search size={14} color="var(--text-muted)" />
          </div>
        </div>

        {/* Table */}
        <table className="data-table" style={{ width: '100%' }}>
          <thead>
            <tr><th>MAC Address</th></tr>
          </thead>
          <tbody>
            <tr>
              <td className="mac-empty">
                <a href="#" onClick={e => { e.preventDefault(); fire('Add MAC address…'); }}>
                  Add a MAC address
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
        <button type="button" className="btn btn-secondary">Cancel</button>
        <button type="button" className="btn btn-primary" onClick={() => fire('MAC filtering settings saved.')}>
          Save
        </button>
      </div>
    </div>
  );
}
