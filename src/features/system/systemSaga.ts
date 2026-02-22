import { takeLatest, call, put } from 'redux-saga/effects';
import {
  saveAdminStart, saveAdminSuccess, saveAdminFailure, setUpdateStatus,
} from './systemSlice';
import { addNotification } from '../../app/uiSlice';
import { queryClient } from '../../app/queryClient';
import { queryKeys } from '../../services/queryKeys';
import { apiClient } from '../../services/api/client';
import { ENDPOINTS } from '../../services/api/endpoints';
import type { Administrator } from '../../types/system';

function* saveAdminSaga(action: { type: string; payload: Partial<Administrator> }) {
  yield put(saveAdminStart());
  try {
    yield call([apiClient, 'post'], ENDPOINTS.system.admins, action.payload);
    yield call([queryClient, 'invalidateQueries'], { queryKey: queryKeys.system.admins() });
    yield put(saveAdminSuccess());
    yield put(addNotification({ type: 'success', message: 'Administrator created' }));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to create administrator';
    yield put(saveAdminFailure(msg));
    yield put(addNotification({ type: 'error', message: msg }));
  }
}

function* deleteAdminSaga(action: { type: string; payload: string }) {
  try {
    yield call([apiClient, 'delete'], ENDPOINTS.system.admin(action.payload));
    yield call([queryClient, 'invalidateQueries'], { queryKey: queryKeys.system.admins() });
    yield put(addNotification({ type: 'success', message: 'Administrator removed' }));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to remove administrator';
    yield put(addNotification({ type: 'error', message: msg }));
  }
}

/** Check for available update — sets UI state, React Query handles the version data. */
function* checkUpdateSaga() {
  yield put(setUpdateStatus({ checking: true }));
  try {
    yield call([apiClient, 'post'], ENDPOINTS.system.checkUpdate, {});
    yield call([queryClient, 'invalidateQueries'], { queryKey: queryKeys.system.version() });
    yield put(addNotification({ type: 'info', message: 'Update check complete' }));
  } catch (err) {
    yield put(addNotification({ type: 'error', message: 'Update check failed' }));
  } finally {
    yield put(setUpdateStatus({ checking: false }));
  }
}

function* installUpdateSaga() {
  yield put(setUpdateStatus({ downloading: true }));
  try {
    yield call([apiClient, 'post'], ENDPOINTS.system.installUpdate, {});
    yield put(setUpdateStatus({ downloading: false, installing: false }));
    yield call([queryClient, 'invalidateQueries'], { queryKey: queryKeys.system.version() });
    yield put(addNotification({ type: 'success', message: 'Update installed — reboot required' }));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Update failed';
    yield put(setUpdateStatus({ downloading: false, installing: false, error: msg }));
    yield put(addNotification({ type: 'error', message: msg }));
  }
}

export function* systemSaga() {
  yield takeLatest('system/saveAdmin', saveAdminSaga);
  yield takeLatest('system/deleteAdmin', deleteAdminSaga);
  yield takeLatest('system/checkUpdate', checkUpdateSaga);
  yield takeLatest('system/installUpdate', installUpdateSaga);
}
