import { Injectable } from '@nestjs/common';
import Langfuse from 'langfuse-node';

@Injectable()
export class LangfuseService {
  private readonly langfuse: Langfuse;

  constructor() {
    this.langfuse = new Langfuse({
      secretKey: process.env.LANGFUSE_SECRET_KEY,
      publicKey: process.env.LANGFUSE_PUBLIC_KEY,
      baseUrl: process.env.LANGFUSE_BASE_URL,
    });
  }

  getLangFuseClient() {
    return this.langfuse;
  }

  async shutdown() {
    await this.langfuse.shutdownAsync();
  }

  async onModuleDestroy() {
    await this.langfuse.shutdownAsync();
  }
}
