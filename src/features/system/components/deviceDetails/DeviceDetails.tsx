import { useForm } from 'react-hook-form';
import { useAppDispatch } from '../../../../app/hooks';
import { addNotification } from '../../../../app/uiSlice';

interface DeviceDetailsForm {
  applianceName: string;
  webCertificate: string;
}

export function DeviceDetails() {
  const dispatch = useAppDispatch();
  const { register, handleSubmit, reset } = useForm<DeviceDetailsForm>({
    defaultValues: {
      applianceName: 'Gateway-ID-569EFED1',
      webCertificate: 'default-web-portal',
    },
  });

  const onSave = (_data: DeviceDetailsForm) => {
    dispatch(addNotification({ type: 'success', message: 'Device details saved.' }));
  };

  return (
    <div className="page-form-wrapper">
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 4 }}>Device Details</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Configure device name and details
        </p>
      </div>

      <form onSubmit={handleSubmit(onSave)}>
        <div className="simple-form">
          <div className="simple-form-row">
            <span className="simple-form-label">Appliance name:</span>
            <input
              className="form-control"
              style={{ width: 240 }}
              {...register('applianceName')}
            />
          </div>
          <div className="simple-form-row">
            <span className="simple-form-label">Web portal certificate:</span>
            <select className="form-control" style={{ width: 240 }} {...register('webCertificate')}>
              <option value="default-web-portal">Default Web Portal Certificate</option>
              <option value="default-vpn-cluster">Default VPN and Cluster certificate</option>
            </select>
          </div>
        </div>

        <div className="page-actions">
          <button type="button" className="btn btn-secondary" onClick={() => reset()}>Cancel</button>
          <button type="submit" className="btn btn-primary">Save</button>
        </div>
      </form>
    </div>
  );
}
