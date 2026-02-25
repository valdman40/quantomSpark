import { useState, useRef, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export interface ChipTooltip {
  description?: string;
  tags?: string[];
}

interface TooltipPos { top: number; left: number; }

interface ChipProps {
  /** Icon element rendered to the left of the label (e.g. <img>, lucide icon). */
  icon?: ReactNode;
  label: string;
  className?: string;
  /** When provided, shows a hover card with description and tag metadata. */
  tooltip?: ChipTooltip;
}

/**
 * Small pill with an optional leading icon + text label.
 * Pass `tooltip` to show a hover card with description and tags.
 *
 * Usage:
 *   <Chip label="Box" icon={<img src="..." alt="" />} />
 *   <Chip label="DNS" tooltip={{ description: "...", tags: ["UDP", "Port 53"] }} />
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
      // Clamp left so tooltip doesn't overflow the right edge of the viewport
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
          <div className="chip-tooltip-header">
            {icon && <span className="chip-tooltip-icon">{icon}</span>}
            <span className="chip-tooltip-title">{label}</span>
          </div>

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
        </div>,
        document.body,
      )}
    </>
  );
}
