import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { queryKeys } from '../../../services/queryKeys';
import type { ApiResponse } from '../../../types/api';
import type { DnsSettings } from '../../../types/network';

export function useDns() {
  return useQuery({
    queryKey: queryKeys.network.dns(),
    queryFn: () =>
      apiClient.get<ApiResponse<DnsSettings>>(ENDPOINTS.network.dns)
        .then(r => r.data),
  });
}
