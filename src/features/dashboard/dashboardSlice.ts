import { createSlice } from '@reduxjs/toolkit';

interface DashboardState {
  lastRefresh: string | null;
}

const initialState: DashboardState = {
  lastRefresh: null,
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    markRefreshed(state) {
      state.lastRefresh = new Date().toISOString();
    },
  },
});

export const { markRefreshed } = dashboardSlice.actions;
export const dashboardReducer = dashboardSlice.reducer;
