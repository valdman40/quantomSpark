type Color = 'green' | 'red' | 'yellow' | 'blue';

interface StatusDotProps {
  color: Color;
  label?: string;
}

export function StatusDot({ color, label }: StatusDotProps) {
  return (
    <span className="flex items-center gap-1" style={{ fontSize: '0.8rem' }}>
      <span className={`dot dot-${color}`} />
      {label}
    </span>
  );
}
