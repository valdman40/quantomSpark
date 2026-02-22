import { combineReducers } from '@reduxjs/toolkit';
import { uiReducer }                from './uiSlice';
import { systemOverviewReducer }    from '../features/home/system/systemOverviewSlice';
import { securityDashboardReducer } from '../features/home/securityDashboard/securityDashboardSlice';
import { notificationsReducer }     from '../features/home/notifications/notificationsSlice';
import { assetsReducer }            from '../features/home/assets/assetsSlice';
import { networkReducer }           from '../features/network/networkSlice';
import { securityReducer }          from '../features/security/securitySlice';
import { vpnReducer }               from '../features/vpn/vpnSlice';
import { logsReducer }              from '../features/logs/logsSlice';
import { systemReducer }            from '../features/system/systemSlice';

export const rootReducer = combineReducers({
  ui:                 uiReducer,
  systemOverview:     systemOverviewReducer,
  securityDashboard:  securityDashboardReducer,
  homeNotifications:  notificationsReducer,
  homeAssets:         assetsReducer,
  network:            networkReducer,
  security:           securityReducer,
  vpn:                vpnReducer,
  logs:               logsReducer,
  system:             systemReducer,
});
