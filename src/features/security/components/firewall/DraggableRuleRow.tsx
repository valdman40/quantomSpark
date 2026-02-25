import { type ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ArrowLeftRight,
  Globe,
  Layers,
  Lock,
  Network,
  Server,
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '../../../../components/common/Badge';
import { Button } from '../../../../components/common/Button';
import { Chip } from '../../../../components/common/Chip';
import type { FirewallRule } from '../../../../types/security';

interface Props {
  rule: FirewallRule;
  onEdit:    (id: string) => void;
  onDelete:  (id: string) => void;
  onFocus?:  (id: string) => void;
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

/** Maps a service name to a lucide icon — used as fallback when no appId CDN icon is available. */
function serviceIcon(name: string): ReactNode {
  const n = name.toLowerCase();
  if (n.includes('http') || n.includes('web'))                       return <Globe size={14} />;
  if (n.includes('dns'))                                             return <Server size={14} />;
  if (n.includes('ssh') || n.includes('sftp') || n.includes('tls')) return <Lock size={14} />;
  if (n.includes('ftp'))                                             return <ArrowLeftRight size={14} />;
  if (n.includes('rdp') || n.includes('smb') || n.includes('smtp')) return <Network size={14} />;
  if (n.includes('torrent') || n.includes('donkey'))                 return <ArrowLeftRight size={14} />;
  if (n.includes('vpn') || n.includes('ike') || n.includes('esp'))  return <ShieldCheck size={14} />;
  return <Network size={14} />;
}

/** Maps a gateway `_icon` / `__tblName` / `type` string to a lucide icon (size 14). */
function networkIcon(iconKey?: string): ReactNode {
  if (!iconKey) return <Globe size={14} />;
  if (iconKey === 'networkObjectsGroup')      return <Layers size={14} />;
  if (iconKey.includes('SINGLE_IP'))          return <Server size={14} />;
  if (iconKey.includes('NETWORK') || iconKey.includes('SUBNET')) return <Network size={14} />;
  if (iconKey.includes('RANGE'))              return <ArrowLeftRight size={14} />;
  if (iconKey.includes('DOMAIN') || iconKey.includes('FQDN')) return <Globe size={14} />;
  if (iconKey.includes('ZONE'))               return <ShieldCheck size={14} />;
  return <Globe size={14} />;
}

export function DraggableRuleRow({ rule, onEdit, onDelete, onFocus, focused = false, highlight = false, overlay = false, dragVariant }: Props) {
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

  function handleRowClick(e: React.MouseEvent) {
    // Don't steal clicks on buttons or the drag handle
    if ((e.target as HTMLElement).closest('button, .drag-handle')) return;
    onFocus?.(rule.id);
  }

  return (
    <tr
      ref={overlay ? undefined : setNodeRef}
      style={style}
      className={[
        isDragging          ? 'rule-row-dragging'  : '',
        overlay             ? 'rule-row-overlay'   : '',
        overlay && dragVariant === 'legal'   ? 'rule-row-drag-legal'   : '',
        overlay && dragVariant === 'illegal' ? 'rule-row-drag-illegal' : '',
        focused && !overlay ? 'rule-row--selected' : '',
        highlight && !overlay ? 'fw-rule--highlight' : '',
      ].filter(Boolean).join(' ') || undefined}
      onClick={overlay ? undefined : handleRowClick}
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
