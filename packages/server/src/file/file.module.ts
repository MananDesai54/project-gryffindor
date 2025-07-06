import { Module } from '@nestjs/common';
import { StorageModule } from '../cloud/storage/storage.module';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { PDFContentLoader } from './loaders/pdf-content.loader';
import { LinkContentLoader } from './loaders/link-content.loader';

@Module({
  controllers: [FileController],
  imports: [StorageModule],
  providers: [FileService, PDFContentLoader, LinkContentLoader],
  exports: [FileService, PDFContentLoader, LinkContentLoader],
})
export class FileModule {}
