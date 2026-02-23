import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient }  from '../../../../services/api/client';
import { ENDPOINTS }  from '../../../../services/api/endpoints';
import { queryKeys }  from '../../../../services/queryKeys';
import type { PagedResponse } from '../../../../types/pagination';
import type { ConnectedAsset } from '../../../../types/home';

export function useAssets() {
  return useInfiniteQuery({
    queryKey: queryKeys.home.assets(),
    queryFn: ({ pageParam = 1 }) =>
      apiClient.get<PagedResponse<ConnectedAsset>>(ENDPOINTS.home.assets, { page: pageParam, pageSize: 20 }),
    getNextPageParam: (last) => last.hasMore ? last.nextPage : undefined,
    initialPageParam: 1,
  });
}
