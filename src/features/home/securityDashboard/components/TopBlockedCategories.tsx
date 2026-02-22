import type { BlockedCategory } from '../../../../types/home';
import { Card } from '../../../../components/common/Card';

interface Props { categories: BlockedCategory[] }

export function TopBlockedCategories({ categories }: Props) {
  const max = Math.max(...categories.map(c => c.count), 1);

  return (
    <Card title="Top Blocked Categories">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {categories.map(c => (
          <div key={c.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, fontSize: '0.78rem' }}>
              <span>{c.name}</span>
              <span style={{ fontWeight: 600 }}>{c.count.toLocaleString()}</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: 'var(--border)', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${Math.round((c.count / max) * 100)}%`,
                  background: c.color,
                  borderRadius: 4,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
