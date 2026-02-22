import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface VpnState {
  tunnelModalOpen: boolean;
  selectedTunnelId: string | null;
  connectingTunnelId: string | null;
  saving: boolean;
  error: string | null;
}

const initialState: VpnState = {
  tunnelModalOpen: false,
  selectedTunnelId: null,
  connectingTunnelId: null,
  saving: false,
  error: null,
};

export const vpnSlice = createSlice({
  name: 'vpn',
  initialState,
  reducers: {
    openAddTunnel(state) {
      state.selectedTunnelId = null;
      state.tunnelModalOpen = true;
    },
    closeTunnelModal(state) {
      state.tunnelModalOpen = false;
      state.selectedTunnelId = null;
    },
    saveTunnelStart(state) { state.saving = true; state.error = null; },
    saveTunnelSuccess(state) { state.saving = false; state.tunnelModalOpen = false; },
    saveTunnelFailure(state, action: PayloadAction<string>) { state.saving = false; state.error = action.payload; },
    connectStart(state, action: PayloadAction<string>) { state.connectingTunnelId = action.payload; },
    connectEnd(state) { state.connectingTunnelId = null; },
  },
});

export const {
  openAddTunnel, closeTunnelModal,
  saveTunnelStart, saveTunnelSuccess, saveTunnelFailure,
  connectStart, connectEnd,
} = vpnSlice.actions;
export const vpnReducer = vpnSlice.reducer;
