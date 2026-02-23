import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useAppDispatch } from '../../../../app/hooks';
import { addNotification } from '../../../../app/uiSlice';

export function RouteMap() {
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState('');
  const fire = (msg: string) => dispatch(addNotification({ type: 'info', message: msg }));

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 4 }}>Route Map</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Route Maps are used to configure routing policy. Route Maps work with dynamic routing protocols such as BGP and OSPF
        </p>
      </div>

      <div className="route-toolbar">
        <button className="btn btn-secondary btn-sm" onClick={() => fire('New Route Map…')}>
          <Plus size={13} style={{ marginRight: 3 }} /> New
        </button>
        <button className="btn btn-secondary btn-sm" onClick={() => fire('Edit selected Route Map…')}>Edit</button>
        <button className="btn btn-secondary btn-sm" onClick={() => fire('Delete selected Route Map…')}>Delete</button>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <input
            className="form-control"
            style={{ width: 160, height: 28, fontSize: '0.78rem' }}
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Search size={14} color="var(--text-muted)" />
          <span className="route-count">0 Route Maps</span>
        </div>
      </div>

      <table className="data-table" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Route Map ID</th>
            <th>Behavior</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem', padding: '20px' }}>
              No Route Maps were configured
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
