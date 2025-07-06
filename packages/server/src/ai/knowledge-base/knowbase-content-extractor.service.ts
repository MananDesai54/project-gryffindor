import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { LinkContentLoader } from '../../file/loaders/link-content.loader';
import { PDFContentLoader } from '../../file/loaders/pdf-content.loader';
import { KnowledgeBase } from './schema/knowledge-base.schema';
import { KnowledgeBaseType } from './types/knowledge-base.type';

@Injectable()
export class KnowbaseContentExtractorService {
  constructor(
    @Inject() private readonly pdfContentLoader: PDFContentLoader,
    @Inject() private readonly linkContentLoader: LinkContentLoader,
  ) {}

  async extractContentForKnowledgeBase(
    kb: Partial<KnowledgeBase>,
  ): Promise<string> {
    switch (kb.type as KnowledgeBaseType) {
      case KnowledgeBaseType.FILE:
        if (!kb.url)
          throw new InternalServerErrorException(
            'KnowledgeBase url is required',
          );
        return (await this.pdfContentLoader.loadPDFContentFromURL(kb.url))
          .pageContent;
      case KnowledgeBaseType.LINK:
        if (!kb.url)
          throw new InternalServerErrorException(
            'KnowledgeBase url is required',
          );
        return (await this.linkContentLoader.loadLinkContent(kb.url))
          .pageContent;
      case KnowledgeBaseType.TEXT:
      default:
        return new Promise<string>((resolve) => {
          resolve(kb.content || '');
        });
    }
  }
}
