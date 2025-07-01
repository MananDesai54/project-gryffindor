export abstract class ApiService {
  constructor(private readonly baseUrl: string) {}

  getBaseUrl(): string {
    return this.baseUrl;
  }

  createUrl(path: string): string {
    return `${this.baseUrl}/${path}`;
  }
}
