import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { last, reduce, split } from 'lodash';
import { FileService } from '../file.service';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { Document } from '@langchain/core/documents';

@Injectable()
export class PDFContentLoader {
  constructor(@Inject() private readonly fileService: FileService) {}

  async loadPDFContentFromURL(url: string) {
    const fileId = last(split(url, '/'));
    if (!fileId) throw new InternalServerErrorException('fileId is required');
    const fileBuffer = await this.fileService.downloadFile(fileId);
    const loader = new PDFLoader(new Blob([fileBuffer]));
    const documents = await loader.load();
    return new Document({
      pageContent: reduce(documents, (acc, doc) => acc + doc.pageContent, ''),
      metadata: reduce(
        documents,
        (acc, doc) => ({ ...acc, ...doc.metadata }),
        {},
      ),
    });
  }
}
