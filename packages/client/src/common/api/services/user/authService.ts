import { AuthUtils } from "@gryffindor/client/common/utils/authUtils";
import { apiRequest } from "../../common/request/axios";
import { ApiService } from "../apiService";
import { AuthResponse, User } from "@gryffindor/client/common/types/user.type";

class AuthService extends ApiService {
  private static instance: AuthService;

  private constructor() {
    super("auth");
  }

  async me() {
    return await apiRequest.get<User>(this.createUrl("me"));
  }

  async login(email: string, password: string) {
    return await apiRequest.post<
      {
        email: string;
        password: string;
      },
      AuthResponse
    >(this.createUrl("login"), {
      email,
      password,
    });
  }

  async logout() {
    return new Promise((res) => {
      AuthUtils.logout();
      res(true);
    });
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new AuthService();
    }
    return this.instance;
  }
}

export const authServiceInstance = AuthService.getInstance();
