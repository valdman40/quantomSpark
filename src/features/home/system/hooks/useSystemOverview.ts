import { useQuery } from '@tanstack/react-query';
import { apiClient }  from '../../../../services/api/client';
import { ENDPOINTS }  from '../../../../services/api/endpoints';
import { queryKeys }  from '../../../../services/queryKeys';
import type { ApiResponse } from '../../../../types/api';
import type { SystemOverviewData } from '../../../../types/home';

export function useSystemOverview() {
  return useQuery({
    queryKey: queryKeys.home.systemOverview(),
    queryFn: () =>
      apiClient.get<ApiResponse<SystemOverviewData>>(ENDPOINTS.home.systemOverview)
        .then(r => r.data),
  });
}
