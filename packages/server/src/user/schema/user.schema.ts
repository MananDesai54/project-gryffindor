import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  _id: string;
  @Prop({ required: true, unique: true })
  username: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true, select: false })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export const UserSchemaModule = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
]);
