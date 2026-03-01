import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { queryKeys } from '../../../services/queryKeys';
import type { ApiResponse } from '../../../types/api';
import type { NetworkItem } from '../../../types/security';

export function useNetworkObjects() {
  return useQuery({
    queryKey: queryKeys.security.networkObjects(),
    queryFn: async (): Promise<NetworkItem[]> => {
      const resp = await apiClient.get<ApiResponse<NetworkItem[]>>(ENDPOINTS.security.networkObjects);
      return (resp as ApiResponse<NetworkItem[]>).data;
    },
    staleTime: 60_000,
  });
}
