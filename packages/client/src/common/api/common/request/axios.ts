import { NotifyError } from "@gryffindor/client/common/components/app/toast";
import { AuthUtils } from "@gryffindor/client/common/utils/authUtils";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
} from "axios";

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public response: AxiosResponse,
  ) {
    super(message);
  }
}

class ApiRequest {
  private axiosInstance: AxiosInstance;

  constructor(baseUrl: string) {
    this.axiosInstance = this._getAxiosInstance(baseUrl);
    this._addRequestInterceptor();
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance
      .get(url, config)
      .then((response) => response.data)
      .catch(this._handleError);
  }

  async post<T, RT>(
    url: string,
    data: T,
    config?: AxiosRequestConfig,
  ): Promise<RT> {
    return this.axiosInstance
      .post(url, data, config)
      .then((response) => response.data)
      .catch(this._handleError);
  }

  async put<T, RT>(
    url: string,
    data: T,
    config?: AxiosRequestConfig,
  ): Promise<RT> {
    return this.axiosInstance
      .put(url, data, config)
      .then((response) => response.data)
      .catch(this._handleError);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance
      .delete(url, config)
      .then((response) => response.data)
      .catch(this._handleError);
  }

  // ============== Private methods ==============

  private _getAxiosInstance(baseUrl: string) {
    return axios.create({
      baseURL: baseUrl,
    });
  }

  private _addRequestInterceptor() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        config.headers = {
          ...config.headers,
          ...AuthUtils.getAuthHeaders(),
        } as AxiosRequestHeaders;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
  }

  private _handleError(error: AxiosError) {
    NotifyError(
      error,
      JSON.stringify(error.response?.data) || "An error occurred",
    );
    throw error;
  }
}

export const apiRequest = new ApiRequest("http://localhost:3000");
