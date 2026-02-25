import { useState, useRef, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowLeftRight,
  Globe,
  Layers,
  Network,
  Server,
  ShieldCheck,
} from 'lucide-react';
import type { NetworkMember } from '../../types/security';

export interface ChipTooltip {
  description?: string;
  tags?: string[];
  /** Human-readable object type (e.g. "Network object group"). */
  type?: string;
  /** Member objects for group tooltips — rendered as mini chips. */
  members?: NetworkMember[];
}

interface TooltipPos { top: number; left: number; }

interface ChipProps {
  /** Icon element rendered to the left of the label (e.g. <img>, lucide icon). */
  icon?: ReactNode;
  label: string;
  className?: string;
  /** When provided, shows a hover card with metadata. */
  tooltip?: ChipTooltip;
}

/** Maps a gateway `_icon` / `type` string to a small lucide icon. */
function networkMemberIcon(iconKey?: string): ReactNode {
  if (!iconKey) return <Globe size={12} />;
  if (iconKey === 'networkObjectsGroup')      return <Layers size={12} />;
  if (iconKey.includes('SINGLE_IP'))          return <Server size={12} />;
  if (iconKey.includes('NETWORK') || iconKey.includes('SUBNET')) return <Network size={12} />;
  if (iconKey.includes('RANGE'))              return <ArrowLeftRight size={12} />;
  if (iconKey.includes('DOMAIN') || iconKey.includes('FQDN')) return <Globe size={12} />;
  if (iconKey.includes('ZONE'))               return <ShieldCheck size={12} />;
  return <Globe size={12} />;
}

/**
 * Small pill with an optional leading icon + text label.
 * Pass `tooltip` to show a hover card with metadata on hover.
 *
 * Usage:
 *   <Chip label="Box" icon={<img src="..." alt="" />} />
 *   <Chip label="DNS" tooltip={{ description: "...", tags: ["UDP"] }} />
 *   <Chip label="my_group" icon={<Layers size={14}/>} tooltip={{ type: "Network object group", members: [...] }} />
 */
export function Chip({ icon, label, className, tooltip }: ChipProps) {
  const chipRef  = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pos, setPos] = useState<TooltipPos | null>(null);

  // Show tooltip whenever the prop is provided — even header-only (icon + name)
  const hasTooltip = !!tooltip;

  const handleMouseEnter = useCallback(() => {
    if (!hasTooltip) return;
    timerRef.current = setTimeout(() => {
      if (!chipRef.current) return;
      const r = chipRef.current.getBoundingClientRect();
      const left = Math.min(r.left, window.innerWidth - 376);
      setPos({ top: r.bottom + 6, left });
    }, 320);
  }, [hasTooltip]);

  const handleMouseLeave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPos(null);
  }, []);

  return (
    <>
      <span
        ref={chipRef}
        className={['chip', className].filter(Boolean).join(' ')}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {icon && <span className="chip-icon">{icon}</span>}
        <span className="chip-label">{label}</span>
      </span>

      {hasTooltip && pos && createPortal(
        <div
          className="chip-tooltip"
          style={{ top: pos.top, left: pos.left }}
          role="tooltip"
        >
          {/* Header: icon + name */}
          <div className="chip-tooltip-header">
            {icon && <span className="chip-tooltip-icon">{icon}</span>}
            <span className="chip-tooltip-title">{label}</span>
          </div>

          {tooltip!.type && (
            <div className="chip-tooltip-row">
              <span className="chip-tooltip-key">Type:</span>
              <span className="chip-tooltip-val">{tooltip!.type}</span>
            </div>
          )}

          {tooltip!.description && (
            <div className="chip-tooltip-row">
              <span className="chip-tooltip-key">Description:</span>
              <span className="chip-tooltip-val">{tooltip!.description}</span>
            </div>
          )}

          {(tooltip!.tags?.length ?? 0) > 0 && (
            <div className="chip-tooltip-row">
              <span className="chip-tooltip-key">Tags:</span>
              <span className="chip-tooltip-val">{tooltip!.tags!.join(', ')}</span>
            </div>
          )}

          {(tooltip!.members?.length ?? 0) > 0 && (
            <div className="chip-tooltip-row chip-tooltip-row--members">
              <span className="chip-tooltip-key">Network Objects:</span>
              <span className="chip-tooltip-val chip-tooltip-members">
                {tooltip!.members!.map((m, i) => (
                  <span key={i} className="chip chip--mini">
                    <span className="chip-icon">{networkMemberIcon(m.iconKey)}</span>
                    <span className="chip-label">{m.name}</span>
                  </span>
                ))}
              </span>
            </div>
          )}
        </div>,
        document.body,
      )}
    </>
  );
}
