import { takeLatest, put, call } from 'redux-saga/effects';
import { setClearing } from './notificationsSlice';
import { addNotification } from '../../../app/uiSlice';
import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { queryClient } from '../../../app/queryClient';
import { queryKeys } from '../../../services/queryKeys';

function* clearAllNotificationsSaga() {
  yield put(setClearing(true));
  try {
    yield call([apiClient, 'post'], ENDPOINTS.home.notificationsClear, {});
    yield queryClient.invalidateQueries({ queryKey: queryKeys.home.notifications() });
    yield put(addNotification({ type: 'info', message: 'All notifications cleared' }));
  } catch {
    yield put(addNotification({ type: 'error', message: 'Failed to clear notifications' }));
  } finally {
    yield put(setClearing(false));
  }
}

export function* notificationsSaga() {
  yield takeLatest('homeNotifications/clearAll', clearAllNotificationsSaga);
}
