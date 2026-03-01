import { useState, type Dispatch, type SetStateAction } from 'react';
import { Settings } from 'lucide-react';
import { Badge } from '../../../../components/common/Badge';
import { Chip } from '../../../../components/common/Chip';
import { ObjectPicker } from './ObjectPicker';
import { RuleSettingsPopup } from './RuleSettingsPopup';
import { networkIcon, serviceIcon } from './ruleIcons';
import type { FirewallRule, NetworkItem, ServiceItem } from '../../../../types/security';

type PickerTarget = 'source' | 'destination' | 'service' | null;

interface Props {
  rule:     FirewallRule;
  saving:   boolean;
  onSave:   (payload: Partial<FirewallRule>) => void;
  onCancel: () => void;
}

// ── Chip list renderer ─────────────────────────────────────────────────────

function NetworkChips({
  items, setItems,
}: {
  items: NetworkItem[];
  setItems: Dispatch<SetStateAction<NetworkItem[]>>;
}) {
  const nonAny = items.filter(it => it.name !== 'Any');
  if (nonAny.length === 0) return <span className="text-muted" style={{ fontSize: '0.82rem' }}>Any</span>;
  return (
    <>
      {nonAny.map((item, i) => (
        <Chip
          key={`${i}-${item.name}`}
          label={item.name}
          icon={networkIcon(item.iconKey)}
          tooltip={{ type: item.type, description: item.description, members: item.members }}
          onRemove={() => setItems(prev => prev.filter((_, j) => j !== i))}
        />
      ))}
    </>
  );
}

function ServiceChips({
  items, setItems,
}: {
  items: ServiceItem[];
  setItems: Dispatch<SetStateAction<ServiceItem[]>>;
}) {
  const nonAny = items.filter(it => it.name !== 'Any');
  if (nonAny.length === 0) return <span className="text-muted" style={{ fontSize: '0.82rem' }}>Any</span>;
  return (
    <>
      {nonAny.map((svc, i) => (
        <Chip
          key={`${i}-${svc.name}`}
          label={svc.name}
          icon={svc.appId != null ? (
            <img
              src={`https://sc1.checkpoint.com/za/images/facetime/small_png/${svc.appId}_sml.png`}
              alt=""
              onError={e => { e.currentTarget.style.display = 'none'; }}
            />
          ) : serviceIcon(svc.name)}
          tooltip={{ description: svc.description, tags: svc.tags }}
          onRemove={() => setItems(prev => prev.filter((_, j) => j !== i))}
        />
      ))}
    </>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export function InlineRuleRow({ rule, saving, onSave, onCancel }: Props) {
  // ── Editable field state ──────────────────────────────────────────────────
  const [name,   setName]   = useState(rule.name);
  const [action, setAction] = useState(rule.action);
  const [track,  setTrack]  = useState(rule.track);

  const [sources,      setSources]      = useState<NetworkItem[]>(rule.source      ?? []);
  const [destinations, setDestinations] = useState<NetworkItem[]>(rule.destination ?? []);
  const [services,     setServices]     = useState<ServiceItem[]>(rule.service     ?? []);

  // ── Settings popup state ──────────────────────────────────────────────────
  const [enabled,       setEnabled]       = useState(rule.enabled ?? true);
  const [comment,       setComment]       = useState(rule.comment ?? '');
  const [settingsOpen,  setSettingsOpen]  = useState(false);
  const [settingsAnchor, setSettingsAnchor] = useState<DOMRect | null>(null);

  function openSettings(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    setSettingsAnchor(e.currentTarget.getBoundingClientRect());
    setSettingsOpen(true);
  }

  // ── Object picker state ───────────────────────────────────────────────────
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

  // ── Save ──────────────────────────────────────────────────────────────────
  function handleSave() {
    onSave({
      id:          rule.id,
      name,
      source:      sources.length      ? sources      : [{ name: 'Any' }],
      destination: destinations.length ? destinations : [{ name: 'Any' }],
      service:     services.length     ? services     : [{ name: 'Any' }],
      action,
      track,
      enabled,
      comment:     comment || undefined,
      zone:        rule.zone,
      origin:      rule.origin,
      idx:         rule.idx,
      installedOn: rule.installedOn,
    });
  }

  return (
    <>
      <tr className="inline-edit-row" onClick={e => e.stopPropagation()}>

        {/* ── Save / Cancel ── */}
        <td style={{ padding: '0 4px' }}>
          <div className="inline-edit-actions">
            <button
              type="button"
              className="inline-edit-save-btn"
              title="Save rule"
              disabled={saving}
              onClick={handleSave}
            >
              {saving ? '…' : '✓'}
            </button>
            <button
              type="button"
              className="inline-edit-cancel-btn"
              title="Cancel"
              disabled={saving}
              onClick={onCancel}
            >
              ✕
            </button>
          </div>
        </td>

        {/* ── Priority ── */}
        <td className="rule-num" style={{ width: 36 }}>{rule.number}</td>

        {/* ── Name + Settings gear ── */}
        <td>
          <div className="inline-name-cell">
            <input
              className="rule-form-input"
              style={{ width: 120 }}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Rule name"
              onClick={e => e.stopPropagation()}
            />
            <button
              type="button"
              className="inline-settings-btn"
              title="Rule settings (enabled, comment, time, bandwidth)"
              onClick={openSettings}
            >
              <Settings size={13} />
            </button>
          </div>
        </td>

        {/* ── Source ── */}
        <td>
          <div className="rule-form-chip-list">
            <NetworkChips items={sources} setItems={setSources} />
          </div>
          <button type="button" className="rule-form-add-btn" onClick={e => openPicker('source', e)}>＋</button>
        </td>

        {/* ── Destination ── */}
        <td>
          <div className="rule-form-chip-list">
            <NetworkChips items={destinations} setItems={setDestinations} />
          </div>
          <button type="button" className="rule-form-add-btn" onClick={e => openPicker('destination', e)}>＋</button>
        </td>

        {/* ── Service ── */}
        <td>
          <div className="rule-form-chip-list">
            <ServiceChips items={services} setItems={setServices} />
          </div>
          <button type="button" className="rule-form-add-btn" onClick={e => openPicker('service', e)}>＋</button>
        </td>

        {/* ── Action ── */}
        <td>
          <select
            className="rule-form-select"
            value={action}
            onChange={e => setAction(e.target.value as FirewallRule['action'])}
            onClick={e => e.stopPropagation()}
          >
            <option value="Accept">Accept</option>
            <option value="Drop">Drop</option>
            <option value="Reject">Reject</option>
            <option value="Encrypt">Encrypt</option>
          </select>
        </td>

        {/* ── Track ── */}
        <td>
          <select
            className="rule-form-select"
            value={track}
            onChange={e => setTrack(e.target.value as FirewallRule['track'])}
            onClick={e => e.stopPropagation()}
          >
            <option value="None">None</option>
            <option value="Log">Log</option>
            <option value="Alert">Alert</option>
            <option value="Mail">Mail</option>
          </select>
        </td>

        {/* ── Status (live from local enabled state) ── */}
        <td>
          <Badge variant={enabled ? 'success' : 'neutral'}>
            {enabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </td>

        {/* ── Comment preview ── */}
        <td>
          <span className="text-muted text-sm" style={{ maxWidth: 120, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {comment || '—'}
          </span>
        </td>

      </tr>

      {/* ObjectPicker portal */}
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

      {/* Settings popup portal */}
      {settingsOpen && settingsAnchor && (
        <RuleSettingsPopup
          anchor={settingsAnchor}
          enabled={enabled}
          comment={comment}
          onChange={patch => {
            if (patch.enabled  !== undefined) setEnabled(patch.enabled);
            if (patch.comment  !== undefined) setComment(patch.comment);
          }}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </>
  );
}
