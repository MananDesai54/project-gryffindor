import { AuthContextType } from 'src/auth/dto/auth.dto';
import { SearchRequest, SearchResponse } from './request/request.type';

export interface SearchController<T> {
  search(
    searchRequest: Partial<SearchRequest>,
    ctx?: AuthContextType,
  ): Promise<SearchResponse<T>>;
  count(
    searchRequest: Partial<SearchRequest>,
    ctx?: AuthContextType,
  ): Promise<number>;
}

export interface SearchService<T> {
  search(
    searchRequest: Partial<SearchRequest>,
    ctx?: AuthContextType,
  ): Promise<SearchResponse<T>>;
  count(
    searchRequest: Partial<SearchRequest>,
    ctx?: AuthContextType,
  ): Promise<number>;
}
