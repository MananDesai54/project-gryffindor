import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';

const UserSchemaModule = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
]);

@Module({
  imports: [UserSchemaModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserSchemaModule, UserService],
})
export class UserModule {}
