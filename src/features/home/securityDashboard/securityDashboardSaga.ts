import { takeLatest, put, call } from 'redux-saga/effects';
import { setInstalling, toggleBlade } from './securityDashboardSlice';
import { addNotification } from '../../../app/uiSlice';
import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { queryClient } from '../../../app/queryClient';
import { queryKeys } from '../../../services/queryKeys';

function* installPolicySaga() {
  yield put(setInstalling(true));
  try {
    yield call([apiClient, 'post'], ENDPOINTS.security.installPolicy, {});
    yield queryClient.invalidateQueries({ queryKey: queryKeys.home.securityDashboard() });
    yield put(addNotification({ type: 'success', message: 'Policy installed successfully' }));
  } catch {
    yield put(addNotification({ type: 'error', message: 'Policy installation failed' }));
  } finally {
    yield put(setInstalling(false));
  }
}

function* refreshSecurityDashboardSaga() {
  yield queryClient.invalidateQueries({ queryKey: queryKeys.home.securityDashboard() });
  yield put(addNotification({ type: 'info', message: 'Security dashboard refreshed' }));
}

function* toggleBladeSaga(action: { type: string; payload: string }) {
  // Optimistic update already applied by the reducer via dispatch in component.
  // Fire the POST to keep mock backend in sync.
  try {
    yield call([apiClient, 'post'], ENDPOINTS.home.toggleBlade(action.payload), {});
    yield queryClient.invalidateQueries({ queryKey: queryKeys.home.bladeCategories() });
  } catch {
    // Revert optimistic update on failure
    yield put(toggleBlade(action.payload));
    yield put(addNotification({ type: 'error', message: 'Failed to toggle blade' }));
  }
}

export function* securityDashboardSaga() {
  yield takeLatest('securityDashboard/installPolicy', installPolicySaga);
  yield takeLatest('securityDashboard/refresh', refreshSecurityDashboardSaga);
  yield takeLatest('securityDashboard/toggleBlade', toggleBladeSaga);
}
