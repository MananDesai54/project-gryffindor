import { UploadedFile } from "../../types/file.type";
import { apiRequest } from "../common/request/axios";
import { ApiService } from "./apiService";

class FileService extends ApiService {
  private static instance: FileService;

  private constructor() {
    super("file");
  }

  upload(formData: FormData) {
    return apiRequest.post<FormData, UploadedFile[]>(
      this.createUrl("upload"),
      formData,
    );
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new FileService();
    }
    return this.instance;
  }
}

export const fileServiceInstance = FileService.getInstance();
