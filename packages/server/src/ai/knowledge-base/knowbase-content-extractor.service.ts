import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { LinkContentLoader } from '../../file/loaders/link-content.loader';
import { PDFContentLoader } from '../../file/loaders/pdf-content.loader';
import { KnowledgeBase } from './schema/knowledge-base.schema';
import { KnowledgeBaseType } from './types/knowledge-base.type';
import { Document } from '@langchain/core/documents';

@Injectable()
export class KnowbaseContentExtractorService {
  constructor(
    @Inject() private readonly pdfContentLoader: PDFContentLoader,
    @Inject() private readonly linkContentLoader: LinkContentLoader,
  ) {}

  async extractContentForKnowledgeBase(kb: Partial<KnowledgeBase>) {
    switch (kb.type as KnowledgeBaseType) {
      case KnowledgeBaseType.FILE:
        if (!kb.url)
          throw new InternalServerErrorException(
            'KnowledgeBase url is required',
          );
        return await this.pdfContentLoader.loadPDFContentFromURL(kb.url);
      case KnowledgeBaseType.LINK:
        if (!kb.url)
          throw new InternalServerErrorException(
            'KnowledgeBase url is required',
          );
        return await this.linkContentLoader.loadLinkContent(kb.url);
      case KnowledgeBaseType.TEXT:
      default:
        return new Promise<Document>((resolve) => {
          resolve(new Document({ pageContent: kb.content || '' }));
        });
    }
  }
}
