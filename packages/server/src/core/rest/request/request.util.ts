import { AuthContextType } from '../../../auth/dto/auth.dto';
import { FilterUtil } from './filters/filter.util';
import { MongoFindParameters, SearchRequest } from './request.type';
import { FilterType } from './filters/filter.type';

export class RequestUtil {
  static getMongoQueryAndOptionsForRequest(
    request: SearchRequest,
    authContext?: AuthContextType,
  ): MongoFindParameters {
    if (authContext?.userId) {
      request.filters = [
        ...(request.filters || []),
        {
          field: 'creator',
          value: [authContext.userId],
          filterType: FilterType.IN,
        },
      ];
    }

    if (!request) {
      return {
        query: {},
        options: { skip: 0, limit: 0, sort: { createdAt: -1 } },
      };
    }

    const query = FilterUtil.getMongoQueryForFilters(request.filters || []);

    const options: MongoFindParameters['options'] = {
      skip: 0,
      limit: 0,
      sort: { createdAt: -1 },
    };

    if (request.pageInfo) {
      const page = request.pageInfo.page > 0 ? request.pageInfo.page : 1;
      const size = request.pageInfo.size > 0 ? request.pageInfo.size : 20; // Default size to 20

      options.limit = size;
      options.skip = (page - 1) * size;
    }

    return { query, options };
  }
}
