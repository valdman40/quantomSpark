import { useQuery } from '@tanstack/react-query';
import { apiClient }  from '../../../services/api/client';
import { ENDPOINTS }  from '../../../services/api/endpoints';
import { queryKeys }  from '../../../services/queryKeys';
import type { ApiResponse } from '../../../types/api';
import type { DashboardData } from '../../../types/dashboard';

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard.summary(),
    queryFn: () =>
      apiClient.get<ApiResponse<DashboardData>>(ENDPOINTS.dashboard.summary)
        .then(r => r.data),
  });
}
