import { useQuery } from '@tanstack/react-query';
import { apiClient }  from '../../../../services/api/client';
import { ENDPOINTS }  from '../../../../services/api/endpoints';
import { queryKeys }  from '../../../../services/queryKeys';
import type { ApiResponse } from '../../../../types/api';
import type { SystemNotification } from '../../../../types/home';

export function useNotifications() {
  return useQuery({
    queryKey: queryKeys.home.notifications(),
    queryFn: () =>
      apiClient.get<ApiResponse<SystemNotification[]>>(ENDPOINTS.home.notifications)
        .then(r => r.data),
  });
}
