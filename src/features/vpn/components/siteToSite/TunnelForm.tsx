import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { closeTunnelModal } from '../../vpnSlice';
import { Button } from '../../../../components/common/Button';
import type { VpnTunnel } from '../../../../types/vpn';

type FormData = Pick<VpnTunnel,
  'name' | 'peerIp' | 'peerName' | 'ikeVersion'
  | 'phase1Encryption' | 'phase1Hash' | 'phase1DhGroup' | 'phase1Lifetime'
  | 'phase2Encryption' | 'phase2Hash' | 'phase2Lifetime' | 'comment'
> & { localSubnetsText: string; remoteSubnetsText: string; preSharedKey: string };

export function TunnelForm() {
  const dispatch = useAppDispatch();
  const { saving } = useAppSelector(s => s.vpn);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      ikeVersion: 'IKEv2',
      phase1Encryption: 'AES-256', phase1Hash: 'SHA256', phase1DhGroup: 'Group14', phase1Lifetime: 86400,
      phase2Encryption: 'AES-256', phase2Hash: 'SHA256', phase2Lifetime: 3600,
    },
  });

  const onSubmit = (data: FormData) => {
    dispatch({
      type: 'vpn/saveTunnel',
      payload: {
        ...data,
        localSubnets: data.localSubnetsText.split(',').map(s => s.trim()).filter(Boolean),
        remoteSubnets: data.remoteSubnetsText.split(',').map(s => s.trim()).filter(Boolean),
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Tunnel Name *</label>
          <input className="form-control" {...register('name', { required: 'Required' })} placeholder="HQ-Branch" />
          {errors.name && <span className="form-error">{errors.name.message}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Peer IP *</label>
          <input className="form-control" {...register('peerIp', { required: 'Required' })} placeholder="198.51.100.1" />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Peer Name / Description</label>
          <input className="form-control" {...register('peerName')} placeholder="Branch Office - London" />
        </div>
        <div className="form-group">
          <label className="form-label">IKE Version</label>
          <select className="form-control" {...register('ikeVersion')}>
            <option value="IKEv2">IKEv2 (recommended)</option>
            <option value="IKEv1">IKEv1 (legacy)</option>
          </select>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', padding: '12px 0 4px', marginBottom: 8 }}>
        <span style={{ fontWeight: 600, fontSize: '0.82rem' }}>Phase 1 (IKE)</span>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Encryption</label>
          <select className="form-control" {...register('phase1Encryption')}>
            <option>AES-256</option><option>AES-128</option><option>3DES</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Hash</label>
          <select className="form-control" {...register('phase1Hash')}>
            <option>SHA256</option><option>SHA384</option><option>SHA1</option><option>MD5</option>
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">DH Group</label>
          <select className="form-control" {...register('phase1DhGroup')}>
            <option>Group14</option><option>Group19</option><option>Group20</option><option>Group5</option><option>Group2</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Lifetime (sec)</label>
          <input className="form-control" type="number" {...register('phase1Lifetime', { valueAsNumber: true })} />
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', padding: '12px 0 4px', marginBottom: 8 }}>
        <span style={{ fontWeight: 600, fontSize: '0.82rem' }}>Phase 2 (ESP)</span>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Encryption</label>
          <select className="form-control" {...register('phase2Encryption')}>
            <option>AES-256</option><option>AES-128</option><option>3DES</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Lifetime (sec)</label>
          <input className="form-control" type="number" {...register('phase2Lifetime', { valueAsNumber: true })} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Local Subnets <span className="form-hint">(comma-separated CIDRs)</span></label>
        <input className="form-control" {...register('localSubnetsText')} placeholder="192.168.1.0/24, 172.16.0.0/16" />
      </div>
      <div className="form-group">
        <label className="form-label">Remote Subnets</label>
        <input className="form-control" {...register('remoteSubnetsText')} placeholder="10.10.0.0/24" />
      </div>
      <div className="form-group">
        <label className="form-label">Pre-Shared Key</label>
        <input className="form-control" type="password" {...register('preSharedKey')} placeholder="•••••••••" />
      </div>

      <div className="modal-footer" style={{ padding: '14px 0 0', borderTop: '1px solid var(--border)', marginTop: 4 }}>
        <Button variant="ghost" type="button" onClick={() => dispatch(closeTunnelModal())}>Cancel</Button>
        <Button variant="primary" type="submit" loading={saving}>Add VPN Tunnel</Button>
      </div>
    </form>
  );
}
