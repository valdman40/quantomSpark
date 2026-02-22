import { createSlice } from '@reduxjs/toolkit';

interface SystemOverviewState {
  lastRefresh: string | null;
}

const initialState: SystemOverviewState = {
  lastRefresh: null,
};

export const systemOverviewSlice = createSlice({
  name: 'systemOverview',
  initialState,
  reducers: {
    markRefreshed(state) {
      state.lastRefresh = new Date().toISOString();
    },
  },
});

export const { markRefreshed } = systemOverviewSlice.actions;
export const systemOverviewReducer = systemOverviewSlice.reducer;
