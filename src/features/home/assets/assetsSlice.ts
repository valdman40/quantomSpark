import { createSlice } from '@reduxjs/toolkit';
import type { AssetType } from '../../../types/home';

interface AssetsState {
  typeFilter: AssetType | 'all';
  expandedId: string | null;
}

const initialState: AssetsState = {
  typeFilter: 'all',
  expandedId: null,
};

export const assetsSlice = createSlice({
  name: 'homeAssets',
  initialState,
  reducers: {
    setTypeFilter(state, action: { payload: AssetsState['typeFilter'] }) {
      state.typeFilter = action.payload;
    },
    toggleExpanded(state, action: { payload: string }) {
      state.expandedId = state.expandedId === action.payload ? null : action.payload;
    },
  },
});

export const { setTypeFilter, toggleExpanded } = assetsSlice.actions;
export const assetsReducer = assetsSlice.reducer;
