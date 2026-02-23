import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { queryKeys } from '../../../services/queryKeys';
import type { PagedResponse } from '../../../types/pagination';
import type { NetworkInterface } from '../../../types/network';

export function useInterfaces() {
  return useInfiniteQuery({
    queryKey: queryKeys.network.interfaces(),
    queryFn: ({ pageParam = 1 }) =>
      apiClient.get<PagedResponse<NetworkInterface>>(ENDPOINTS.network.interfaces, { page: pageParam, pageSize: 20 }),
    getNextPageParam: (last) => last.hasMore ? last.nextPage : undefined,
    initialPageParam: 1,
  });
}
