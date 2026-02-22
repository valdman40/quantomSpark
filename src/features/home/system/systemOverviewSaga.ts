import { takeLatest, put } from 'redux-saga/effects';
import { markRefreshed } from './systemOverviewSlice';
import { addNotification } from '../../../app/uiSlice';
import { queryClient } from '../../../app/queryClient';
import { queryKeys } from '../../../services/queryKeys';

function* refreshSystemOverviewSaga() {
  yield queryClient.invalidateQueries({ queryKey: queryKeys.home.systemOverview() });
  yield put(markRefreshed());
  yield put(addNotification({ type: 'info', message: 'System overview refreshed' }));
}

export function* systemOverviewSaga() {
  yield takeLatest('systemOverview/refresh', refreshSystemOverviewSaga);
}
