import { Module } from '@nestjs/common';
import { AiModule } from './ai/ai.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [DbModule, AuthModule, UserModule, AiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
