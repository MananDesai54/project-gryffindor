import { Module } from '@nestjs/common';
import { UserSchemaModule } from '../user/schema/user.schema';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UserSchemaModule],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule {}
