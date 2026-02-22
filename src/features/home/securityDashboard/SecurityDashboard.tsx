import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { initBladeStates, toggleBlade } from './securityDashboardSlice';
import { useBladeCategories } from './hooks/useBladeCategories';
import { BladeCard } from './components/BladeCard';
import type { BladeCategory } from '../../../types/home';

export function SecurityDashboard() {
  const dispatch = useAppDispatch();
  const bladeStates = useAppSelector(s => s.securityDashboard.bladeStates);
  const { data: categories, isLoading, error } = useBladeCategories();

  // Seed Redux blade states from server data once on load
  useEffect(() => {
    if (!categories) return;
    const map: Record<string, boolean> = {};
    for (const cat of categories as BladeCategory[]) {
      for (const b of cat.blades) {
        if (!(b.id in bladeStates)) {
          map[b.id] = b.enabled;
        }
      }
    }
    if (Object.keys(map).length > 0) {
      dispatch(initBladeStates({ ...bladeStates, ...map }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  const handleToggle = (bladeId: string) => {
    dispatch(toggleBlade(bladeId));
    dispatch({ type: 'securityDashboard/toggleBlade', payload: bladeId });
  };

  if (isLoading) {
    return <div className="loading-box"><span className="spinner" /><span>Loading security dashboard…</span></div>;
  }
  if (error || !categories) {
    return <div className="empty">Failed to load security dashboard.</div>;
  }

  return (
    <div>
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="blade-grid">
          {(categories as BladeCategory[]).map(cat => (
            <div key={cat.id} className="blade-col">
              <div className="blade-col-header">{cat.name}</div>
              {cat.blades.map(blade => (
                <BladeCard
                  key={blade.id}
                  blade={blade}
                  enabled={bladeStates[blade.id] ?? blade.enabled}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
