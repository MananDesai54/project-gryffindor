import { Module } from '@nestjs/common';
import { AiModule } from './ai/ai.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';
import { CloudModule } from './cloud/cloud.module';

@Module({
  imports: [
    DbModule,
    AuthModule,
    UserModule,
    AiModule,
    FileModule,
    CloudModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
