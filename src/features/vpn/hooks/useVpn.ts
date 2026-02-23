import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { queryKeys } from '../../../services/queryKeys';
import type { ApiResponse } from '../../../types/api';
import type { PagedResponse } from '../../../types/pagination';
import type { VpnTunnel, RemoteAccessSettings, RemoteAccessUser } from '../../../types/vpn';

export function useVpnTunnels() {
  return useInfiniteQuery({
    queryKey: queryKeys.vpn.tunnels(),
    queryFn: ({ pageParam = 1 }) =>
      apiClient.get<PagedResponse<VpnTunnel>>(ENDPOINTS.vpn.tunnels, { page: pageParam, pageSize: 20 })
,
    getNextPageParam: (last) => last.hasMore ? last.nextPage : undefined,
    initialPageParam: 1,
  });
}

export function useRemoteAccess() {
  return useQuery({
    queryKey: queryKeys.vpn.remoteAccess(),
    queryFn: () =>
      apiClient.get<ApiResponse<RemoteAccessSettings>>(ENDPOINTS.vpn.remoteAccess)
        .then(r => r.data),
  });
}

export function useRemoteUsers() {
  return useInfiniteQuery({
    queryKey: queryKeys.vpn.remoteUsers(),
    queryFn: ({ pageParam = 1 }) =>
      apiClient.get<PagedResponse<RemoteAccessUser>>(ENDPOINTS.vpn.remoteUsers, { page: pageParam, pageSize: 20 })
,
    getNextPageParam: (last) => last.hasMore ? last.nextPage : undefined,
    initialPageParam: 1,
  });
}
