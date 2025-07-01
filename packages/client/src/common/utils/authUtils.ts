import { X_AUTH_TOKEN } from "../constants/auth";
import { LocalStorageUtils } from "./localStorageUtils";

export class AuthUtils {
  static getAuthToken(): string | null {
    return LocalStorageUtils.getItem(X_AUTH_TOKEN);
  }

  static setAuthToken(token: string): void {
    LocalStorageUtils.setItem(X_AUTH_TOKEN, token);
  }

  static getAuthHeaders(): Record<string, string> {
    const token = AuthUtils.getAuthToken();
    return token ? { [X_AUTH_TOKEN]: token } : {};
  }

  static logout(): void {
    LocalStorageUtils.removeItem(X_AUTH_TOKEN);
  }

  static isLoggedIn(): boolean {
    return !!AuthUtils.getAuthToken();
  }
}
