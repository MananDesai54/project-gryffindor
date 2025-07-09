import { Logger } from '@nestjs/common';
import { FilterTypeToMongoOperator } from './filter.constant';
import { Filter, FilterType } from './filter.type';

export class FilterUtil {
  private static readonly logger = new Logger(FilterUtil.name);

  static getMongoQueryForFilters(filters: Filter[]): Record<string, any> {
    if (!filters || filters.length === 0) {
      return {};
    }

    const mongoQuery = filters.reduce(
      (query, filter) => {
        const { filterType, field, value } = filter;

        const mongoOperator = FilterTypeToMongoOperator[filterType];

        if (!mongoOperator) {
          this.logger.warn(
            `Unsupported filter type received: ${filterType}. Skipping.`,
          );
          return query;
        }

        switch (filterType) {
          case FilterType.IN:
          case FilterType.NIN:
            query[field] = { [mongoOperator]: value };
            break;

          case FilterType.EQ:
            if (value && value.length > 0) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              query[field] = { [mongoOperator]: value[0] };
            } else {
              this.logger.warn(
                `'EQ' filter for field '${field}' received an empty or null value array. Skipping.`,
              );
            }
            break;

          default:
            this.logger.warn(
              `Filter logic for type '${filterType as any}' not implemented. Skipping.`,
            );
            break;
        }

        return query;
      },
      {} as Record<string, any>,
    );

    return mongoQuery;
  }
}
