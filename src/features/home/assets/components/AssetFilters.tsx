import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { setTypeFilter } from '../assetsSlice';
import type { AssetType } from '../../../../types/home';

type Filter = AssetType | 'all';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all',     label: 'All'     },
  { key: 'PC',      label: 'PC'      },
  { key: 'mobile',  label: 'Mobile'  },
  { key: 'IoT',     label: 'IoT'     },
  { key: 'server',  label: 'Server'  },
  { key: 'printer', label: 'Printer' },
  { key: 'unknown', label: 'Unknown' },
];

export function AssetFilters() {
  const dispatch = useAppDispatch();
  const active   = useAppSelector(s => s.homeAssets.typeFilter);

  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
      {FILTERS.map(f => (
        <button
          key={f.key}
          onClick={() => dispatch(setTypeFilter(f.key))}
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
