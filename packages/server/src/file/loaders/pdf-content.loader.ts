import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { last, split } from 'lodash';
import { FileService } from '../file.service';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';

@Injectable()
export class PDFContentLoader {
  constructor(@Inject() private readonly fileService: FileService) {}

  async loadPDFContentFromURL(url: string) {
    const fileId = last(split(url, '/'));
    if (!fileId) throw new InternalServerErrorException('fileId is required');
    const fileBuffer = await this.fileService.downloadFile(fileId);
    const loader = new PDFLoader(new Blob([fileBuffer]));
    const document = await loader.load();
    return document[0];
  }
}
