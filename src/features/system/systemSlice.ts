import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UpdateStatus } from '../../types/system';

interface SystemState {
  adminModalOpen: boolean;
  updateStatus: UpdateStatus;
  saving: boolean;
  error: string | null;
}

const initialState: SystemState = {
  adminModalOpen: false,
  updateStatus: { checking: false, downloading: false, installing: false },
  saving: false,
  error: null,
};

export const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    openAddAdmin(state) { state.adminModalOpen = true; },
    closeAdminModal(state) { state.adminModalOpen = false; },
    saveAdminStart(state) { state.saving = true; state.error = null; },
    saveAdminSuccess(state) { state.saving = false; state.adminModalOpen = false; },
    saveAdminFailure(state, action: PayloadAction<string>) { state.saving = false; state.error = action.payload; },
    setUpdateStatus(state, action: PayloadAction<Partial<UpdateStatus>>) {
      state.updateStatus = { ...state.updateStatus, ...action.payload };
    },
  },
});

export const {
  openAddAdmin, closeAdminModal,
  saveAdminStart, saveAdminSuccess, saveAdminFailure,
  setUpdateStatus,
} = systemSlice.actions;
export const systemReducer = systemSlice.reducer;
