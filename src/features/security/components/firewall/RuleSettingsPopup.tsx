import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  anchor:   DOMRect;
  enabled:  boolean;
  comment:  string;
  onChange: (patch: { enabled?: boolean; comment?: string }) => void;
  onClose:  () => void;
}

const POPUP_WIDTH  = 320;
const POPUP_HEIGHT = 280;

export function RuleSettingsPopup({ anchor, enabled, comment, onChange, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown',   onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown',   onKeyDown);
    };
  }, [onClose]);

  // Position below anchor, flip up if near bottom
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let top  = anchor.bottom + 6;
  let left = anchor.left;
  if (top  + POPUP_HEIGHT > vh - 16) top  = anchor.top - POPUP_HEIGHT - 6;
  if (top  < 8)                      top  = 8;
  if (left + POPUP_WIDTH  > vw - 16) left = vw - POPUP_WIDTH - 16;
  if (left < 8)                      left = 8;

  return createPortal(
    <div className="rule-settings-popup" style={{ top, left }} ref={ref} role="dialog" aria-label="Rule settings">

      {/* Header */}
      <div className="rule-settings-popup-hdr">
        <span>Rule Settings</span>
        <button className="rule-settings-close" type="button" onClick={onClose} aria-label="Close">✕</button>
      </div>

      <div className="rule-settings-popup-body">

        {/* Enabled */}
        <label className="rule-settings-row">
          <input
            type="checkbox"
            checked={enabled}
            onChange={e => onChange({ enabled: e.target.checked })}
          />
          <span>Rule enabled</span>
        </label>

        {/* Comment */}
        <div className="rule-settings-field">
          <label className="rule-settings-label">Comment</label>
          <textarea
            className="rule-settings-textarea"
            rows={2}
            value={comment}
            placeholder="Write a comment…"
            onChange={e => onChange({ comment: e.target.value })}
          />
        </div>

        {/* Time range — UI chrome only */}
        <div className="rule-settings-field">
          <label className="rule-settings-label rule-settings-label--optional">
            <input type="checkbox" disabled />
            <span>Apply only during this time:</span>
          </label>
          <div className="rule-settings-row rule-settings-row--inputs">
            <input className="rule-settings-input rule-settings-input--time" disabled placeholder="09:00 AM" />
            <span className="rule-settings-sep">›</span>
            <input className="rule-settings-input rule-settings-input--time" disabled placeholder="05:00 PM" />
          </div>
        </div>

        {/* Download bandwidth — UI chrome only */}
        <div className="rule-settings-field">
          <label className="rule-settings-label rule-settings-label--optional">
            <input type="checkbox" disabled />
            <span>Limit download traffic to:</span>
          </label>
          <div className="rule-settings-row rule-settings-row--inputs">
            <input className="rule-settings-input rule-settings-input--bw" disabled placeholder="1000" />
            <span className="rule-settings-unit">Kbps</span>
          </div>
        </div>

        {/* Upload bandwidth — UI chrome only */}
        <div className="rule-settings-field">
          <label className="rule-settings-label rule-settings-label--optional">
            <input type="checkbox" disabled />
            <span>Limit upload traffic to:</span>
          </label>
          <div className="rule-settings-row rule-settings-row--inputs">
            <input className="rule-settings-input rule-settings-input--bw" disabled placeholder="100" />
            <span className="rule-settings-unit">Kbps</span>
          </div>
        </div>

      </div>
    </div>,
    document.body,
  );
}
