import { useState } from 'react';
import type { AlertItem } from '../../../../types/home';

interface Props {
  items: AlertItem[];
}

export function AlertBanner({ items }: Props) {
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || items.length === 0) return null;

  const current = items[index];

  return (
    <div className="alert-banner">
      <span className="alert-banner-dot" />
      <span style={{ fontWeight: 600, flexShrink: 0 }}>
        {index + 1} of {items.length}
      </span>
      <span
        style={{ cursor: 'pointer', color: '#c8102e', flexShrink: 0 }}
        onClick={() => setIndex(i => (i + 1) % items.length)}
      >
        &rsaquo;
      </span>
      <span style={{ flex: 1 }}>{current.message}</span>
      {current.actionLabel && (
        <a
          href={current.actionPath ?? '#'}
          style={{ color: '#c8102e', fontWeight: 600, flexShrink: 0 }}
        >
          {current.actionLabel}
        </a>
      )}
      <button
        className="btn btn-ghost btn-sm"
        style={{ flexShrink: 0, marginLeft: 4 }}
        onClick={() => setDismissed(true)}
      >
        Dismiss
      </button>
    </div>
  );
}
