import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { queryKeys } from '../../../services/queryKeys';
import type { ApiResponse } from '../../../types/api';
import type { StaticRoute } from '../../../types/network';

export function useRoutes() {
  return useQuery({
    queryKey: queryKeys.network.routes(),
    queryFn: () =>
      apiClient.get<ApiResponse<StaticRoute[]>>(ENDPOINTS.network.routes)
        .then(r => r.data),
  });
}
