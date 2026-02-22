import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface UIState {
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  notifications: Notification[];
}

const initialState: UIState = {
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  notifications: [],
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    toggleMobileSidebar(state) {
      state.mobileSidebarOpen = !state.mobileSidebarOpen;
    },
    closeMobileSidebar(state) {
      state.mobileSidebarOpen = false;
    },
    addNotification(state, action: PayloadAction<Omit<Notification, 'id'>>) {
      state.notifications.push({ id: crypto.randomUUID(), ...action.payload });
    },
    removeNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
  },
});

export const {
  toggleSidebar,
  toggleMobileSidebar,
  closeMobileSidebar,
  addNotification,
  removeNotification,
} = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
