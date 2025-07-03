import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { StorageService } from 'src/cloud/storage/storage.service';

@Module({
  controllers: [FileController],
  providers: [FileService, StorageService],
})
export class FileModule {}
