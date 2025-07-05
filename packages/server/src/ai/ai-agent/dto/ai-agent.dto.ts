import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { values } from 'lodash';
import { AiBuiltInToolType } from '../../ai-tool/types/ai-tool.type';

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
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AiAgentConfigurationDto)
  configuration?: AiAgentConfigurationDto;
}

export class UpdateAiAgentDto extends CreateAiAgentDto {}
