import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Badge } from '../../../../components/common/Badge';
import { Chip } from '../../../../components/common/Chip';
import type { FirewallRule } from '../../../../types/security';
import { networkIcon, serviceIcon } from './ruleIcons';

interface Props {
  rule: FirewallRule;
  onEdit:   (id: string) => void;
  onFocus?: (id: string) => void;
  focused?:  boolean;
  highlight?: boolean;
  /** When true the row is rendered inside DragOverlay (no sensors, no ref) */
  overlay?: boolean;
  /** Visual legality indicator — only meaningful when overlay=true */
  dragVariant?: 'legal' | 'illegal';
}

function actionVariant(action: string) {
  if (action === 'Accept' || action === 'Encrypt') return 'success' as const;
  if (action === 'Drop'   || action === 'Reject')  return 'error'   as const;
  return 'neutral' as const;
}


export function DraggableRuleRow({ rule, onEdit, onFocus, focused = false, highlight = false, overlay = false, dragVariant }: Props) {
  const isDraggable = rule.origin === 'RULE_ORIGIN.MANUAL';

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: rule.id, disabled: !isDraggable });

  const style = overlay
    ? undefined                          // overlay clone — no transform needed
    : {
        transform: CSS.Transform.toString(transform),
        transition,
      };

  function handleRowClick(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest('button, .drag-handle')) return;
    onFocus?.(rule.id);
  }

  function handleRowDoubleClick(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest('button, .drag-handle')) return;
    if (isDraggable) onEdit(rule.id);
  }

  return (
    <tr
      ref={overlay ? undefined : setNodeRef}
      style={{ ...style, opacity: rule.enabled ? 1 : 0.5 }}
      className={[
        isDragging          ? 'rule-row-dragging'  : '',
        overlay             ? 'rule-row-overlay'   : '',
        overlay && dragVariant === 'legal'   ? 'rule-row-drag-legal'   : '',
        overlay && dragVariant === 'illegal' ? 'rule-row-drag-illegal' : '',
        focused && !overlay ? 'rule-row--selected' : '',
        highlight && !overlay ? 'fw-rule--highlight' : '',
      ].filter(Boolean).join(' ') || undefined}
      onClick={overlay ? undefined : handleRowClick}
      onDoubleClick={overlay ? undefined : handleRowDoubleClick}
      {...(overlay ? {} : attributes)}
    >
      {/* ── Drag handle (only for MANUAL rules) ── */}
      <td style={{ width: 32, padding: '0 4px 0 10px' }}>
        {isDraggable && (
          <span
            className="drag-handle"
            {...(overlay ? {} : listeners)}
            title="Drag to reorder"
            aria-label="Reorder rule"
          >
            <GripIcon />
          </span>
        )}
      </td>

      {/* ── Rule # ── */}
      <td className="rule-num" style={{ width: 36 }}>{rule.number}</td>

      {/* ── Name ── */}
      <td style={{ fontWeight: 500 }}>{rule.name}</td>

      {/* ── Source ── */}
      <td>
        <div className="svc-list">
          {rule.source.map((item, i) =>
            item.name === 'Any' ? (
              <span key={i} className="text-muted">Any</span>
            ) : (
              <Chip
                key={i}
                label={item.name}
                icon={networkIcon(item.iconKey)}
                tooltip={{ type: item.type, description: item.description, members: item.members }}
              />
            )
          )}
        </div>
      </td>

      {/* ── Destination ── */}
      <td>
        <div className="svc-list">
          {rule.destination.map((item, i) =>
            item.name === 'Any' ? (
              <span key={i} className="text-muted">Any</span>
            ) : (
              <Chip
                key={i}
                label={item.name}
                icon={networkIcon(item.iconKey)}
                tooltip={{ type: item.type, description: item.description, members: item.members }}
              />
            )
          )}
        </div>
      </td>

      {/* ── Service ── */}
      <td>
        <div className="svc-list">
          {rule.service.map((svc, i) =>
            svc.name === 'Any' ? (
              <span key={i} className="text-muted">Any</span>
            ) : (
              <Chip
                key={i}
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
            )
          )}
        </div>
      </td>

      {/* ── Action ── */}
      <td><Badge variant={actionVariant(rule.action)}>{rule.action}</Badge></td>

      {/* ── Track ── */}
      <td><span className="text-muted text-sm">{rule.track}</span></td>

      {/* ── Enabled ── */}
      <td>
        <Badge variant={rule.enabled ? 'success' : 'neutral'}>
          {rule.enabled ? 'Enabled' : 'Disabled'}
        </Badge>
      </td>

      {/* ── Comment ── */}
      <td><span className="text-muted text-sm">{rule.comment ?? ''}</span></td>
    </tr>
  );
}

/** Six-dot grip icon (standard drag-handle idiom) */
function GripIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      <circle cx="4" cy="3"  r="1.2" /><circle cx="10" cy="3"  r="1.2" />
      <circle cx="4" cy="7"  r="1.2" /><circle cx="10" cy="7"  r="1.2" />
      <circle cx="4" cy="11" r="1.2" /><circle cx="10" cy="11" r="1.2" />
    </svg>
  );
}
