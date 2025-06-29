import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsIn,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AiBuiltInToolType } from '../types/ai';
import { values } from 'lodash';

class AiAgentConfigurationDto {
  @IsString()
  @IsOptional()
  firstMessage?: string;

  @IsString()
  @IsOptional()
  systemPrompt?: string;

  @IsObject()
  @IsOptional()
  dynamicVariables?: Record<string, string>;

  @IsNumber()
  @IsOptional()
  temperature?: number;

  @IsNumber()
  @IsOptional()
  maxTokens?: number;

  @IsArray()
  @IsOptional()
  knowledgeBaseIds?: string[];

  @IsArray()
  @IsOptional()
  @IsIn([values(AiBuiltInToolType)])
  builtInTools?: string[];

  @IsArray()
  @IsOptional()
  customToolIds?: string[];

  @IsString()
  @IsNotEmpty()
  llm: string;
}

export class CreateAiAgentDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => AiAgentConfigurationDto)
  configuration: AiAgentConfigurationDto;
}

export class UpdateAiAgentDto extends CreateAiAgentDto {}
