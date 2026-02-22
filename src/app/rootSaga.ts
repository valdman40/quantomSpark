import { all, fork } from 'redux-saga/effects';
import { systemOverviewSaga }    from '../features/home/system/systemOverviewSaga';
import { securityDashboardSaga } from '../features/home/securityDashboard/securityDashboardSaga';
import { notificationsSaga }     from '../features/home/notifications/notificationsSaga';
import { networkSaga }           from '../features/network/networkSaga';
import { securitySaga }          from '../features/security/securitySaga';
import { vpnSaga }               from '../features/vpn/vpnSaga';
import { logsSaga }              from '../features/logs/logsSaga';
import { systemSaga }            from '../features/system/systemSaga';

export function* rootSaga() {
  yield all([
    fork(systemOverviewSaga),
    fork(securityDashboardSaga),
    fork(notificationsSaga),
    fork(networkSaga),
    fork(securitySaga),
    fork(vpnSaga),
    fork(logsSaga),
    fork(systemSaga),
  ]);
}
