import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { closeInterfaceModal } from '../../networkSlice';
import { Button } from '../../../../components/common/Button';
import type { NetworkInterface } from '../../../../types/network';

type FormData = Omit<NetworkInterface, 'id' | 'macAddress' | 'speedMbps' | 'status'>;

interface Props {
  initial?: Partial<NetworkInterface>;
}

export function InterfaceForm({ initial }: Props) {
  const dispatch = useAppDispatch();
  const { saving } = useAppSelector(s => s.network);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: initial?.name ?? '',
      type: initial?.type ?? 'ethernet',
      ipAddress: initial?.ipAddress ?? '',
      subnetMask: initial?.subnetMask ?? '255.255.255.0',
      gateway: initial?.gateway ?? '',
      mtu: initial?.mtu ?? 1500,
      zone: initial?.zone ?? 'internal',
      dhcp: initial?.dhcp ?? false,
      comment: initial?.comment ?? '',
    },
  });

  const onSubmit = (data: FormData) => {
    dispatch({ type: 'network/saveInterface', payload: { data, id: initial?.id } });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Interface Name *</label>
          <input className="form-control" {...register('name', { required: 'Required' })} placeholder="eth0" />
          {errors.name && <span className="form-error">{errors.name.message}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Type</label>
          <select className="form-control" {...register('type')}>
            <option value="ethernet">Ethernet</option>
            <option value="vlan">VLAN</option>
            <option value="bond">Bond</option>
            <option value="bridge">Bridge</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" {...register('dhcp')} />
          <span>Obtain IP via DHCP</span>
        </label>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">IP Address *</label>
          <input className="form-control" {...register('ipAddress', { required: 'Required' })} placeholder="192.168.1.1" />
          {errors.ipAddress && <span className="form-error">{errors.ipAddress.message}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Subnet Mask *</label>
          <input className="form-control" {...register('subnetMask', { required: 'Required' })} placeholder="255.255.255.0" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Default Gateway</label>
          <input className="form-control" {...register('gateway')} placeholder="192.168.1.254" />
        </div>
        <div className="form-group">
          <label className="form-label">Zone</label>
          <select className="form-control" {...register('zone')}>
            <option value="external">External (WAN)</option>
            <option value="internal">Internal (LAN)</option>
            <option value="dmz">DMZ</option>
            <option value="sync">Sync</option>
            <option value="none">None</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">MTU</label>
          <input className="form-control" type="number" {...register('mtu', { valueAsNumber: true })} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Comment</label>
        <input className="form-control" {...register('comment')} placeholder="Optional description" />
      </div>

      <div className="modal-footer" style={{ padding: '14px 0 0', borderTop: '1px solid var(--border)', marginTop: 4 }}>
        <Button variant="ghost" onClick={() => dispatch(closeInterfaceModal())}>Cancel</Button>
        <Button variant="primary" type="submit" loading={saving}>
          {initial?.id ? 'Save Changes' : 'Add Interface'}
        </Button>
      </div>
    </form>
  );
}
