import { Injectable } from '@nestjs/common';
import { StorageService } from 'src/cloud/storage/storage.service';

@Injectable()
export class FileService {
  constructor(private readonly storageService: StorageService) {}

  async uploadFiles(files: Express.Multer.File[]) {
    return this.storageService.uploadFiles(files);
  }
}
