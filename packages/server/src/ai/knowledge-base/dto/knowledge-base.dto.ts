import {
  IsArray,
  IsEnum,
  IsMimeType,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
} from 'class-validator';
import { KnowledgeBaseType } from '../types/knowledge-base.type';
import { Status } from 'src/core/types/status';

export class CreateKnowledgeBaseDto {
  @IsEnum(KnowledgeBaseType)
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateIf(
    (k: CreateKnowledgeBaseDto) =>
      (k.type as KnowledgeBaseType) === KnowledgeBaseType.TEXT,
  )
  @IsString()
  @IsNotEmpty()
  content: string;

  @ValidateIf(
    (k: CreateKnowledgeBaseDto) =>
      (k.type as KnowledgeBaseType) === KnowledgeBaseType.LINK ||
      (k.type as KnowledgeBaseType) === KnowledgeBaseType.FILE,
  )
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ValidateIf(
    (k: CreateKnowledgeBaseDto) =>
      (k.type as KnowledgeBaseType) === KnowledgeBaseType.FILE,
  )
  @IsMimeType()
  @IsNotEmpty()
  mimeType: string;

  @IsArray()
  dependentAgents: string[];
}

class SourceContentMetadataDto {
  @IsEnum(Status)
  status: string;
  @IsObject()
  @IsObject()
  metadata?: Map<string, any>;
}

export class UpdateKnowledgeBaseDto extends CreateKnowledgeBaseDto {
  @IsObject()
  @IsOptional()
  sourceContentMetadata?: SourceContentMetadataDto;
}
