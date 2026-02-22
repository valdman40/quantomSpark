import { takeLatest, call, put } from 'redux-saga/effects';
import {
  saveTunnelStart, saveTunnelSuccess, saveTunnelFailure,
  connectStart, connectEnd,
} from './vpnSlice';
import { addNotification } from '../../app/uiSlice';
import { queryClient } from '../../app/queryClient';
import { queryKeys } from '../../services/queryKeys';
import { apiClient } from '../../services/api/client';
import { ENDPOINTS } from '../../services/api/endpoints';
import type { VpnTunnel } from '../../types/vpn';

interface SaveTunnelAction {
  type: string;
  payload: Partial<VpnTunnel>;
}

function* saveTunnelSaga(action: SaveTunnelAction) {
  yield put(saveTunnelStart());
  try {
    yield call([apiClient, 'post'], ENDPOINTS.vpn.tunnels, action.payload);
    yield call([queryClient, 'invalidateQueries'], { queryKey: queryKeys.vpn.tunnels() });
    yield put(saveTunnelSuccess());
    yield put(addNotification({ type: 'success', message: 'VPN tunnel created' }));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to create tunnel';
    yield put(saveTunnelFailure(msg));
    yield put(addNotification({ type: 'error', message: msg }));
  }
}

function* connectTunnelSaga(action: { type: string; payload: string }) {
  yield put(connectStart(action.payload));
  try {
    yield call([apiClient, 'post'], ENDPOINTS.vpn.tunnelConnect(action.payload), {});
    yield call([queryClient, 'invalidateQueries'], { queryKey: queryKeys.vpn.tunnels() });
    yield put(addNotification({ type: 'success', message: 'VPN tunnel connected' }));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to connect tunnel';
    yield put(addNotification({ type: 'error', message: msg }));
  } finally {
    yield put(connectEnd());
  }
}

function* disconnectTunnelSaga(action: { type: string; payload: string }) {
  yield put(connectStart(action.payload));
  try {
    yield call([apiClient, 'post'], ENDPOINTS.vpn.tunnelDisconnect(action.payload), {});
    yield call([queryClient, 'invalidateQueries'], { queryKey: queryKeys.vpn.tunnels() });
    yield put(addNotification({ type: 'info', message: 'VPN tunnel disconnected' }));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to disconnect tunnel';
    yield put(addNotification({ type: 'error', message: msg }));
  } finally {
    yield put(connectEnd());
  }
}

export function* vpnSaga() {
  yield takeLatest('vpn/saveTunnel', saveTunnelSaga);
  yield takeLatest('vpn/connectTunnel', connectTunnelSaga);
  yield takeLatest('vpn/disconnectTunnel', disconnectTunnelSaga);
}
