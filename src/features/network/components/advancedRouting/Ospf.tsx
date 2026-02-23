import { AlertTriangle, Plus } from 'lucide-react';
import { useAppDispatch } from '../../../../app/hooks';
import { addNotification } from '../../../../app/uiSlice';

export function Ospf() {
  const dispatch = useAppDispatch();
  const fire = (msg: string) => dispatch(addNotification({ type: 'info', message: msg }));

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 4 }}>OSPF</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Open Shortest Path First uses a link state routing algorithm operating within a single autonomous system
        </p>
      </div>

      {/* Summary table */}
      <table className="data-table ospf-summary-table">
        <thead>
          <tr>
            <th>Instance</th>
            <th>Router ID</th>
            <th>Number of Areas</th>
            <th>Number of Interfaces</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem', padding: '10px' }}>
              <span className="spinner" style={{ marginRight: 6 }} />
              Loading…
            </td>
          </tr>
        </tbody>
      </table>

      {/* Router ID */}
      <div className="ospf-section-hdr">Router ID</div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 14, fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: 700 }}>
        <AlertTriangle size={14} color="var(--yellow)" style={{ flexShrink: 0, marginTop: 2 }} />
        <span>
          No Router ID is configured. A Router ID will be selected automatically from one of the available interface addresses configured on the system.
          The Router ID currently in use is displayed below. If this Security Gateway is part of a cluster, make sure the Router ID is identical on all cluster members.
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
        <div className="ospf-field-row" style={{ margin: 0 }}>
          <span className="ospf-field-label">Router ID:</span>
          <input className="form-control" style={{ width: 150 }} placeholder="" />
        </div>
        <div className="ospf-field-row" style={{ margin: 0 }}>
          <span className="ospf-field-label">Automatic router ID:</span>
          <input className="form-control" style={{ width: 150 }} placeholder="" disabled />
        </div>
      </div>
      <button className="btn btn-secondary btn-sm" style={{ opacity: 0.5, marginBottom: 20 }}
        onClick={() => fire('Applying Router ID…')}>
        Apply Router ID
      </button>

      {/* Global Options */}
      <div className="ospf-section-hdr">Global Options (for all areas)</div>
      <button className="btn btn-secondary btn-sm" style={{ marginBottom: 20 }}
        onClick={() => fire('Editing global OSPF options…')}>
        Edit Global Options
      </button>

      {/* Interfaces */}
      <div className="ospf-section-hdr">Interfaces</div>
      <div className="route-toolbar">
        <button className="btn btn-secondary btn-sm" onClick={() => fire('New OSPF interface…')}>
          <Plus size={13} style={{ marginRight: 3 }} /> New
        </button>
        <button className="btn btn-secondary btn-sm" onClick={() => fire('Edit OSPF interface…')}>Edit</button>
        <button className="btn btn-secondary btn-sm" onClick={() => fire('Delete OSPF interface…')}>Delete</button>
      </div>
      <table className="data-table" style={{ width: '100%', marginBottom: 24 }}>
        <thead>
          <tr>
            <th>Interface</th>
            <th>Area</th>
            <th>Hello Interval</th>
            <th>Dead Interval</th>
            <th>Retransmit Interval</th>
            <th>Cost</th>
            <th>Priority</th>
            <th>Passive</th>
            <th>IP Reachability Detection</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={9} style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem', padding: '14px' }}>
              No items were found
            </td>
          </tr>
        </tbody>
      </table>

      {/* Areas */}
      <div className="ospf-section-hdr">Areas</div>
      <div className="route-toolbar">
        <button className="btn btn-secondary btn-sm" onClick={() => fire('New OSPF area…')}>
          <Plus size={13} style={{ marginRight: 3 }} /> New
        </button>
        <button className="btn btn-secondary btn-sm" onClick={() => fire('Edit OSPF area…')}>Edit</button>
        <button className="btn btn-secondary btn-sm" onClick={() => fire('Delete OSPF area…')}>Delete</button>
      </div>
      <table className="data-table" style={{ width: 320, marginBottom: 24 }}>
        <thead>
          <tr>
            <th>Area ID</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>0 (backbone)</td>
            <td>Normal</td>
          </tr>
        </tbody>
      </table>

      {/* Route Maps */}
      <div className="ospf-section-hdr">Route Maps</div>
      <button className="btn btn-secondary btn-sm" onClick={() => fire('Editing OSPF Route Maps…')}>
        Edit
      </button>
    </div>
  );
}
