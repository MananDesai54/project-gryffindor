import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUrl,
  ValidateIf,
} from 'class-validator';
import { LLMType, StandardLLMProvider } from '../types/llm.type';

export class CreateLLMDto {
  @IsString()
  @IsNotEmpty()
  modelId: string;
  @IsEnum(LLMType)
  @IsNotEmpty()
  type: string;

  @ValidateIf((l: CreateLLMDto) => (l.type as LLMType) === LLMType.STANDARD)
  @IsNotEmpty()
  @IsEnum(StandardLLMProvider)
  provider: string;

  @ValidateIf((l: CreateLLMDto) => (l.type as LLMType) === LLMType.CUSTOM)
  @IsUrl()
  @IsNotEmpty()
  serverUrl: string;
  @ValidateIf((l: CreateLLMDto) => (l.type as LLMType) === LLMType.CUSTOM)
  @IsNotEmpty()
  @IsString()
  apiKey: string;
}

export class UpdateLLMDto extends CreateLLMDto {}
