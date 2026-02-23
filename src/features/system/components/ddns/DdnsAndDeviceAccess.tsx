import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ChevronUp, ChevronDown, Info } from 'lucide-react';
import { useAppDispatch } from '../../../../app/hooks';
import { addNotification } from '../../../../app/uiSlice';

interface DdnsForm {
  enableDdns: boolean;
  provider: string;
  username: string;
  password: string;
  hostname: string;
}

export function DdnsAndDeviceAccess() {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState({ ddns: true, reach: true });
  const { register, watch, handleSubmit, reset } = useForm<DdnsForm>({
    defaultValues: { enableDdns: false, provider: 'DynDns', username: '', password: '', hostname: '' },
  });

  const enableDdns = watch('enableDdns');

  const onSave = (_data: DdnsForm) => {
    dispatch(addNotification({ type: 'success', message: 'DDNS settings saved.' }));
  };

  const toggle = (key: 'ddns' | 'reach') =>
    setOpen(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="page-form-wrapper">
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 4 }}>DDNS and Device Access</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Configure a persistent Domain Name for the device
        </p>
      </div>

      <form onSubmit={handleSubmit(onSave)}>
        {/* DDNS section */}
        <div className="sysop-section" style={{ maxWidth: 640 }}>
          <div className="sysop-section-hdr" onClick={() => toggle('ddns')}>
            <span>DDNS</span>
            {open.ddns ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {open.ddns && (
            <div className="sysop-section-body">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', marginBottom: 12, cursor: 'pointer' }}>
                <input type="checkbox" {...register('enableDdns')} />
                Connect to the appliance by name from the Internet (DDNS):
              </label>

              <div className="dt-field-row" style={{ marginBottom: 8 }}>
                <span className="dt-field-label">Provider:</span>
                <select className="form-control" style={{ width: 160 }} disabled={!enableDdns} {...register('provider')}>
                  <option value="DynDns">DynDns</option>
                  <option value="No-IP">No-IP</option>
                </select>
              </div>
              <div className="dt-field-row" style={{ marginBottom: 8 }}>
                <span className="dt-field-label">Username:</span>
                <input className="form-control" style={{ width: 200 }} disabled={!enableDdns} {...register('username')} />
              </div>
              <div className="dt-field-row" style={{ marginBottom: 8 }}>
                <span className="dt-field-label">Password:</span>
                <input className="form-control" style={{ width: 200 }} type="password" disabled={!enableDdns} {...register('password')} />
              </div>
              <div className="dt-field-row" style={{ marginBottom: 8 }}>
                <span className="dt-field-label">Host name:</span>
                <input className="form-control" style={{ width: 200 }} disabled={!enableDdns} {...register('hostname')} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 6 }}>
                <Info size={13} color="var(--blue)" />
                <span>Your routable host name, as defined in your DDNS account</span>
              </div>
            </div>
          )}
        </div>

        {/* Reach My Device section */}
        <div className="sysop-section" style={{ maxWidth: 640 }}>
          <div className="sysop-section-hdr" onClick={() => toggle('reach')}>
            <span>Reach My Device</span>
            {open.reach ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {open.reach && (
            <div className="sysop-section-body">
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <a
                  href="#"
                  style={{ color: 'var(--brand)' }}
                  onClick={e => { e.preventDefault(); dispatch(addNotification({ type: 'info', message: 'Opening device registration…' })); }}
                >
                  Register
                </a>
                {' '}to allow connections to the appliance when it is unreachable from the Internet.
              </p>
            </div>
          )}
        </div>

        <div className="page-actions">
          <button type="button" className="btn btn-secondary" onClick={() => reset()}>Cancel</button>
          <button type="submit" className="btn btn-primary">Save</button>
        </div>
      </form>
    </div>
  );
}
