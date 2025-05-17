export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginationResult<T> {
  records: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FilterOptions<T> {
  [key: string]: any;
}

export interface SortOptions {
  [field: string]: 1 | -1;
}
