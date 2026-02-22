import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Badge } from '../../../../components/common/Badge';
import { Button } from '../../../../components/common/Button';
import type { FirewallRule } from '../../../../types/security';

interface Props {
  rule: FirewallRule;
  onEdit:   (id: string) => void;
  onDelete: (id: string) => void;
  /** When true the row is rendered inside DragOverlay (no sensors, no ref) */
  overlay?: boolean;
}

function actionVariant(action: string) {
  if (action === 'Accept' || action === 'Encrypt') return 'success' as const;
  if (action === 'Drop'   || action === 'Reject')  return 'error'   as const;
  return 'neutral' as const;
}

export function DraggableRuleRow({ rule, onEdit, onDelete, overlay = false }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: rule.id });

  const style = overlay
    ? undefined                          // overlay clone — no transform needed
    : {
        transform: CSS.Transform.toString(transform),
        transition,
      };

  return (
    <tr
      ref={overlay ? undefined : setNodeRef}
      style={style}
      className={isDragging ? 'rule-row-dragging' : overlay ? 'rule-row-overlay' : undefined}
      {...(overlay ? {} : attributes)}
    >
      {/* ── Drag handle ── */}
      <td style={{ width: 32, padding: '0 4px 0 10px' }}>
        <span
          className="drag-handle"
          {...(overlay ? {} : listeners)}
          title="Drag to reorder"
          aria-label="Reorder rule"
        >
          <GripIcon />
        </span>
      </td>

      {/* ── Rule # ── */}
      <td className="rule-num" style={{ width: 36 }}>{rule.number}</td>

      {/* ── Name ── */}
      <td style={{ fontWeight: 500, opacity: rule.enabled ? 1 : 0.5 }}>{rule.name}</td>

      {/* ── Match columns ── */}
      <td className="mono">{rule.source.join(', ')}</td>
      <td className="mono">{rule.destination.join(', ')}</td>
      <td className="mono">{rule.service.join(', ')}</td>

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

      {/* ── Row actions ── */}
      <td>
        {!overlay && (
          <div className="actions">
            <Button size="sm" variant="ghost" onClick={() => onEdit(rule.id)}>Edit</Button>
            <Button size="sm" variant="ghost" onClick={() => onDelete(rule.id)}>Del</Button>
          </div>
        )}
      </td>
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
