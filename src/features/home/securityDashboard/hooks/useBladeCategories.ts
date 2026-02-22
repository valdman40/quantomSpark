import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../../services/api/client';
import { ENDPOINTS } from '../../../../services/api/endpoints';
import { queryKeys } from '../../../../services/queryKeys';
import type { ApiResponse } from '../../../../types/api';
import type { BladeCategory } from '../../../../types/home';

export function useBladeCategories() {
  return useQuery({
    queryKey: queryKeys.home.bladeCategories(),
    queryFn: () =>
      apiClient
        .get<ApiResponse<BladeCategory[]>>(ENDPOINTS.home.bladeCategories)
        .then(r => r.data),
  });
}
