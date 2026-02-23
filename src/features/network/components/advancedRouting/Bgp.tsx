import { useForm } from 'react-hook-form';
import { useAppDispatch } from '../../../../app/hooks';
import { addNotification } from '../../../../app/uiSlice';

interface BgpForm {
  routerId: string;
  autonomousSystem: string;
  enablePeerLimit: boolean;
  peerLimit: string;
  enableCommunities: boolean;
}

export function Bgp() {
  const dispatch = useAppDispatch();
  const { register, watch, handleSubmit, reset } = useForm<BgpForm>({
    defaultValues: {
      routerId: '192.168.1.1',
      autonomousSystem: '',
      enablePeerLimit: false,
      peerLimit: '',
      enableCommunities: false,
    },
  });

  const enablePeerLimit = watch('enablePeerLimit');

  const onSave = (_data: BgpForm) => {
    dispatch(addNotification({ type: 'success', message: 'BGP settings saved.' }));
  };

  return (
    <div className="page-form-wrapper">
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 4 }}>BGP</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: 680 }}>
          Border Gateway Protocol (BGP) is an inter-AS protocol, meaning that it can be deployed within and between autonomous systems (AS)
        </p>
      </div>

      <form onSubmit={handleSubmit(onSave)}>
        {/* Global Settings */}
        <div className="bgp-section-hdr">Global Settings</div>

        <div className="bgp-field-row">
          <span className="bgp-field-label">Router ID:</span>
          <input className="form-control" style={{ width: 180 }} {...register('routerId')} />
        </div>
        <div className="bgp-field-row">
          <span className="bgp-field-label">Autonomous system:</span>
          <input className="form-control" style={{ width: 180 }} {...register('autonomousSystem')} />
        </div>
        <div className="bgp-field-row">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" {...register('enablePeerLimit')} />
            Enabled Peer Limit
          </label>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginLeft: 8 }}>Peer Limit:</span>
          <input
            className="form-control"
            style={{ width: 80 }}
            disabled={!enablePeerLimit}
            {...register('peerLimit')}
          />
        </div>

        {/* Miscellaneous Settings */}
        <div className="bgp-section-hdr" style={{ marginTop: 20 }}>Miscellaneous Settings</div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', cursor: 'pointer' }}>
          <input type="checkbox" {...register('enableCommunities')} />
          Enable communities
        </label>

        <div className="page-actions">
          <button type="button" className="btn btn-secondary" onClick={() => reset()}>Cancel</button>
          <button type="submit" className="btn btn-primary">Save</button>
        </div>
      </form>
    </div>
  );
}
