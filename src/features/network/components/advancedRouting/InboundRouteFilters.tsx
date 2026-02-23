import { AlertTriangle, Plus, ChevronDown } from 'lucide-react';
import { useAppDispatch } from '../../../../app/hooks';
import { addNotification } from '../../../../app/uiSlice';

const FILTERS = [
  { no: 1, fromProtocol: 'OSPFv2', route: 'All IPv4 routes', matchType: '', action: 'Accept', rank: '', localPref: '', weight: '', communities: '' },
];

export function InboundRouteFilters() {
  const dispatch = useAppDispatch();
  const fire = (msg: string) => dispatch(addNotification({ type: 'info', message: msg }));

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 4 }}>Inbound Route Filters</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: 680 }}>
          Inbound route filters allow a network administrator to restrict or constrain the set of routes accepted by a given routing protocol
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 16, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
        <AlertTriangle size={14} color="var(--yellow)" style={{ flexShrink: 0, marginTop: 2 }} />
        <span>
          If you have both Route Redistributions and Route Maps (via CLI) configured for the same protocol (e.g. OSPF), Route Maps takes precedence.
        </span>
      </div>

      <div className="route-section-hdr">Inbound Route Filters</div>

      <div className="route-toolbar">
        <button className="btn btn-secondary btn-sm" onClick={() => fire('New inbound route filter…')}>
          <Plus size={13} style={{ marginRight: 3 }} /> New <ChevronDown size={12} style={{ marginLeft: 2 }} />
        </button>
        <button className="btn btn-secondary btn-sm" onClick={() => fire('Edit selected filter…')}>Edit</button>
        <button className="btn btn-secondary btn-sm" onClick={() => fire('Delete selected filter…')}>Delete</button>
      </div>

      <table className="data-table" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>No.</th>
            <th>From Protocol</th>
            <th>Route</th>
            <th>Match Type</th>
            <th>Action</th>
            <th>Rank</th>
            <th>Local Preference</th>
            <th>Weight</th>
            <th>Communities to Match</th>
          </tr>
        </thead>
        <tbody>
          {FILTERS.map(f => (
            <tr key={f.no}>
              <td>{f.no}</td>
              <td>{f.fromProtocol}</td>
              <td>{f.route}</td>
              <td>{f.matchType}</td>
              <td>{f.action}</td>
              <td>{f.rank}</td>
              <td>{f.localPref}</td>
              <td>{f.weight}</td>
              <td>{f.communities}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
