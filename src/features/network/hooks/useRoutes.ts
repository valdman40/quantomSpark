import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { queryKeys } from '../../../services/queryKeys';
import type { PagedResponse } from '../../../types/pagination';
import type { StaticRoute } from '../../../types/network';

export function useRoutes() {
  return useInfiniteQuery({
    queryKey: queryKeys.network.routes(),
    queryFn: ({ pageParam = 1 }) =>
      apiClient.get<PagedResponse<StaticRoute>>(ENDPOINTS.network.routes, { page: pageParam, pageSize: 20 }),
    getNextPageParam: (last) => last.hasMore ? last.nextPage : undefined,
    initialPageParam: 1,
  });
}
