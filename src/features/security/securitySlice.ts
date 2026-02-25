import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PolicyInstallStatus } from '../../types/security';
import type { GatewayFwRule } from '../../types/gateway';

interface SecurityState {
  ruleModalOpen: boolean;
  selectedRuleId: string | null;
  /** Which row the user last clicked (for Above/Below position targeting) */
  focusedRuleId: string | null;
  /** Position chosen from the New dropdown */
  newRulePosition: 'top' | 'bottom' | 'above' | 'below' | null;
  /** Raw gateway defaults from fwRule.newInstance — null when using MSW */
  newRuleGatewayDefaults: GatewayFwRule | null;
  saving: boolean;
  error: string | null;
  /** Set after a successful create or update — consumed by RuleTable to trigger row highlight. */
  lastSavedRuleId: string | null;
  policyInstall: PolicyInstallStatus;
}

const initialState: SecurityState = {
  ruleModalOpen: false,
  selectedRuleId: null,
  focusedRuleId: null,
  newRulePosition: null,
  newRuleGatewayDefaults: null,
  saving: false,
  error: null,
  lastSavedRuleId: null,
  policyInstall: { status: 'idle' },
};

export const securitySlice = createSlice({
  name: 'security',
  initialState,
  reducers: {
    openAddRule(state) {
      state.selectedRuleId = null;
      state.newRulePosition = null;
      state.newRuleGatewayDefaults = null;
      state.ruleModalOpen = true;
      state.error = null;
    },
    openEditRule(state, action: PayloadAction<string>) {
      state.selectedRuleId = action.payload;
      state.ruleModalOpen = true;
      state.error = null;
    },
    /** Dispatched by the saga after fetching newInstance defaults */
    openAddRuleWithDefaults(
      state,
      action: PayloadAction<{
        position: 'top' | 'bottom' | 'above' | 'below';
        defaults: GatewayFwRule | null;
      }>,
    ) {
      state.selectedRuleId = null;
      state.newRulePosition = action.payload.position;
      state.newRuleGatewayDefaults = action.payload.defaults;
      state.ruleModalOpen = true;
      state.error = null;
    },
    closeRuleModal(state) {
      state.ruleModalOpen = false;
      state.selectedRuleId = null;
      state.newRulePosition = null;
      state.newRuleGatewayDefaults = null;
    },
    /** Track which row is "selected" for Above/Below positioning */
    setFocusedRule(state, action: PayloadAction<string | null>) {
      state.focusedRuleId = action.payload;
    },
    saveRuleStart(state) {
      state.saving = true;
      state.error = null;
      state.lastSavedRuleId = null; // reset so repeated saves of same rule re-trigger the highlight
    },
    saveRuleSuccess(state) {
      state.saving = false;
      state.ruleModalOpen = false;
      state.selectedRuleId = null;
      state.newRulePosition = null;
      state.newRuleGatewayDefaults = null;
    },
    saveRuleFailure(state, action: PayloadAction<string>) {
      state.saving = false;
      state.error = action.payload;
    },
    setSavedRuleId(state, action: PayloadAction<string>) {
      state.lastSavedRuleId = action.payload;
    },
    clearSavedRuleId(state) {
      state.lastSavedRuleId = null;
    },
    installPolicyStart(state) {
      state.policyInstall = { status: 'installing', progress: 0 };
    },
    installPolicyProgress(state, action: PayloadAction<number>) {
      state.policyInstall = { status: 'installing', progress: action.payload };
    },
    installPolicySuccess(state) {
      state.policyInstall = { status: 'success' };
    },
    installPolicyFailure(state, action: PayloadAction<string>) {
      state.policyInstall = { status: 'error', message: action.payload };
    },
  },
});

export const {
  openAddRule, openEditRule, openAddRuleWithDefaults, closeRuleModal,
  setFocusedRule,
  saveRuleStart, saveRuleSuccess, saveRuleFailure,
  setSavedRuleId, clearSavedRuleId,
  installPolicyStart, installPolicyProgress, installPolicySuccess, installPolicyFailure,
} = securitySlice.actions;
export const securityReducer = securitySlice.reducer;
