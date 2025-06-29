import {
  IsEnum,
  IsMimeType,
  IsNotEmpty,
  IsString,
  IsUrl,
  ValidateIf,
} from 'class-validator';
import { KnowledgeBaseType } from '../types/ai';

export class CreateKnowledgeBaseDto {
  @IsEnum(KnowledgeBaseType)
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateIf((k) => k.type === KnowledgeBaseType.TEXT)
  @IsString()
  @IsNotEmpty()
  content: string;

  @ValidateIf(
    (k) =>
      k.type === KnowledgeBaseType.LINK || k.type === KnowledgeBaseType.FILE,
  )
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ValidateIf((k) => k.type === KnowledgeBaseType.FILE)
  @IsMimeType()
  @IsNotEmpty()
  mimeType: string;
}

export class UpdateKnowledgeBaseDto extends CreateKnowledgeBaseDto {}
