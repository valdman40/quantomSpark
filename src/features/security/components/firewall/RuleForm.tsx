import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { closeRuleModal } from '../../securitySlice';
import { Button } from '../../../../components/common/Button';
import { normalizeFirewallRules } from '../../../../services/api/normalizers/firewallNormalizer';
import type { FirewallRule } from '../../../../types/security';
import type { GatewayFwRule } from '../../../../types/gateway';

const ZONE_LABELS: Record<string, string> = {
  'ZONE.OUTGOING':          'Outgoing Internet Access',
  'ZONE.INTERNAL_INCOMING': 'Incoming, Internal and VPN Traffic',
};

type FormData = {
  name:            string;
  sourceText:      string;
  destinationText: string;
  serviceText:     string;
  action:          FirewallRule['action'];
  track:           FirewallRule['track'];
  enabled:         boolean;
  comment:         string;
};

interface Props {
  initial?:         Partial<FirewallRule>;
  gatewayDefaults?: GatewayFwRule | null;
}

export function RuleForm({ initial, gatewayDefaults }: Props) {
  const dispatch = useAppDispatch();
  const { saving, error } = useAppSelector(s => s.security);

  // Normalize gateway defaults into our FirewallRule shape so field mapping is consistent.
  // Used only for new rules (when initial is absent).
  const normalizedDefaults: Partial<FirewallRule> | undefined =
    !initial && gatewayDefaults
      ? normalizeFirewallRules([gatewayDefaults])[0]
      : undefined;

  // Prefer: explicit initial (edit) → normalized gateway defaults (new via real API) → hard-coded fallbacks
  const base = initial ?? normalizedDefaults;

  // Derive zone label for the modal subtitle
  const zoneLabel = gatewayDefaults?.zone
    ? ZONE_LABELS[gatewayDefaults.zone]
    : base?.zone
      ? ZONE_LABELS[base.zone]
      : null;

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name:            base?.name                    ?? '',
      sourceText:      base?.source?.map(s => s.name).join(', ')      ?? 'Any',
      destinationText: base?.destination?.map(s => s.name).join(', ') ?? 'Any',
      serviceText:     base?.service?.map(s => s.name).join(', ') ?? 'Any',
      action:          base?.action                  ?? 'Drop',
      track:           base?.track                   ?? 'Log',
      enabled:         base?.enabled                 ?? true,
      comment:         base?.comment                 ?? '',
    },
  });

  const onSubmit = (data: FormData) => {
    const payload: Partial<FirewallRule> = {
      name:        data.name,
      source:      data.sourceText.split(',').map(s => s.trim()).filter(Boolean).map(name => ({ name })),
      destination: data.destinationText.split(',').map(s => s.trim()).filter(Boolean).map(name => ({ name })),
      service:     data.serviceText.split(',').map(s => s.trim()).filter(Boolean).map(name => ({ name })),
      action:      data.action,
      track:       data.track,
      enabled:     data.enabled,
      installedOn: ['All'],
      comment:     data.comment || undefined,
      zone:        initial?.zone,
      origin:      initial?.origin,
      idx:         initial?.idx,
    };
    dispatch({ type: 'security/saveRule', payload: { data: payload, id: initial?.id } });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Zone context label */}
      {zoneLabel && (
        <p className="rule-form-zone-label">{zoneLabel}</p>
      )}

      {/* ── Horizontal inline editor table ─────────────────────────────────── */}
      <div className="rule-form-editor-wrap">
        <table className="rule-form-editor">
          <thead>
            <tr>
              <th className="rule-form-th">Name</th>
              <th className="rule-form-th">Sources</th>
              <th className="rule-form-th">Destinations</th>
              <th className="rule-form-th">Applications and Services</th>
              <th className="rule-form-th">Action</th>
              <th className="rule-form-th">Log</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {/* Name */}
              <td className="rule-form-td">
                <input
                  className={`rule-form-input rule-form-input--name${errors.name ? ' rule-form-input--error' : ''}`}
                  placeholder="Rule_Name"
                  {...register('name', { required: 'Required' })}
                />
                {errors.name && <span className="rule-form-error">{errors.name.message}</span>}
              </td>

              {/* Sources */}
              <td className="rule-form-td">
                <div className="rule-form-object-cell">
                  <input
                    className="rule-form-input rule-form-input--object"
                    placeholder="Any"
                    {...register('sourceText')}
                  />
                </div>
              </td>

              {/* Destinations */}
              <td className="rule-form-td">
                <div className="rule-form-object-cell">
                  <input
                    className="rule-form-input rule-form-input--object"
                    placeholder="Any"
                    {...register('destinationText')}
                  />
                </div>
              </td>

              {/* Services */}
              <td className="rule-form-td">
                <div className="rule-form-object-cell">
                  <input
                    className="rule-form-input rule-form-input--object"
                    placeholder="Any"
                    {...register('serviceText')}
                  />
                </div>
              </td>

              {/* Action */}
              <td className="rule-form-td">
                <select className="rule-form-select" {...register('action')}>
                  <option value="Accept">Accept</option>
                  <option value="Drop">Drop</option>
                  <option value="Reject">Reject</option>
                  <option value="Encrypt">Encrypt</option>
                </select>
              </td>

              {/* Track / Log */}
              <td className="rule-form-td">
                <select className="rule-form-select" {...register('track')}>
                  <option value="None">None</option>
                  <option value="Log">Log</option>
                  <option value="Alert">Alert</option>
                  <option value="Mail">Mail</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Comment */}
      <textarea
        className="rule-form-comment"
        placeholder="Write a comment…"
        rows={2}
        {...register('comment')}
      />

      {/* Optional sections (UI chrome — not yet wired to form state) */}
      <div className="rule-form-optional-section">
        <label className="rule-form-optional-label">
          <input type="checkbox" disabled />
          <span>Apply only during this time:</span>
        </label>
        <div className="rule-form-optional-inputs">
          <input className="rule-form-input rule-form-input--time" disabled placeholder="09:00 AM" />
          <span className="rule-form-optional-sep">›</span>
          <input className="rule-form-input rule-form-input--time" disabled placeholder="09:00 AM" />
        </div>
      </div>

      <div className="rule-form-optional-section">
        <label className="rule-form-optional-label">
          <input type="checkbox" disabled />
          <span>Limit download traffic of applications to:</span>
        </label>
        <div className="rule-form-optional-inputs">
          <input className="rule-form-input rule-form-input--bandwidth" disabled placeholder="1000" />
          <span className="rule-form-optional-unit">Kbps</span>
        </div>
      </div>

      <div className="rule-form-optional-section">
        <label className="rule-form-optional-label">
          <input type="checkbox" disabled />
          <span>Limit upload traffic of applications to:</span>
        </label>
        <div className="rule-form-optional-inputs">
          <input className="rule-form-input rule-form-input--bandwidth" disabled placeholder="100" />
          <span className="rule-form-optional-unit">Kbps</span>
        </div>
      </div>

      {/* Enabled toggle */}
      <div className="rule-form-enabled-row">
        <label>
          <input type="checkbox" {...register('enabled')} />
          <span>Rule enabled</span>
        </label>
      </div>

      {/* Save error banner */}
      {error && (
        <div className="rule-form-error-banner">
          <strong>Save failed:</strong> {error}
        </div>
      )}

      {/* Footer */}
      <div className="modal-footer" style={{ padding: '14px 0 0', borderTop: '1px solid var(--border)', marginTop: 12 }}>
        <Button variant="ghost" type="button" onClick={() => dispatch(closeRuleModal())}>Cancel</Button>
        <Button variant="primary" type="submit" loading={saving}>
          {initial?.id ? 'Save Rule' : 'Add Rule'}
        </Button>
      </div>
    </form>
  );
}
