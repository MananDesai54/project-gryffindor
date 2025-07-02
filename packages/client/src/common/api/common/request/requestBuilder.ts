import {
  Filter,
  FilterType,
  SearchRequest,
} from "@gryffindor/client/common/types/request/searchRequest";

export class SearchRequestBuilder {
  private searchRequest: SearchRequest;

  constructor() {
    this.searchRequest = {
      filters: [],
      pageInfo: {
        page: 0,
        size: 20,
      },
    };
  }

  addFilters(filters: Filter[]): SearchRequestBuilder {
    this.searchRequest.filters = [
      ...(this.searchRequest.filters || []),
      ...filters,
    ];
    return this;
  }

  addFilter(filter: Filter): SearchRequestBuilder {
    this.searchRequest.filters = [
      ...(this.searchRequest.filters || []),
      filter,
    ];
    return this;
  }

  pageInfo(page: number, size: number): SearchRequestBuilder {
    this.searchRequest.pageInfo = { page, size };
    return this;
  }

  build(): SearchRequest {
    return this.searchRequest;
  }
}

export class FilterBuilder {
  private filter: Filter;

  constructor() {
    this.filter = {
      field: "",
      filterType: FilterType.IN,
      value: [],
    };
  }

  field(field: string): FilterBuilder {
    this.filter.field = field;
    return this;
  }

  operator(operator: FilterType): FilterBuilder {
    this.filter.filterType = operator;
    return this;
  }

  value(value: any[]): FilterBuilder {
    this.filter.value = value;
    return this;
  }

  build(): Filter {
    return this.filter;
  }
}
