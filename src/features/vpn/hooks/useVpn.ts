import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { queryKeys } from '../../../services/queryKeys';
import type { ApiResponse } from '../../../types/api';
import type { VpnTunnel, RemoteAccessSettings, RemoteAccessUser } from '../../../types/vpn';

export function useVpnTunnels() {
  return useQuery({
    queryKey: queryKeys.vpn.tunnels(),
    queryFn: () =>
      apiClient.get<ApiResponse<VpnTunnel[]>>(ENDPOINTS.vpn.tunnels)
        .then(r => r.data),
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
  return useQuery({
    queryKey: queryKeys.vpn.remoteUsers(),
    queryFn: () =>
      apiClient.get<ApiResponse<RemoteAccessUser[]>>(ENDPOINTS.vpn.remoteUsers)
        .then(r => r.data),
  });
}
