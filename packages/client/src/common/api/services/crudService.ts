import { apiRequest } from "../common/request/axios";
import { ApiService } from "./apiService";

export abstract class CRUDService<T> extends ApiService {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async create(data: Partial<T>): Promise<T> {
    return apiRequest.post<Partial<T>, T>(this.createUrl("create"), data);
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    return apiRequest.put<Partial<T>, T>(this.createUrl(`${id}`), data);
  }

  async delete(id: string): Promise<void> {
    await apiRequest.delete(this.createUrl(`${id}`));
  }

  async get(id: string): Promise<T> {
    return apiRequest.get<T>(this.createUrl(`${id}`));
  }
}
