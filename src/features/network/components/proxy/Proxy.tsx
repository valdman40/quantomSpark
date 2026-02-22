import { useForm } from 'react-hook-form';
import { useAppDispatch } from '../../../../app/hooks';
import { addNotification } from '../../../../app/uiSlice';

interface ProxyForm {
  useProxy: boolean;
  host: string;
  port: string;
}

export function Proxy() {
  const dispatch = useAppDispatch();
  const { register, watch, handleSubmit, reset } = useForm<ProxyForm>({
    defaultValues: { useProxy: false, host: '', port: '' },
  });

  const useProxy = watch('useProxy');

  const onSave = (_data: ProxyForm) => {
    dispatch(addNotification({ type: 'success', message: 'Proxy settings saved.' }));
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 4 }}>Proxy</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Configure web proxy settings for the appliance
        </p>
      </div>

      <form onSubmit={handleSubmit(onSave)}>
        <div className="proxy-form">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', cursor: 'pointer' }}>
            <input type="checkbox" {...register('useProxy')} />
            Use a proxy server
          </label>

          <div className="proxy-field-row">
            <span className="proxy-field-label">Host name or IP address:</span>
            <input
              className="form-control"
              style={{ width: 200 }}
              disabled={!useProxy}
              placeholder="proxy.example.com"
              {...register('host')}
            />
          </div>

          <div className="proxy-field-row">
            <span className="proxy-field-label">Port:</span>
            <input
              className="form-control"
              style={{ width: 80 }}
              disabled={!useProxy}
              placeholder="8080"
              type="number"
              {...register('port')}
            />
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
