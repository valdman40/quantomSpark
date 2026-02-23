import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient }  from '../../../../services/api/client';
import { ENDPOINTS }  from '../../../../services/api/endpoints';
import { queryKeys }  from '../../../../services/queryKeys';
import type { PagedResponse } from '../../../../types/pagination';
import type { SystemNotification } from '../../../../types/home';

export function useNotifications() {
  return useInfiniteQuery({
    queryKey: queryKeys.home.notifications(),
    queryFn: ({ pageParam = 1 }) =>
      apiClient.get<PagedResponse<SystemNotification>>(ENDPOINTS.home.notifications, { page: pageParam, pageSize: 20 }),
    getNextPageParam: (last) => last.hasMore ? last.nextPage : undefined,
    initialPageParam: 1,
  });
}
