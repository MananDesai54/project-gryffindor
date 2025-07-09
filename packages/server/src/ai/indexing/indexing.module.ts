import { Module } from '@nestjs/common';
import { ChromadbModule } from '../../infra/chromadb/chromadb.module';
import { AiAgentModule } from '../ai-agent/ai-agent.module';
import { KnowledgeBaseModule } from '../knowledge-base/knowledge-base.module';
import { IndexingController } from './indexing.controller';
import { IndexingService } from './indexing.service';

@Module({
  controllers: [IndexingController],
  // controllers: [IndexingController, InjexingConsumer],
  providers: [IndexingService],
  imports: [
    ChromadbModule,
    AiAgentModule,
    KnowledgeBaseModule,
    // MessagingModule,
  ],
})
export class IndexingModule {}
