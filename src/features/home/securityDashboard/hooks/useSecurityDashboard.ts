import { useQuery } from '@tanstack/react-query';
import { apiClient }  from '../../../../services/api/client';
import { ENDPOINTS }  from '../../../../services/api/endpoints';
import { queryKeys }  from '../../../../services/queryKeys';
import type { ApiResponse } from '../../../../types/api';
import type { SecurityDashboardData } from '../../../../types/home';

export function useSecurityDashboard() {
  return useQuery({
    queryKey: queryKeys.home.securityDashboard(),
    queryFn: () =>
      apiClient.get<ApiResponse<SecurityDashboardData>>(ENDPOINTS.home.securityDashboard)
        .then(r => r.data),
  });
}
