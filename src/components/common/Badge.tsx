type Variant = 'success' | 'error' | 'warning' | 'info' | 'neutral';

interface BadgeProps {
  variant?: Variant;
  children: React.ReactNode;
  dot?: boolean;
}

export function Badge({ variant = 'neutral', children, dot }: BadgeProps) {
  return (
    <span className={`badge badge-${variant}`}>
      {dot && <span className={`dot dot-${variantToDot(variant)}`} />}
      {children}
    </span>
  );
}

function variantToDot(v: Variant) {
  const map: Record<Variant, string> = {
    success: 'green', error: 'red', warning: 'yellow', info: 'blue', neutral: 'blue',
  };
  return map[v];
}
