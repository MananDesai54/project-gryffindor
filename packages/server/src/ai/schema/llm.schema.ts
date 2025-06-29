import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { LLMType } from '../types/ai';
import { values } from 'lodash';

export type LLMDocument = HydratedDocument<LLM>;

@Schema({ timestamps: true, discriminatorKey: 'type' })
export class LLM {
  _id: string;
  type: string; // just for typescript
  @Prop({ required: true, unique: true })
  modelId: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  creator: User;
}

@Schema()
export class StandardLLM extends LLM {
  @Prop({ required: true })
  provider: string;
}

@Schema()
export class CustomLLM extends LLM {
  @Prop({ required: true })
  serverUrl: string;
  @Prop({ required: true })
  apiKey: string;
}

export const LLMSchema = SchemaFactory.createForClass(LLM);
export const StandardLLMSchema = SchemaFactory.createForClass(StandardLLM);
export const CustomLLMSchema = SchemaFactory.createForClass(CustomLLM);

export const LLMSchemaModule = MongooseModule.forFeature([
  {
    name: LLM.name,
    schema: LLMSchema,
    discriminators: [
      {
        name: LLMType.STANDARD,
        schema: StandardLLMSchema,
      },
      {
        name: LLMType.CUSTOM,
        schema: CustomLLMSchema,
      },
    ],
  },
]);
