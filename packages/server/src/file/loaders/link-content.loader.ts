import { Document } from '@langchain/core/documents';
import { Readability } from '@mozilla/readability';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JSDOM } from 'jsdom';
import FireCrawlApp, { ScrapeResponse } from '@mendable/firecrawl-js';

@Injectable()
export class LinkContentLoader {
  private readonly fireCrawlApp = new FireCrawlApp({
    apiKey: process.env.FIRE_CRAWL_API_KEY,
  });

  async loadLinkContentOld(link: string) {
    try {
      const dom = await JSDOM.fromURL(link);

      const reader = new Readability(dom.window.document);
      const article = reader.parse();

      if (!article)
        throw new InternalServerErrorException(
          'Failed to parse article with Readability',
        );

      const document = new Document({
        pageContent: article.textContent!,
        metadata: {
          source: link,
          title: article.title,
          author: article.byline,
        },
      });

      return document;
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Failed to load link content',
      );
    }
  }
  async loadLinkContent(link: string) {
    try {
      const scrapeResult = (await this.fireCrawlApp.scrapeUrl(link, {
        formats: ['markdown'],
        onlyMainContent: true,
        parsePDF: true,
        maxAge: 14400000,
      })) as ScrapeResponse;

      const document = new Document({
        pageContent: scrapeResult.markdown!,
        metadata: {
          source: link,
          title: scrapeResult.title,
          description: scrapeResult.description,
        },
      });

      return document;
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Failed to load link content',
      );
    }
  }
}
