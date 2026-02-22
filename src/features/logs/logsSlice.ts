import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { LogFilters } from '../../types/logs';

const defaultFilters: LogFilters = {
  timeRange: '24h',
  searchText: '',
};

interface LogsState {
  filters: LogFilters;
  activeTab: 'security' | 'traffic' | 'events';
}

const initialState: LogsState = {
  filters: defaultFilters,
  activeTab: 'security',
};

export const logsSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<LogFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters(state) {
      state.filters = defaultFilters;
    },
    setActiveTab(state, action: PayloadAction<LogsState['activeTab']>) {
      state.activeTab = action.payload;
    },
  },
});

export const { setFilters, resetFilters, setActiveTab } = logsSlice.actions;
export const logsReducer = logsSlice.reducer;
