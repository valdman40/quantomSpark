import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { queryKeys } from '../../../services/queryKeys';
import type { ApiResponse } from '../../../types/api';
import type { SecurityLogEntry, TrafficLogEntry, SystemEvent, LogFilters } from '../../../types/logs';

export function useSecurityLogs(filters: Partial<LogFilters>) {
  return useQuery({
    queryKey: queryKeys.logs.security(filters),
    queryFn: () =>
      apiClient.get<ApiResponse<SecurityLogEntry[]>>(ENDPOINTS.logs.security)
        .then(r => r.data),
  });
}

export function useTrafficLogs(filters: Partial<LogFilters>) {
  return useQuery({
    queryKey: queryKeys.logs.traffic(filters),
    queryFn: () =>
      apiClient.get<ApiResponse<TrafficLogEntry[]>>(ENDPOINTS.logs.traffic)
        .then(r => r.data),
  });
}

export function useSystemEvents(filters: Partial<LogFilters>) {
  return useQuery({
    queryKey: queryKeys.logs.events(filters),
    queryFn: () =>
      apiClient.get<ApiResponse<SystemEvent[]>>(ENDPOINTS.logs.events)
        .then(r => r.data),
  });
}
