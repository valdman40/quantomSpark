import { type Dispatch, type SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { closeRuleModal } from '../../securitySlice';
import { Button } from '../../../../components/common/Button';
import { Chip } from '../../../../components/common/Chip';
import { normalizeFirewallRules } from '../../../../services/api/normalizers/firewallNormalizer';
import type { FirewallRule, NetworkItem, ServiceItem } from '../../../../types/security';
import type { GatewayFwRule } from '../../../../types/gateway';
import { networkIcon, serviceIcon } from './ruleIcons';
import { ObjectPicker } from './ObjectPicker';

type PickerTarget = 'source' | 'destination' | 'service' | null;

const ZONE_LABELS: Record<string, string> = {
  'ZONE.OUTGOING':          'Outgoing Internet Access',
  'ZONE.INTERNAL_INCOMING': 'Incoming, Internal and VPN Traffic',
};

type FormData = {
  name:    string;
  action:  FirewallRule['action'];
  track:   FirewallRule['track'];
  enabled: boolean;
  comment: string;
};

interface Props {
  initial?:         Partial<FirewallRule>;
  gatewayDefaults?: GatewayFwRule | null;
}

export function RuleForm({ initial, gatewayDefaults }: Props) {
  const dispatch = useAppDispatch();
  const { saving, error } = useAppSelector(s => s.security);

  const normalizedDefaults: Partial<FirewallRule> | undefined =
    !initial && gatewayDefaults
      ? normalizeFirewallRules([gatewayDefaults])[0]
      : undefined;

  const base = initial ?? normalizedDefaults;

  const zoneLabel = gatewayDefaults?.zone
    ? ZONE_LABELS[gatewayDefaults.zone]
    : base?.zone
      ? ZONE_LABELS[base.zone]
      : null;

  // ── Object list state (managed outside react-hook-form) ──────────────────
  const [sources,      setSources]      = useState<NetworkItem[]>(base?.source      ?? []);
  const [destinations, setDestinations] = useState<NetworkItem[]>(base?.destination ?? []);
  const [services,     setServices]     = useState<ServiceItem[]>(base?.service     ?? []);

  // ── Picker state ──────────────────────────────────────────────────────────
  const [pickerTarget, setPickerTarget] = useState<PickerTarget>(null);
  const [pickerAnchor, setPickerAnchor] = useState<DOMRect | null>(null);

  function openPicker(target: PickerTarget, e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    setPickerAnchor(e.currentTarget.getBoundingClientRect());
    setPickerTarget(target);
  }

  function handlePickerConfirm(items: NetworkItem[] | ServiceItem[]) {
    if (pickerTarget === 'source')      setSources(items as NetworkItem[]);
    if (pickerTarget === 'destination') setDestinations(items as NetworkItem[]);
    if (pickerTarget === 'service')     setServices(items as ServiceItem[]);
    setPickerTarget(null);
  }

  // tracks keys currently animating out
  const [removing, setRemoving] = useState<Set<string>>(new Set());

  function removeWith<T>(
    key: string,
    _list: T[],
    idx: number,
    setList: Dispatch<SetStateAction<T[]>>,
  ) {
    setRemoving(prev => new Set(prev).add(key));
    setTimeout(() => {
      setList(prev => prev.filter((_, i) => i !== idx));
      setRemoving(prev => { const s = new Set(prev); s.delete(key); return s; });
    }, 160);
  }

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name:    base?.name    ?? '',
      action:  base?.action  ?? 'Drop',
      track:   base?.track   ?? 'Log',
      enabled: base?.enabled ?? true,
      comment: base?.comment ?? '',
    },
  });

  const onSubmit = (data: FormData) => {
    const payload: Partial<FirewallRule> = {
      name:        data.name,
      source:      sources.length      ? sources      : [{ name: 'Any' }],
      destination: destinations.length ? destinations : [{ name: 'Any' }],
      service:     services.length     ? services     : [{ name: 'Any' }],
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

  // ── Chip-list renderer ────────────────────────────────────────────────────
  function renderNetworkChips(
    items: NetworkItem[],
    prefix: string,
    setList: Dispatch<SetStateAction<NetworkItem[]>>,
  ) {
    const nonAny = items.filter(it => it.name !== 'Any');
    if (nonAny.length === 0) {
      return <span className="text-muted" style={{ fontSize: '0.82rem' }}>Any</span>;
    }
    return nonAny.map((item, i) => {
      const key = `${prefix}-${i}-${item.name}`;
      return (
        <span key={key} className={`rule-form-chip-wrap${removing.has(key) ? ' removing' : ''}`}>
          <Chip
            label={item.name}
            icon={networkIcon(item.iconKey)}
            tooltip={{ type: item.type, description: item.description, members: item.members }}
          />
          <button
            type="button"
            className="rule-form-chip-remove"
            aria-label={`Remove ${item.name}`}
            onClick={() => removeWith(key, items, i, setList)}
          >✕</button>
        </span>
      );
    });
  }

  function renderServiceChips(
    items: ServiceItem[],
    prefix: string,
    setList: Dispatch<SetStateAction<ServiceItem[]>>,
  ) {
    const nonAny = items.filter(it => it.name !== 'Any');
    if (nonAny.length === 0) {
      return <span className="text-muted" style={{ fontSize: '0.82rem' }}>Any</span>;
    }
    return nonAny.map((svc, i) => {
      const key = `${prefix}-${i}-${svc.name}`;
      return (
        <span key={key} className={`rule-form-chip-wrap${removing.has(key) ? ' removing' : ''}`}>
          <Chip
            label={svc.name}
            icon={svc.appId != null ? (
              <img
                src={`https://sc1.checkpoint.com/za/images/facetime/small_png/${svc.appId}_sml.png`}
                alt=""
                onError={e => { e.currentTarget.style.display = 'none'; }}
              />
            ) : serviceIcon(svc.name)}
            tooltip={{ description: svc.description, tags: svc.tags }}
          />
          <button
            type="button"
            className="rule-form-chip-remove"
            aria-label={`Remove ${svc.name}`}
            onClick={() => removeWith(key, items, i, setList)}
          >✕</button>
        </span>
      );
    });
  }

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
                <div className="rule-form-chip-list">
                  {renderNetworkChips(sources, 'src', setSources)}
                </div>
                <button type="button" className="rule-form-add-btn" onClick={e => openPicker('source', e)}>＋</button>
              </td>

              {/* Destinations */}
              <td className="rule-form-td">
                <div className="rule-form-chip-list">
                  {renderNetworkChips(destinations, 'dst', setDestinations)}
                </div>
                <button type="button" className="rule-form-add-btn" onClick={e => openPicker('destination', e)}>＋</button>
              </td>

              {/* Services */}
              <td className="rule-form-td">
                <div className="rule-form-chip-list">
                  {renderServiceChips(services, 'svc', setServices)}
                </div>
                <button type="button" className="rule-form-add-btn" onClick={e => openPicker('service', e)}>＋</button>
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

      {pickerTarget && pickerAnchor && (
        <ObjectPicker
          mode={pickerTarget === 'service' ? 'service' : 'network'}
          title={
            pickerTarget === 'source'      ? 'Sources' :
            pickerTarget === 'destination' ? 'Destinations' :
                                             'Applications and Services'
          }
          anchor={pickerAnchor}
          selected={
            pickerTarget === 'source'      ? sources :
            pickerTarget === 'destination' ? destinations :
                                             services
          }
          onConfirm={handlePickerConfirm}
          onClose={() => setPickerTarget(null)}
        />
      )}
    </form>
  );
}
