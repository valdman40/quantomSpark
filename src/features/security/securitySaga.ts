import { takeLatest, call, put, delay } from 'redux-saga/effects';
import {
  saveRuleStart, saveRuleSuccess, saveRuleFailure,
  installPolicyStart, installPolicyProgress, installPolicySuccess, installPolicyFailure,
} from './securitySlice';
import { addNotification } from '../../app/uiSlice';
import { queryClient } from '../../app/queryClient';
import { queryKeys } from '../../services/queryKeys';
import { apiClient } from '../../services/api/client';
import { ENDPOINTS } from '../../services/api/endpoints';
import type { FirewallRule } from '../../types/security';

interface SaveRuleAction {
  type: string;
  payload: { data: Partial<FirewallRule>; id?: string };
}

function* saveRuleSaga(action: SaveRuleAction) {
  yield put(saveRuleStart());
  try {
    const { data, id } = action.payload;
    if (id) {
      yield call([apiClient, 'put'], ENDPOINTS.security.rule(id), data);
    } else {
      yield call([apiClient, 'post'], ENDPOINTS.security.rules, data);
    }
    yield call([queryClient, 'invalidateQueries'], { queryKey: queryKeys.security.rules() });
    yield put(saveRuleSuccess());
    yield put(addNotification({ type: 'success', message: `Rule ${id ? 'updated' : 'created'}. Remember to install the policy.` }));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to save rule';
    yield put(saveRuleFailure(msg));
    yield put(addNotification({ type: 'error', message: msg }));
  }
}

function* deleteRuleSaga(action: { type: string; payload: string }) {
  try {
    yield call([apiClient, 'delete'], ENDPOINTS.security.rule(action.payload));
    yield call([queryClient, 'invalidateQueries'], { queryKey: queryKeys.security.rules() });
    yield put(addNotification({ type: 'success', message: 'Rule deleted. Remember to install the policy.' }));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to delete rule';
    yield put(addNotification({ type: 'error', message: msg }));
  }
}

/**
 * Simulates a multi-step policy install flow — a hallmark of Check Point UI.
 * Progress ticks: compile → verify → push → done
 */
function* installPolicySaga() {
  yield put(installPolicyStart());
  try {
    yield put(installPolicyProgress(25));
    yield delay(400);
    yield put(installPolicyProgress(50));
    yield delay(400);
    yield put(installPolicyProgress(80));
    yield call([apiClient, 'post'], ENDPOINTS.security.installPolicy, {});
    yield put(installPolicyProgress(100));
    yield delay(200);
    yield put(installPolicySuccess());
    yield put(addNotification({ type: 'success', message: 'Policy installed successfully' }));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Policy installation failed';
    yield put(installPolicyFailure(msg));
    yield put(addNotification({ type: 'error', message: msg }));
  }
}

/**
 * Persist a reordered rule list.
 * The component already applied an optimistic update via queryClient.setQueryData —
 * this saga only syncs to the server and rolls back on failure.
 */
function* reorderRulesSaga(action: { type: string; payload: { ruleIds: string[] } }) {
  try {
    yield call([apiClient, 'patch'], ENDPOINTS.security.reorderRules, {
      ruleIds: action.payload.ruleIds,
    });
    // Server accepted the new order — no need to invalidate (cache already optimistic)
  } catch (err) {
    // Roll back: invalidate so React Query re-fetches the authoritative server order
    yield call([queryClient, 'invalidateQueries'], { queryKey: queryKeys.security.rules() });
    const msg = err instanceof Error ? err.message : 'Failed to save rule order';
    yield put(addNotification({ type: 'error', message: msg }));
  }
}

export function* securitySaga() {
  yield takeLatest('security/saveRule', saveRuleSaga);
  yield takeLatest('security/deleteRule', deleteRuleSaga);
  yield takeLatest('security/installPolicy', installPolicySaga);
  // takeLatest cancels any in-flight reorder when a new drag completes
  yield takeLatest('security/reorderRules', reorderRulesSaga);
}
