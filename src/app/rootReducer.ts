import { combineReducers } from '@reduxjs/toolkit';
import { uiReducer }        from './uiSlice';
import { dashboardReducer } from '../features/dashboard/dashboardSlice';
import { networkReducer }   from '../features/network/networkSlice';
import { securityReducer }  from '../features/security/securitySlice';
import { vpnReducer }       from '../features/vpn/vpnSlice';
import { logsReducer }      from '../features/logs/logsSlice';
import { systemReducer }    from '../features/system/systemSlice';

export const rootReducer = combineReducers({
  ui:        uiReducer,
  dashboard: dashboardReducer,
  network:   networkReducer,
  security:  securityReducer,
  vpn:       vpnReducer,
  logs:      logsReducer,
  system:    systemReducer,
});
