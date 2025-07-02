export interface Filter {
  filterType: FilterType;
  value: any[];
  field: string;
}

export enum FilterType {
  IN = "IN",
  NIN = "NIN",
  EQ = "EQ",
}

export interface PageInfo {
  page: number;
  size: number;
}

export interface SearchRequest {
  filters?: Filter[];
  pageInfo?: PageInfo;
}

export interface SearchResponse<T> {
  data: T[];
  count: number;
  pageInfo?: PageInfo;
}
