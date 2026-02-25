import { takeLatest, call, put, select, delay } from 'redux-saga/effects';
import {
  saveRuleStart, saveRuleSuccess, saveRuleFailure,
  openAddRuleWithDefaults,
  setSavedRuleId,
  installPolicyStart, installPolicyProgress, installPolicySuccess, installPolicyFailure,
} from './securitySlice';
import { addNotification } from '../../app/uiSlice';
import { queryClient } from '../../app/queryClient';
import { queryKeys } from '../../services/queryKeys';
import { apiClient } from '../../services/api/client';
import { ENDPOINTS } from '../../services/api/endpoints';
import { gatewayClient } from '../../services/api/gatewayClient';
import { USE_REAL_API } from '../../config';
import { normalizeFirewallRules, insertRule, replaceRule } from '../../services/api/normalizers/firewallNormalizer';
import type { FirewallRule, RuleAction, TrackOption } from '../../types/security';
import type { GatewayFwRule } from '../../types/gateway';
import type { RootState } from '../../app/store';

// ─── Reverse action/track maps for denormalization ───────────────────────────

const ACTION_REVERSE: Record<RuleAction, string> = {
  Accept:  'ACTION.ACCEPT',
  Drop:    'ACTION.BLOCK',
  Reject:  'ACTION.REJECT',
  Encrypt: 'ACTION.ACCEPT',
};

const TRACK_REVERSE: Record<TrackOption, string> = {
  None:  'LOG_LEVEL.NONE',
  Log:   'LOG_LEVEL.LOG',
  Alert: 'LOG_LEVEL.ALERT',
  Mail:  'LOG_LEVEL.MAIL',
};

/**
 * Merges form data back into a gateway-shaped object.
 * Uses the stored newInstance defaults (or the existing rule) as the base so all
 * gateway-required fields are present, then overrides with the user's edits.
 */
function buildGatewayPayload(
  formData: Partial<FirewallRule>,
  defaults: GatewayFwRule | null,
): Record<string, unknown> {
  const base: Record<string, unknown> = defaults ? { ...defaults as unknown as Record<string, unknown> } : {};

  return {
    ...base,
    name:            formData.name ?? base.name ?? '',
    action:          ACTION_REVERSE[formData.action ?? 'Drop'] ?? 'ACTION.BLOCK',
    log:             TRACK_REVERSE[formData.track ?? 'None'] ?? 'LOG_LEVEL.NONE',
    disabled:        !(formData.enabled ?? true),
    comment:         formData.comment ?? [],
    zone:            (formData as Partial<FirewallRule>).zone   ?? (base.zone   as string | undefined) ?? 'ZONE.OUTGOING',
    origin:          (formData as Partial<FirewallRule>).origin ?? (base.origin as string | undefined) ?? 'RULE_ORIGIN.MANUAL',
    idx:             (formData as Partial<FirewallRule>).idx    ?? (base.idx    as number | undefined),
    // Sources / destinations / services kept as-is from defaults ([] = Any)
    // Object-picker support is future work.
    sources:         base.sources ?? [],
    destinations:    base.destinations ?? [],
    appsAndServices: base.appsAndServices ?? [],
  };
}

// ─── Sagas ───────────────────────────────────────────────────────────────────

interface OpenNewRuleAction {
  type: string;
  payload: {
    position: 'top' | 'bottom' | 'above' | 'below';
    focusedRuleId: string | null;
  };
}

/**
 * Triggered by the "New" dropdown. Fetches gateway defaults (real API) or opens
 * the form immediately with null defaults (MSW).
 */
function* openNewRuleSaga(action: OpenNewRuleAction) {
  const { position, focusedRuleId } = action.payload;
  try {
    let defaults: GatewayFwRule | null = null;
    if (USE_REAL_API) {
      const resp: Awaited<ReturnType<typeof gatewayClient.newInstance>> =
        yield call([gatewayClient, 'newInstance']);
      // Gateway may return data as a single object or a one-element array
      const rawData = resp.result.data as unknown;
      defaults = (Array.isArray(rawData) ? rawData[0] : rawData) as GatewayFwRule ?? null;

      // ── Compute idx / zone / origin for the new rule ──────────────────────
      const rules = queryClient.getQueryData<FirewallRule[]>(queryKeys.security.rules()) ?? [];

      const focusedRule = rules.find(r => r.id === focusedRuleId) ?? null;
      const targetZone   = focusedRule?.zone ?? rules[0]?.zone ?? 'ZONE.OUTGOING';
      // New rules are always user-created → always MANUAL regardless of focused row
      const targetOrigin = 'RULE_ORIGIN.MANUAL';

      const sectionRules = rules.filter(r => r.zone === targetZone && r.origin === targetOrigin);
      const sectionIdxs  = sectionRules.map(r => r.idx).filter((v): v is number => v != null);

      let targetIdx: number;
      const focusedSectionIdx = sectionRules.findIndex(r => r.id === focusedRuleId);

      if (position === 'top') {
        const min = sectionIdxs.length ? Math.min(...sectionIdxs) : 2;
        targetIdx = min / 2;
      } else if (position === 'bottom') {
        const max = sectionIdxs.length ? Math.max(...sectionIdxs) : 0;
        targetIdx = max + 1;
      } else if (position === 'above') {
        const fIdx = focusedRule?.idx ?? 1;
        const prevIdx = focusedSectionIdx > 0 ? (sectionRules[focusedSectionIdx - 1].idx ?? fIdx - 1) : 0;
        targetIdx = (prevIdx + fIdx) / 2;
      } else { // below
        const fIdx = focusedRule?.idx ?? 0;
        const nextIdx =
          focusedSectionIdx >= 0 && focusedSectionIdx < sectionRules.length - 1
            ? (sectionRules[focusedSectionIdx + 1].idx ?? fIdx + 2)
            : fIdx + 2;
        targetIdx = (fIdx + nextIdx) / 2;
      }

      if (defaults) {
        defaults = { ...defaults, idx: targetIdx, zone: targetZone, origin: targetOrigin };
      }
    }
    yield put(openAddRuleWithDefaults({ position, defaults }));
  } catch (err) {
    // If newInstance fails, open the form without defaults rather than blocking the user
    yield put(openAddRuleWithDefaults({ position, defaults: null }));
    const msg = err instanceof Error ? err.message : 'Could not fetch rule defaults';
    yield put(addNotification({ type: 'error', message: msg }));
  }
}

interface SaveRuleAction {
  type: string;
  payload: { data: Partial<FirewallRule>; id?: string };
}

function* saveRuleSaga(action: SaveRuleAction) {
  yield put(saveRuleStart());
  try {
    const { data, id } = action.payload;

    if (USE_REAL_API) {
      const gatewayDefaults: GatewayFwRule | null = yield select(
        (s: RootState) => s.security.newRuleGatewayDefaults,
      );
      const payload = buildGatewayPayload(data, gatewayDefaults);

      type FwRuleResp = Awaited<ReturnType<typeof gatewayClient.createRule>>;
      let resp: FwRuleResp;
      if (id) {
        payload.__pk = id;
        resp = yield call([gatewayClient, 'updateRule'], payload);
      } else {
        resp = yield call([gatewayClient, 'createRule'], payload);
      }

      // Patch the RQ cache directly — no refetch needed.
      const rawReturned = resp.result.data as unknown;
      const returnedRaw = (Array.isArray(rawReturned) ? rawReturned[0] : rawReturned) as GatewayFwRule | undefined;
      if (returnedRaw) {
        const [normalized] = normalizeFirewallRules([returnedRaw]);
        queryClient.setQueryData<FirewallRule[]>(queryKeys.security.rules(), old =>
          old
            ? (id ? replaceRule(old, normalized) : insertRule(old, normalized))
            : [{ ...normalized, number: 1 }],
        );
        yield put(setSavedRuleId(normalized.id));
      }
    } else {
      // MSW path — invalidate to pick up server-side changes
      if (id) {
        yield call([apiClient, 'put'], ENDPOINTS.security.rule(id), data);
      } else {
        yield call([apiClient, 'post'], ENDPOINTS.security.rules, data);
      }
      yield call([queryClient, 'invalidateQueries'], { queryKey: queryKeys.security.rules() });
    }
    yield put(saveRuleSuccess());
    yield put(addNotification({ type: 'success', message: `Rule ${id ? 'updated' : 'created'}. Remember to install the policy.` }));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to save rule';
    yield put(saveRuleFailure(msg));
    yield put(addNotification({ type: 'error', message: msg }));
  }
}

function* deleteRuleSaga(action: { type: string; payload: string }) {
  const id = action.payload;
  try {
    if (USE_REAL_API) {
      const rules = queryClient.getQueryData<FirewallRule[]>(queryKeys.security.rules()) ?? [];
      const rule  = rules.find(r => r.id === id);
      if (!rule?.tblName || !rule?.nativeId) throw new Error(`Cannot delete rule ${id}: missing tblName/nativeId`);
      yield call([gatewayClient, 'destroyRule'], rule.tblName, rule.nativeId);
      queryClient.setQueryData<FirewallRule[]>(queryKeys.security.rules(), old =>
        old ? old.filter(r => r.id !== id).map((r, i) => ({ ...r, number: i + 1 })) : old,
      );
    } else {
      yield call([apiClient, 'delete'], ENDPOINTS.security.rule(id));
      yield call([queryClient, 'invalidateQueries'], { queryKey: queryKeys.security.rules() });
    }
    yield put(addNotification({ type: 'success', message: 'Rule deleted. Remember to install the policy.' }));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to delete rule';
    yield put(addNotification({ type: 'error', message: msg }));
  }
}

/**
 * Simulates a multi-step policy install flow — a hallmark of Roy Point UI.
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
function* reorderRulesSaga(action: { type: string; payload: { ruleIds: string[]; movedRuleId: string; newIdx: number } }) {
  const { ruleIds, movedRuleId, newIdx } = action.payload;
  try {
    if (USE_REAL_API) {
      const rawRules = queryClient.getQueryData<GatewayFwRule[]>(queryKeys.security.rawRules()) ?? [];
      const normRules = queryClient.getQueryData<FirewallRule[]>(queryKeys.security.rules()) ?? [];
      const normRule  = normRules.find(r => r.id === movedRuleId);
      if (!normRule?.nativeId) {
        throw new Error(`Cannot reorder rule ${movedRuleId}: missing nativeId`);
      }
      const rawRule = rawRules.find(r => r.__id === normRule.nativeId);
      if (!rawRule) {
        throw new Error(`Cannot reorder rule ${movedRuleId}: raw gateway record not found`);
      }
      // Send the full original gateway object with only idx changed
      yield call([gatewayClient, 'updateRule'], { ...rawRule, idx: newIdx });
    } else {
      yield call([apiClient, 'patch'], ENDPOINTS.security.reorderRules, {
        ruleIds,
        movedRuleId,
        newIdx,
      });
    }
    // Server accepted the new order — no need to invalidate (cache already optimistic)
  } catch (err) {
    // Roll back: invalidate so React Query re-fetches the authoritative server order
    yield call([queryClient, 'invalidateQueries'], { queryKey: queryKeys.security.rules() });
    const msg = err instanceof Error ? err.message : 'Failed to save rule order';
    yield put(addNotification({ type: 'error', message: msg }));
  }
}

export function* securitySaga() {
  yield takeLatest('security/openNewRule',   openNewRuleSaga);
  yield takeLatest('security/saveRule',      saveRuleSaga);
  yield takeLatest('security/deleteRule',    deleteRuleSaga);
  yield takeLatest('security/installPolicy', installPolicySaga);
  // takeLatest cancels any in-flight reorder when a new drag completes
  yield takeLatest('security/reorderRules',  reorderRulesSaga);
}
