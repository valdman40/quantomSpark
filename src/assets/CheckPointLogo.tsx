interface Props {
  /** 'light' = white text for dark backgrounds; 'dark' = dark text for light backgrounds */
  variant?: 'light' | 'dark';
  /** Height in px of the logo mark */
  size?: number;
}

/**
 * Check Point brand logo — inline SVG, no external dependency.
 * Red circle with white checkmark + "CHECK POINT" wordmark.
 */
export function CheckPointLogo({ variant = 'light', size = 22 }: Props) {
  const textColor = variant === 'light' ? '#ffffff' : '#1e293b';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, userSelect: 'none' }}>
      {/* Red circle with white checkmark */}
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#c8102e" />
        <polyline
          points="8,16 13,21 24,11"
          stroke="#ffffff"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {/* Wordmark */}
      <span style={{
        color: textColor,
        fontSize: '0.68rem',
        fontWeight: 700,
        letterSpacing: '0.06em',
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}>
        CHECK POINT
      </span>
    </div>
  );
}
