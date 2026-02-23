import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { queryKeys } from '../../../services/queryKeys';
import type { ApiResponse } from '../../../types/api';
import type { PagedResponse } from '../../../types/pagination';
import type { Administrator, SoftwareVersion, HaSettings } from '../../../types/system';

export function useAdmins() {
  return useInfiniteQuery({
    queryKey: queryKeys.system.admins(),
    queryFn: ({ pageParam = 1 }) =>
      apiClient.get<PagedResponse<Administrator>>(ENDPOINTS.system.admins, { page: pageParam, pageSize: 20 }),
    getNextPageParam: (last) => last.hasMore ? last.nextPage : undefined,
    initialPageParam: 1,
  });
}

export function useSoftwareVersion() {
  return useQuery({
    queryKey: queryKeys.system.version(),
    queryFn: () =>
      apiClient.get<ApiResponse<SoftwareVersion>>(ENDPOINTS.system.version)
        .then(r => r.data),
  });
}

export function useHaSettings() {
  return useQuery({
    queryKey: queryKeys.system.ha(),
    queryFn: () =>
      apiClient.get<ApiResponse<HaSettings>>(ENDPOINTS.system.ha)
        .then(r => r.data),
  });
}
