import { takeLatest, put } from 'redux-saga/effects';
import { markRefreshed } from './dashboardSlice';
import { addNotification } from '../../app/uiSlice';
import { queryClient } from '../../app/queryClient';
import { queryKeys } from '../../services/queryKeys';

/** Triggered when user clicks "Refresh" on the dashboard. */
function* refreshDashboardSaga() {
  // Invalidate the React Query cache — useQuery will re-fetch automatically
  yield queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.summary() });
  yield put(markRefreshed());
  yield put(addNotification({ type: 'info', message: 'Dashboard data refreshed' }));
}

export function* dashboardSaga() {
  yield takeLatest('dashboard/refresh', refreshDashboardSaga);
}
