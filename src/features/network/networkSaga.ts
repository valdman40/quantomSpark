import { takeLatest, call, put } from 'redux-saga/effects';
import {
  saveInterfaceStart, saveInterfaceSuccess, saveInterfaceFailure,
} from './networkSlice';
import { addNotification } from '../../app/uiSlice';
import { queryClient } from '../../app/queryClient';
import { queryKeys } from '../../services/queryKeys';
import { apiClient } from '../../services/api/client';
import { ENDPOINTS } from '../../services/api/endpoints';
import type { NetworkInterface } from '../../types/network';

interface SaveInterfaceAction {
  type: string;
  payload: { data: Partial<NetworkInterface>; id?: string };
}

function* saveInterfaceSaga(action: SaveInterfaceAction) {
  yield put(saveInterfaceStart());
  try {
    const { data, id } = action.payload;
    if (id) {
      yield call([apiClient, 'put'], ENDPOINTS.network.interface(id), data);
    } else {
      yield call([apiClient, 'post'], ENDPOINTS.network.interfaces, data);
    }
    yield call([queryClient, 'invalidateQueries'], { queryKey: queryKeys.network.interfaces() });
    yield put(saveInterfaceSuccess());
    yield put(addNotification({ type: 'success', message: `Interface ${id ? 'updated' : 'created'} successfully` }));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to save interface';
    yield put(saveInterfaceFailure(msg));
    yield put(addNotification({ type: 'error', message: msg }));
  }
}

function* deleteInterfaceSaga(action: { type: string; payload: string }) {
  try {
    yield call([apiClient, 'delete'], ENDPOINTS.network.interface(action.payload));
    yield call([queryClient, 'invalidateQueries'], { queryKey: queryKeys.network.interfaces() });
    yield put(addNotification({ type: 'success', message: 'Interface deleted' }));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to delete interface';
    yield put(addNotification({ type: 'error', message: msg }));
  }
}

function* saveDnsSaga(action: { type: string; payload: unknown }) {
  try {
    yield call([apiClient, 'put'], ENDPOINTS.network.dns, action.payload);
    yield call([queryClient, 'invalidateQueries'], { queryKey: queryKeys.network.dns() });
    yield put(addNotification({ type: 'success', message: 'DNS settings saved' }));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to save DNS settings';
    yield put(addNotification({ type: 'error', message: msg }));
  }
}

export function* networkSaga() {
  yield takeLatest('network/saveInterface', saveInterfaceSaga);
  yield takeLatest('network/deleteInterface', deleteInterfaceSaga);
  yield takeLatest('network/saveDns', saveDnsSaga);
}
