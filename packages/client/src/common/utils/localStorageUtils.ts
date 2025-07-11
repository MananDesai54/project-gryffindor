export class LocalStorageUtils {
  static getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  static setItem(key: string, value: any): void {
    localStorage.setItem(key, value);
  }

  static removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}
