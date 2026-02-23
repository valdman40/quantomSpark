import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '../../../services/api/client';
import { gatewayClient } from '../../../services/api/gatewayClient';
import { normalizeFirewallRules } from '../../../services/api/normalizers/firewallNormalizer';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { queryKeys } from '../../../services/queryKeys';
import { USE_REAL_API } from '../../../config';
import type { ApiResponse } from '../../../types/api';
import type { PagedResponse } from '../../../types/pagination';
import type { FirewallRule, NatRule } from '../../../types/security';

// Firewall rules keep useQuery (full list needed for DnD reorder).
// When USE_REAL_API is true the hook calls the real gateway; otherwise MSW serves mock data.
export function useFirewallRules() {
  return useQuery({
    queryKey: queryKeys.security.rules(),
    queryFn: async (): Promise<FirewallRule[]> => {
      if (USE_REAL_API) {
        const resp = await gatewayClient.fetchFirewallRules();
        return normalizeFirewallRules(resp.result.data);
      }
      const resp = await apiClient.get<ApiResponse<FirewallRule[]>>(ENDPOINTS.security.rules);
      return (resp as ApiResponse<FirewallRule[]>).data;
    },
    // Don't hammer the gateway with retries — one attempt is enough to surface errors.
    retry: USE_REAL_API ? 0 : 3,
  });
}

// NAT rules use infinite scroll pagination — always uses mock data for now.
export function useNatRules() {
  return useInfiniteQuery({
    queryKey: queryKeys.security.nat(),
    queryFn: ({ pageParam = 1 }) =>
      apiClient.get<PagedResponse<NatRule>>(ENDPOINTS.security.nat, { page: pageParam, pageSize: 20 }),
    getNextPageParam: (last) => last.hasMore ? last.nextPage : undefined,
    initialPageParam: 1,
  });
}
