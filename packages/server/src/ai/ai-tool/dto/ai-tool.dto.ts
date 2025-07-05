import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import {
  AiToolParamDataType,
  AiToolParamValueType,
  AiToolRequestMethod,
  AiToolType,
} from '../types/ai-tool.type';

export class ApiParamsValueSchema {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(AiToolParamDataType)
  @IsNotEmpty()
  datatype: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(AiToolParamValueType)
  @IsNotEmpty()
  valueType: string;

  @IsNotEmpty()
  value: string;
}

export class WebhookBodySchema {
  @IsString()
  @IsNotEmpty()
  description: string;

  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => ApiParamsValueSchema)
  payloadParams: ApiParamsValueSchema[];
}

export class WebhookApiSchema {
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsNotEmpty()
  @IsEnum(AiToolRequestMethod)
  method: string;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => ApiParamsValueSchema)
  headers?: ApiParamsValueSchema[];

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => ApiParamsValueSchema)
  pathParam?: ApiParamsValueSchema[];

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => ApiParamsValueSchema)
  queryParams?: ApiParamsValueSchema[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => WebhookBodySchema)
  body?: WebhookBodySchema;
}

export class CreateAiToolDto {
  @IsEnum(AiToolType)
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  // webhook
  @ValidateIf(
    (t: CreateAiToolDto) => (t.type as AiToolType) === AiToolType.WEB_HOOK,
  )
  @IsOptional()
  @IsObject()
  dynamicVariables?: Record<string, string>;

  @ValidateIf(
    (t: CreateAiToolDto) => (t.type as AiToolType) === AiToolType.WEB_HOOK,
  )
  @IsOptional()
  @IsPositive()
  reqTimeout: number;

  @ValidateIf(
    (t: CreateAiToolDto) => (t.type as AiToolType) === AiToolType.WEB_HOOK,
  )
  @ValidateNested()
  @IsDefined()
  @IsNotEmptyObject()
  @Type(() => WebhookApiSchema)
  apiSchema: WebhookApiSchema;

  // agent
  @ValidateIf(
    (t: CreateAiToolDto) => (t.type as AiToolType) === AiToolType.AGENT,
  )
  @IsString()
  @IsNotEmpty()
  agentId: string;
}

export class UpdateAiToolDto extends CreateAiToolDto {}
