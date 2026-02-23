import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { queryKeys } from '../../../services/queryKeys';
import type { ApiResponse } from '../../../types/api';
import type { PagedResponse } from '../../../types/pagination';
import type { FirewallRule, NatRule } from '../../../types/security';

// Firewall rules keep useQuery (full list needed for DnD reorder)
export function useFirewallRules() {
  return useQuery({
    queryKey: queryKeys.security.rules(),
    queryFn: () =>
      apiClient.get<ApiResponse<FirewallRule[]>>(ENDPOINTS.security.rules)
        .then(r => r.data),
  });
}

// NAT rules use infinite scroll pagination
export function useNatRules() {
  return useInfiniteQuery({
    queryKey: queryKeys.security.nat(),
    queryFn: ({ pageParam = 1 }) =>
      apiClient.get<PagedResponse<NatRule>>(ENDPOINTS.security.nat, { page: pageParam, pageSize: 20 }),
    getNextPageParam: (last) => last.hasMore ? last.nextPage : undefined,
    initialPageParam: 1,
  });
}
