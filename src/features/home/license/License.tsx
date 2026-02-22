import { FileText } from 'lucide-react';
import { mockBladeCategories } from '../../../mocks/data/home';
import { useAppDispatch } from '../../../app/hooks';
import { addNotification } from '../../../app/uiSlice';

export function License() {
  const dispatch = useAppDispatch();
  const blades = mockBladeCategories.flatMap(cat => cat.blades);

  return (
    <div style={{ maxWidth: 780 }}>
      <div className="card" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Software Blade</th>
              <th>Expiration</th>
            </tr>
          </thead>
          <tbody>
            {blades.map((blade, i) => (
              <tr key={blade.id} style={i === 3 ? { background: '#eff6ff' } : undefined}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FileText size={14} color="var(--text-muted)" />
                    {blade.name}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FileText size={13} color="var(--blue)" />
                    <span style={{ color: 'var(--blue)', fontSize: '0.82rem' }}>
                      Trial (2147483647 days left)
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="license-footer">
          <span>Appliance activation is required:</span>
          <span>MAC address: <strong>00:50:56:9E:FE:D1</strong></span>
          <span>Registration key: <strong>5E0D43047C141651</strong></span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => dispatch(addNotification({ type: 'info', message: 'Opening license activation…' }))}
            >
              Activate License
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => dispatch(addNotification({ type: 'info', message: 'Opening offline activation…' }))}
            >
              Offline
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => dispatch(addNotification({ type: 'info', message: 'Opening proxy settings…' }))}
            >
              Set proxy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
