import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { queryKeys } from '../../../services/queryKeys';
import type { ApiResponse } from '../../../types/api';
import type { NetworkInterface } from '../../../types/network';

export function useInterfaces() {
  return useQuery({
    queryKey: queryKeys.network.interfaces(),
    queryFn: () =>
      apiClient.get<ApiResponse<NetworkInterface[]>>(ENDPOINTS.network.interfaces)
        .then(r => r.data),
  });
}
