import { Injectable, Logger } from '@nestjs/common';
import { StorageService } from 'src/cloud/storage/storage.service';

@Injectable()
export class FileService {
  constructor(private readonly storageService: StorageService) {}

  async uploadFiles(files: Express.Multer.File[]) {
    try {
      return this.storageService.uploadFiles(files);
    } catch (error) {
      Logger.error('Error uploading files', error);
      throw error;
    }
  }
}
