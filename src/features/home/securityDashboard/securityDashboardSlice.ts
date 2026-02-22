import { createSlice } from '@reduxjs/toolkit';

interface SecurityDashboardState {
  installing: boolean;
  bladeStates: Record<string, boolean>;
}

const initialState: SecurityDashboardState = {
  installing: false,
  bladeStates: {},
};

export const securityDashboardSlice = createSlice({
  name: 'securityDashboard',
  initialState,
  reducers: {
    setInstalling(state, action: { payload: boolean }) {
      state.installing = action.payload;
    },
    initBladeStates(state, action: { payload: Record<string, boolean> }) {
      state.bladeStates = action.payload;
    },
    toggleBlade(state, action: { payload: string }) {
      const id = action.payload;
      state.bladeStates[id] = !state.bladeStates[id];
    },
  },
});

export const { setInstalling, initBladeStates, toggleBlade } = securityDashboardSlice.actions;
export const securityDashboardReducer = securityDashboardSlice.reducer;
