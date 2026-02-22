import { useQuery } from '@tanstack/react-query';
import { apiClient }  from '../../../../services/api/client';
import { ENDPOINTS }  from '../../../../services/api/endpoints';
import { queryKeys }  from '../../../../services/queryKeys';
import type { ApiResponse } from '../../../../types/api';
import type { ConnectedAsset } from '../../../../types/home';

export function useAssets() {
  return useQuery({
    queryKey: queryKeys.home.assets(),
    queryFn: () =>
      apiClient.get<ApiResponse<ConnectedAsset[]>>(ENDPOINTS.home.assets)
        .then(r => r.data),
  });
}
