import { Injectable } from '@nestjs/common';
import { StorageService } from '../cloud/storage/storage.service';

@Injectable()
export class FileService {
  constructor(private readonly storageService: StorageService) {}

  async uploadFiles(files: Express.Multer.File[]) {
    return this.storageService.uploadFiles(files);
  }

  async downloadFile(fileId: string) {
    return this.storageService.downloadFile(fileId);
  }
}
