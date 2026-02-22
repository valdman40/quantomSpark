/** Generic envelope returned by every API endpoint */
export interface ApiResponse<T> {
  data: T;
  status: 'ok' | 'error';
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
}
