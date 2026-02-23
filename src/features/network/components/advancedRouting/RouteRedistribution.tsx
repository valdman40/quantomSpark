import { AlertTriangle, ChevronDown } from 'lucide-react';
import { useAppDispatch } from '../../../../app/hooks';
import { addNotification } from '../../../../app/uiSlice';

export function RouteRedistribution() {
  const dispatch = useAppDispatch();
  const fire = (msg: string) => dispatch(addNotification({ type: 'info', message: msg }));

  return (
    <div className="page-form-wrapper">
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 4 }}>Route Redistribution</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Advertisement of routing information from one protocol to another
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 16, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
        <AlertTriangle size={14} color="var(--yellow)" style={{ flexShrink: 0, marginTop: 2 }} />
        <span>
          If you have both Route Redistributions and Route Maps configured for the same protocol (e.g. OSPF), Route Maps takes precedence.
        </span>
      </div>

      {/* Route Redistributions table */}
      <div className="route-section-hdr">Route Redistributions</div>
      <div className="route-toolbar">
        <button className="btn btn-secondary btn-sm" onClick={() => fire('Add redistribution from…')}>
          Add Redistribution From <ChevronDown size={12} style={{ marginLeft: 2 }} />
        </button>
        <button className="btn btn-secondary btn-sm" onClick={() => fire('Edit selected…')}>Edit</button>
        <button className="btn btn-secondary btn-sm" onClick={() => fire('Delete selected…')}>Delete</button>
      </div>
      <table className="data-table" style={{ width: '100%', marginBottom: 24 }}>
        <thead>
          <tr>
            <th>No.</th>
            <th>To Protocol</th>
            <th>From Protocol</th>
            <th>Route</th>
            <th>Match Type</th>
            <th>Action</th>
            <th>Metric</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem', padding: '14px' }}>
              <span className="spinner" style={{ marginRight: 6 }} />
              Loading…
            </td>
          </tr>
        </tbody>
      </table>

      {/* BGP Redistribution Settings table */}
      <div className="route-section-hdr">BGP Redistribution Settings</div>
      <div className="route-toolbar">
        <button className="btn btn-secondary btn-sm" onClick={() => fire('Edit BGP redistribution settings…')}>Edit</button>
        <button className="btn btn-secondary btn-sm" onClick={() => fire('Reset BGP redistribution settings…')}>Reset</button>
      </div>
      <table className="data-table" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>No.</th>
            <th>To BGP</th>
            <th>MED</th>
            <th>Local Preference</th>
            <th>Communities to Match</th>
            <th>Communities to Append</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem', padding: '14px' }}>
              No items were found
            </td>
          </tr>
        </tbody>
      </table>

      <div className="page-actions">
        <button type="button" className="btn btn-secondary">Cancel</button>
        <button type="button" className="btn btn-primary" onClick={() => fire('Route redistribution settings saved.')}>Save</button>
      </div>
    </div>
  );
}
