import type { BladeState, BladeStatus } from '../../../../types/home';
import { Card } from '../../../../components/common/Card';

interface Props { blades: BladeState[] }

function statusStyle(s: BladeStatus): { background: string; color: string } {
  if (s === 'on')     return { background: '#dcfce7', color: '#15803d' };
  if (s === 'bypass') return { background: '#fef3c7', color: '#b45309' };
  return                     { background: '#f1f5f9', color: '#64748b' };
}

export function BladeStatusRow({ blades }: Props) {
  return (
    <Card title="Blade Status">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {blades.map(b => {
          const st = statusStyle(b.status);
          return (
            <div
              key={b.name}
              style={{
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: '0.75rem',
                fontWeight: 600,
                ...st,
              }}
            >
              {b.name}{' '}
              <span style={{ fontWeight: 400, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                {b.status}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
