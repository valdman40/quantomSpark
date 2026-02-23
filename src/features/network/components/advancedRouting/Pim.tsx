import { useAppDispatch } from '../../../../app/hooks';
import { addNotification } from '../../../../app/uiSlice';

export function Pim() {
  const dispatch = useAppDispatch();

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 4 }}>PIM</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Protocol-Independent Multicast operates seamlessly with any unicast protocol for multicast forwarding
        </p>
      </div>

      <div className="pim-empty">
        <span>PIM is not configured</span>
        <button
          className="btn btn-secondary"
          onClick={() => dispatch(addNotification({ type: 'info', message: 'Opening PIM configuration…' }))}
        >
          Configure PIM
        </button>
      </div>
    </div>
  );
}
