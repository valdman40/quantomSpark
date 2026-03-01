import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { queryKeys } from '../../../services/queryKeys';
import type { ApiResponse } from '../../../types/api';
import type { ServiceItem } from '../../../types/security';

export function useServices() {
  return useQuery({
    queryKey: queryKeys.security.services(),
    queryFn: async (): Promise<ServiceItem[]> => {
      const resp = await apiClient.get<ApiResponse<ServiceItem[]>>(ENDPOINTS.security.services);
      return (resp as ApiResponse<ServiceItem[]>).data;
    },
    staleTime: 60_000,
  });
}
