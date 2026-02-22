import { all, fork } from 'redux-saga/effects';
import { dashboardSaga } from '../features/dashboard/dashboardSaga';
import { networkSaga }   from '../features/network/networkSaga';
import { securitySaga }  from '../features/security/securitySaga';
import { vpnSaga }       from '../features/vpn/vpnSaga';
import { logsSaga }      from '../features/logs/logsSaga';
import { systemSaga }    from '../features/system/systemSaga';

export function* rootSaga() {
  yield all([
    fork(dashboardSaga),
    fork(networkSaga),
    fork(securitySaga),
    fork(vpnSaga),
    fork(logsSaga),
    fork(systemSaga),
  ]);
}
