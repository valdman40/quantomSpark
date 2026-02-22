import { createSlice } from '@reduxjs/toolkit';
import type { NotificationSeverity } from '../../../types/home';

interface NotificationsState {
  severityFilter: NotificationSeverity | 'all';
  clearing: boolean;
}

const initialState: NotificationsState = {
  severityFilter: 'all',
  clearing: false,
};

export const notificationsSlice = createSlice({
  name: 'homeNotifications',
  initialState,
  reducers: {
    setSeverityFilter(state, action: { payload: NotificationsState['severityFilter'] }) {
      state.severityFilter = action.payload;
    },
    setClearing(state, action: { payload: boolean }) {
      state.clearing = action.payload;
    },
  },
});

export const { setSeverityFilter, setClearing } = notificationsSlice.actions;
export const notificationsReducer = notificationsSlice.reducer;
