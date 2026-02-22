import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface NetworkState {
  selectedInterfaceId: string | null;
  interfaceModalOpen: boolean;
  saving: boolean;
  error: string | null;
}

const initialState: NetworkState = {
  selectedInterfaceId: null,
  interfaceModalOpen: false,
  saving: false,
  error: null,
};

export const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    openAddInterface(state) {
      state.selectedInterfaceId = null;
      state.interfaceModalOpen = true;
      state.error = null;
    },
    openEditInterface(state, action: PayloadAction<string>) {
      state.selectedInterfaceId = action.payload;
      state.interfaceModalOpen = true;
      state.error = null;
    },
    closeInterfaceModal(state) {
      state.interfaceModalOpen = false;
      state.selectedInterfaceId = null;
    },
    saveInterfaceStart(state) {
      state.saving = true;
      state.error = null;
    },
    saveInterfaceSuccess(state) {
      state.saving = false;
      state.interfaceModalOpen = false;
      state.selectedInterfaceId = null;
    },
    saveInterfaceFailure(state, action: PayloadAction<string>) {
      state.saving = false;
      state.error = action.payload;
    },
  },
});

export const {
  openAddInterface, openEditInterface, closeInterfaceModal,
  saveInterfaceStart, saveInterfaceSuccess, saveInterfaceFailure,
} = networkSlice.actions;
export const networkReducer = networkSlice.reducer;
