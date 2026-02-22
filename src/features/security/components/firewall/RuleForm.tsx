import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { closeRuleModal } from '../../securitySlice';
import { Button } from '../../../../components/common/Button';
import type { FirewallRule } from '../../../../types/security';

type FormData = Omit<FirewallRule, 'id' | 'number'> & {
  sourceText: string;
  destinationText: string;
  serviceText: string;
};

interface Props { initial?: Partial<FirewallRule> }

export function RuleForm({ initial }: Props) {
  const dispatch = useAppDispatch();
  const { saving } = useAppSelector(s => s.security);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: initial?.name ?? '',
      sourceText: initial?.source?.join(', ') ?? 'Any',
      destinationText: initial?.destination?.join(', ') ?? 'Any',
      serviceText: initial?.service?.join(', ') ?? 'Any',
      action: initial?.action ?? 'Accept',
      track: initial?.track ?? 'Log',
      enabled: initial?.enabled ?? true,
      comment: initial?.comment ?? '',
    },
  });

  const onSubmit = (data: FormData) => {
    const payload = {
      name: data.name,
      source: data.sourceText.split(',').map(s => s.trim()).filter(Boolean),
      destination: data.destinationText.split(',').map(s => s.trim()).filter(Boolean),
      service: data.serviceText.split(',').map(s => s.trim()).filter(Boolean),
      action: data.action,
      track: data.track,
      enabled: data.enabled,
      installedOn: ['All'],
      comment: data.comment,
    };
    dispatch({ type: 'security/saveRule', payload: { data: payload, id: initial?.id } });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label className="form-label">Rule Name *</label>
        <input className="form-control" {...register('name', { required: 'Required' })} placeholder="Allow LAN to Internet" />
        {errors.name && <span className="form-error">{errors.name.message}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Source <span className="form-hint">(comma-separated objects)</span></label>
        <input className="form-control" {...register('sourceText')} placeholder="Any, LAN, 192.168.1.0/24" />
      </div>

      <div className="form-group">
        <label className="form-label">Destination</label>
        <input className="form-control" {...register('destinationText')} placeholder="Any, Internet" />
      </div>

      <div className="form-group">
        <label className="form-label">Service</label>
        <input className="form-control" {...register('serviceText')} placeholder="Any, HTTP, HTTPS, DNS" />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Action</label>
          <select className="form-control" {...register('action')}>
            <option value="Accept">Accept</option>
            <option value="Drop">Drop</option>
            <option value="Reject">Reject</option>
            <option value="Encrypt">Encrypt</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Track</label>
          <select className="form-control" {...register('track')}>
            <option value="None">None</option>
            <option value="Log">Log</option>
            <option value="Alert">Alert</option>
            <option value="Mail">Mail</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" {...register('enabled')} />
          <span>Rule enabled</span>
        </label>
      </div>

      <div className="form-group">
        <label className="form-label">Comment</label>
        <input className="form-control" {...register('comment')} placeholder="Optional description" />
      </div>

      <div className="modal-footer" style={{ padding: '14px 0 0', borderTop: '1px solid var(--border)', marginTop: 4 }}>
        <Button variant="ghost" type="button" onClick={() => dispatch(closeRuleModal())}>Cancel</Button>
        <Button variant="primary" type="submit" loading={saving}>
          {initial?.id ? 'Save Rule' : 'Add Rule'}
        </Button>
      </div>
    </form>
  );
}
