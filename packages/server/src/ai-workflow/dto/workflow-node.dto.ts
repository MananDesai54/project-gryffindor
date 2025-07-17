import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  AiWorkflowNodeCategory,
  AiWorkflowNodeConnectionType,
  AiWorkflowNodeInputFieldValueType,
  AiWorkflowNodeType,
} from '../type/ai-workflow.type';

export class AIWorkflowXYPositionDto {
  @IsPositive()
  x: number;

  @IsPositive()
  y: number;
}

class AiWorkflowNodeInputField {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsEnum(AiWorkflowNodeConnectionType)
  type: AiWorkflowNodeConnectionType;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(AiWorkflowNodeInputFieldValueType)
  valueType?: AiWorkflowNodeInputFieldValueType;

  @IsOptional()
  defaultValue?: any;

  @IsOptional()
  @IsArray()
  injectInputTypes?: AiWorkflowNodeConnectionType[];

  @IsOptional()
  @IsArray()
  @Type(() => String)
  options?: string[];

  @IsOptional()
  value?: any;

  @IsOptional()
  @IsBoolean()
  toolMode?: boolean;

  @IsOptional()
  @IsString()
  placeholder?: string;

  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @IsOptional()
  @IsBoolean()
  disabled?: boolean;
}

class AiWorkflowNodeOutput {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsArray()
  outputTypes: AiWorkflowNodeConnectionType[];

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  toolMode?: boolean;
}

class AiWorkflowNodeMetadata {
  @IsOptional()
  @IsArray()
  @Type(() => String)
  fieldOrder?: string[];

  @IsOptional()
  @IsObject()
  @Type(() => Map<string, AiWorkflowNodeInputField>)
  inputFields?: Record<string, AiWorkflowNodeInputField>;

  @IsOptional()
  @IsArray()
  @Type(() => AiWorkflowNodeOutput)
  outputs?: Array<AiWorkflowNodeOutput>;
}

class AiWorkflowNodeData {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsEnum(AiWorkflowNodeCategory)
  category: AiWorkflowNodeCategory;

  @IsNotEmpty()
  @IsEnum(AiWorkflowNodeType)
  type: AiWorkflowNodeType;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AiWorkflowNodeMetadata)
  node?: AiWorkflowNodeMetadata;
}

export class AiWorkflowNodeDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AIWorkflowXYPositionDto)
  position: AIWorkflowXYPositionDto;

  @IsString()
  @IsOptional()
  type?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AiWorkflowNodeData)
  data?: AiWorkflowNodeData;
}
