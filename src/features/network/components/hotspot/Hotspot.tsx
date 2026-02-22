import { useForm } from 'react-hook-form';
import { AlertTriangle, Info } from 'lucide-react';
import { useAppDispatch } from '../../../../app/hooks';
import { addNotification } from '../../../../app/uiSlice';

interface HotspotForm {
  requireAuth: boolean;
  accessMode: 'all' | 'group';
  sessionTimeout: number;
}

export function Hotspot() {
  const dispatch = useAppDispatch();
  const { register, watch, handleSubmit, reset } = useForm<HotspotForm>({
    defaultValues: { requireAuth: false, accessMode: 'all', sessionTimeout: 240 },
  });

  const requireAuth = watch('requireAuth');

  const onSave = (_data: HotspotForm) => {
    dispatch(addNotification({ type: 'success', message: 'Hotspot settings saved.' }));
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 4 }}>Hotspot</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Configure guest access and hotspot Browser-Based Authentication
        </p>
      </div>

      <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 12 }}>Hotspot</h3>

      {/* Alert rows */}
      <div className="hotspot-alerts">
        <div className="hotspot-alert-row">
          <AlertTriangle size={14} color="var(--warning, #f59e0b)" style={{ flexShrink: 0, marginTop: 1 }} />
          <span>
            No network interfaces are defined for Hotspot
            {' | '}
            <a href="/device/local-network">Configure in Local Network</a>
          </span>
        </div>
        <div className="hotspot-alert-row">
          <Info size={14} color="var(--brand)" style={{ flexShrink: 0, marginTop: 1 }} />
          <span>
            No network objects are excluded from Hotspot
            {' | '}
            <a href="#">No source exceptions…</a>
            {' | '}
            <a href="#">No destination exceptions (advanced)…</a>
          </span>
        </div>
      </div>

      {/* Access section */}
      <form onSubmit={handleSubmit(onSave)}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12 }}>Access</h4>
        <div className="hotspot-access">
          {/* Require auth checkbox */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', cursor: 'pointer' }}>
            <input type="checkbox" {...register('requireAuth')} />
            Require authentication
          </label>

          {/* Radio group — grayed when auth not required */}
          <div className="hotspot-radio-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: requireAuth ? 1 : 0.45 }}>
              <input
                type="radio"
                value="all"
                disabled={!requireAuth}
                {...register('accessMode')}
              />
              Allow access to all users
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: requireAuth ? 1 : 0.45 }}>
              <input
                type="radio"
                value="group"
                disabled={!requireAuth}
                {...register('accessMode')}
              />
              Allow access to a specific group…
            </label>
          </div>

          {/* Session timeout */}
          <div className="hotspot-timeout-row">
            <label style={{ color: 'var(--text-secondary)' }}>Session timeout:</label>
            <input
              className="form-control"
              style={{ width: 70 }}
              type="number"
              min={1}
              {...register('sessionTimeout', { valueAsNumber: true })}
            />
            <span style={{ color: 'var(--text-secondary)' }}>minutes</span>
          </div>

          {/* Portal link */}
          <div style={{ marginTop: 16 }}>
            <a href="#" style={{ fontSize: '0.82rem', color: 'var(--brand)' }}>
              Customize Hotspot portal…
            </a>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
          <button type="button" className="btn btn-secondary" onClick={() => reset()}>Cancel</button>
          <button type="submit" className="btn btn-primary">Save</button>
        </div>
      </form>
    </div>
  );
}
