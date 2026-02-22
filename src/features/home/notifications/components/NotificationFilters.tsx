import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { setSeverityFilter } from '../notificationsSlice';
import type { NotificationSeverity } from '../../../../types/home';

type Filter = NotificationSeverity | 'all';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all',     label: 'All'     },
  { key: 'info',    label: 'Info'    },
  { key: 'warning', label: 'Warning' },
  { key: 'error',   label: 'Error'   },
];

export function NotificationFilters() {
  const dispatch = useAppDispatch();
  const active   = useAppSelector(s => s.homeNotifications.severityFilter);

  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
      {FILTERS.map(f => (
        <button
          key={f.key}
          onClick={() => dispatch(setSeverityFilter(f.key))}
          style={{
            padding: '4px 14px',
            borderRadius: 20,
            border: '1px solid',
            borderColor: active === f.key ? 'var(--brand)' : 'var(--border)',
            background: active === f.key ? 'var(--brand)' : 'transparent',
            color: active === f.key ? '#fff' : 'var(--text)',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: active === f.key ? 600 : 400,
          }}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
