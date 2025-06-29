import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema, UserSchemaModule } from './schema/user.schema';

@Module({
  imports: [UserSchemaModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService, UserSchemaModule],
})
export class UserModule {}
