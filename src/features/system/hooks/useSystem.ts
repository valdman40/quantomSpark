import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { queryKeys } from '../../../services/queryKeys';
import type { ApiResponse } from '../../../types/api';
import type { Administrator, SoftwareVersion, HaSettings } from '../../../types/system';

export function useAdmins() {
  return useQuery({
    queryKey: queryKeys.system.admins(),
    queryFn: () =>
      apiClient.get<ApiResponse<Administrator[]>>(ENDPOINTS.system.admins)
        .then(r => r.data),
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
