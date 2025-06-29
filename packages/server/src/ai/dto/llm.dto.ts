import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUrl,
  ValidateIf,
} from 'class-validator';
import { LLMType, StandardLLMProvider } from '../types/ai';

export class CreateLLMDto {
  @IsString()
  @IsNotEmpty()
  modelId: string;
  @IsEnum(LLMType)
  @IsNotEmpty()
  type: string;

  @ValidateIf((l) => l.type === LLMType.STANDARD)
  @IsNotEmpty()
  @IsEnum(StandardLLMProvider)
  provider: string;

  @ValidateIf((l) => l.type === LLMType.CUSTOM)
  @IsUrl()
  @IsNotEmpty()
  serverUrl: string;
  @ValidateIf((l) => l.type === LLMType.CUSTOM)
  @IsNotEmpty()
  @IsString()
  apiKey: string;
}

export class UpdateLLMDto extends CreateLLMDto {}
