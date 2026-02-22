import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PolicyInstallStatus } from '../../types/security';

interface SecurityState {
  ruleModalOpen: boolean;
  selectedRuleId: string | null;
  saving: boolean;
  error: string | null;
  policyInstall: PolicyInstallStatus;
}

const initialState: SecurityState = {
  ruleModalOpen: false,
  selectedRuleId: null,
  saving: false,
  error: null,
  policyInstall: { status: 'idle' },
};

export const securitySlice = createSlice({
  name: 'security',
  initialState,
  reducers: {
    openAddRule(state) {
      state.selectedRuleId = null;
      state.ruleModalOpen = true;
      state.error = null;
    },
    openEditRule(state, action: PayloadAction<string>) {
      state.selectedRuleId = action.payload;
      state.ruleModalOpen = true;
      state.error = null;
    },
    closeRuleModal(state) {
      state.ruleModalOpen = false;
      state.selectedRuleId = null;
    },
    saveRuleStart(state) {
      state.saving = true;
      state.error = null;
    },
    saveRuleSuccess(state) {
      state.saving = false;
      state.ruleModalOpen = false;
      state.selectedRuleId = null;
    },
    saveRuleFailure(state, action: PayloadAction<string>) {
      state.saving = false;
      state.error = action.payload;
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
  openAddRule, openEditRule, closeRuleModal,
  saveRuleStart, saveRuleSuccess, saveRuleFailure,
  installPolicyStart, installPolicyProgress, installPolicySuccess, installPolicyFailure,
} = securitySlice.actions;
export const securityReducer = securitySlice.reducer;
