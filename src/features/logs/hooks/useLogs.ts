import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { queryKeys } from '../../../services/queryKeys';
import type { PagedResponse } from '../../../types/pagination';
import type { SecurityLogEntry, TrafficLogEntry, SystemEvent, LogFilters } from '../../../types/logs';

export function useSecurityLogs(filters: Partial<LogFilters>) {
  return useInfiniteQuery({
    queryKey: queryKeys.logs.security(filters),
    queryFn: ({ pageParam = 1 }) =>
      apiClient.get<PagedResponse<SecurityLogEntry>>(ENDPOINTS.logs.security, { ...filters, page: pageParam, pageSize: 20 })
,
    getNextPageParam: (last) => last.hasMore ? last.nextPage : undefined,
    initialPageParam: 1,
  });
}

export function useTrafficLogs(filters: Partial<LogFilters>) {
  return useInfiniteQuery({
    queryKey: queryKeys.logs.traffic(filters),
    queryFn: ({ pageParam = 1 }) =>
      apiClient.get<PagedResponse<TrafficLogEntry>>(ENDPOINTS.logs.traffic, { ...filters, page: pageParam, pageSize: 20 })
,
    getNextPageParam: (last) => last.hasMore ? last.nextPage : undefined,
    initialPageParam: 1,
  });
}

export function useSystemEvents(filters: Partial<LogFilters>) {
  return useInfiniteQuery({
    queryKey: queryKeys.logs.events(filters),
    queryFn: ({ pageParam = 1 }) =>
      apiClient.get<PagedResponse<SystemEvent>>(ENDPOINTS.logs.events, { ...filters, page: pageParam, pageSize: 20 })
,
    getNextPageParam: (last) => last.hasMore ? last.nextPage : undefined,
    initialPageParam: 1,
  });
}
