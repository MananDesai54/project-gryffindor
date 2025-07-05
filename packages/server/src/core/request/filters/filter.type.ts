export interface Filter {
  filterType: FilterType;
  value: any[];
  field: string;
}

export enum FilterType {
  IN = 'IN',
  NIN = 'NIN',
  EQ = 'EQ',
}
