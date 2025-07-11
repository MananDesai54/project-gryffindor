import {
  Inject,
  Logger,
  Module,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
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
import { DummyApiModule } from './dummy-api/dummy-api.module';
import { FileModule } from './file/file.module';
import { InfraModule } from './infra/infra.module';
import { InfraService } from './infra/infra.service';
import { UserModule } from './user/user.module';

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
export class AppModule implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AppModule.name);

  constructor(@Inject() private readonly infraService: InfraService) {}

  async onModuleInit() {
    try {
      await this.infraService.initInfra();
    } catch (error) {
      this.logger.error('Error initializing infrastructure: ', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.infraService.destroyInfra();
    } catch (error) {
      this.logger.error('Error destroying infrastructure: ', error);
      throw error;
    }
  }
}
