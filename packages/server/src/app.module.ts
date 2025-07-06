import { Module } from '@nestjs/common';
import { AiAgentModule } from './ai/ai-agent/ai-agent.module';
import { AiToolModule } from './ai/ai-tool/ai-tool.module';
import { IndexingModule } from './ai/indexing/indexing.module';
import { InferenceModule } from './ai/inference/inference.module';
import { InternalModule } from './ai/internal/internal.module';
import { KnowledgeBaseModule } from './ai/knowledge-base/knowledge-base.module';
import { LlmModule } from './ai/llm/llm.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CloudModule } from './cloud/cloud.module';
import { CoreModule } from './core/core.module';
import { FileModule } from './file/file.module';
import { InfraModule } from './infra/infra.module';
import { UserModule } from './user/user.module';
import { DummyApiModule } from './dummy-api/dummy-api.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    FileModule,
    CloudModule,
    InfraModule,
    InferenceModule,
    CoreModule,
    AiAgentModule,
    AiToolModule,
    KnowledgeBaseModule,
    LlmModule,
    IndexingModule,
    InternalModule,
    DummyApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
