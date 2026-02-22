import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { queryKeys } from '../../../services/queryKeys';
import type { ApiResponse } from '../../../types/api';
import type { FirewallRule, NatRule } from '../../../types/security';

export function useFirewallRules() {
  return useQuery({
    queryKey: queryKeys.security.rules(),
    queryFn: () =>
      apiClient.get<ApiResponse<FirewallRule[]>>(ENDPOINTS.security.rules)
        .then(r => r.data),
  });
}

export function useNatRules() {
  return useQuery({
    queryKey: queryKeys.security.nat(),
    queryFn: () =>
      apiClient.get<ApiResponse<NatRule[]>>(ENDPOINTS.security.nat)
        .then(r => r.data),
  });
}
