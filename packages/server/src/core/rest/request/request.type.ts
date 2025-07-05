import { Filter } from './filters/filter.type';
import { PageInfo } from './pageInfo/pageInfo.type';

export interface SearchRequest {
  filters?: Filter[];
  pageInfo?: PageInfo;
}

export interface MongoFindParameters {
  query: Record<string, any>;
  options: {
    skip: number;
    limit: number;
    sort?: Record<string, 1 | -1>; // Optional sorting
  };
}

export interface SearchResponse<T = any> {
  data: T[];
  count: number;
  pageInfo?: PageInfo;
}
