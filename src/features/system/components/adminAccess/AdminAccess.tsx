import { useForm } from 'react-hook-form';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../../../app/hooks';
import { addNotification } from '../../../../app/uiSlice';

interface AdminAccessForm {
  srcLan: boolean;
  srcVpn: boolean;
  srcInternet: boolean;
  ipMode: 'any' | 'specified' | 'mixed';
  webPort: number;
  sshPort: number;
}

export function AdminAccess() {
  const dispatch = useAppDispatch();
  const { register, handleSubmit, reset } = useForm<AdminAccessForm>({
    defaultValues: {
      srcLan: true,
      srcVpn: true,
      srcInternet: true,
      ipMode: 'any',
      webPort: 4434,
      sshPort: 22,
    },
  });

  const onSave = (_data: AdminAccessForm) => {
    dispatch(addNotification({ type: 'success', message: 'Administrator access settings saved.' }));
  };

  return (
    <div className="page-form-wrapper">
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 4 }}>Administrator Access</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Web (HTTPS) and SSH access for administrators
        </p>
      </div>

      <form onSubmit={handleSubmit(onSave)}>
        {/* Source checkboxes */}
        <p style={{ fontSize: '0.85rem', marginBottom: 10 }}>
          Select the sources from which to allow administrator access:
        </p>
        <div className="admin-source-row">
          <label><input type="checkbox" {...register('srcLan')} /> LAN</label>
          <label><input type="checkbox" {...register('srcVpn')} /> VPN</label>
          <label><input type="checkbox" {...register('srcInternet')} /> Internet</label>
        </div>

        {/* IP mode radios */}
        <p style={{ fontSize: '0.85rem', marginBottom: 10 }}>
          Access from the above sources is allowed from
        </p>
        <div className="admin-radio-group">
          <label>
            <input type="radio" value="any" {...register('ipMode')} />
            Any IP address
          </label>
          <label>
            <input type="radio" value="specified" {...register('ipMode')} />
            Specified IP addresses only
          </label>
          <label>
            <input type="radio" value="mixed" {...register('ipMode')} />
            Specified IP addresses from the Internet and any IP address from other sources
          </label>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 20, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          <AlertTriangle size={14} color="var(--yellow)" style={{ flexShrink: 0, marginTop: 2 }} />
          <span>Block administrator access from the Internet or limit access to specific IP addresses.</span>
        </div>

        {/* 2FA section */}
        <div className="admin-section-hdr">Two-Factor Authentication (2FA)</div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.6 }}>
          Two-Factor Authentication adds an extra layer of security to your account.
          For additional information, press the Help button.
        </p>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', marginBottom: 10, opacity: 0.5 }}>
          <input type="checkbox" disabled />
          Enable Two-Factor Authentication (2FA) enforcement
        </label>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 20, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          <AlertTriangle size={14} color="var(--yellow)" style={{ flexShrink: 0, marginTop: 2 }} />
          <span>
            To enable Two-Factor Authentication, all administrators must first configure an email address and phone number.
            The administrator <strong>admin</strong> is missing an email address and/or phone number.{' '}
            <Link to="/device/administrators" style={{ color: 'var(--brand)' }}>Configure administrators...</Link>
          </span>
        </div>

        {/* Access ports */}
        <div className="admin-section-hdr">Access ports</div>
        <div className="admin-port-row">
          <span className="admin-port-label">Web port (HTTPS):</span>
          <input
            className="form-control"
            style={{ width: 100 }}
            type="number"
            {...register('webPort', { valueAsNumber: true })}
          />
        </div>
        <div className="admin-port-row">
          <span className="admin-port-label">SSH port:</span>
          <input
            className="form-control"
            style={{ width: 100 }}
            type="number"
            {...register('sshPort', { valueAsNumber: true })}
          />
        </div>

        <div className="page-actions">
          <button type="button" className="btn btn-secondary" onClick={() => reset()}>Cancel</button>
          <button type="submit" className="btn btn-primary">Save</button>
        </div>
      </form>
    </div>
  );
}
