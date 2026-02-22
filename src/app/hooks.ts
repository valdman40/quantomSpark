import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/** Type-safe dispatch — use everywhere instead of raw useDispatch */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/** Type-safe selector shorthand */
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector);
