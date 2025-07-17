import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  AiWorkflowNodeConnectionType,
  AiWorkflowNodeType,
} from '../type/ai-workflow.type';
import { Type } from 'class-transformer';

class AiWorkflowEdgeSourceHandle {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(AiWorkflowNodeType)
  type: AiWorkflowNodeType;

  @IsNotEmpty()
  @IsArray()
  outputTypes: AiWorkflowNodeConnectionType[];
}

class AiWorkflowEdgeTargetHandle {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(AiWorkflowNodeType)
  type: AiWorkflowNodeType;

  @IsNotEmpty()
  @IsArray()
  inputTypes: AiWorkflowNodeConnectionType[];
}

class AiWorkflowEdgeData {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => AiWorkflowEdgeSourceHandle)
  sourceHandle: AiWorkflowEdgeSourceHandle;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => AiWorkflowEdgeTargetHandle)
  targetHandle: AiWorkflowEdgeTargetHandle;
}

export class AiWorkflowEdgeDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsNotEmpty()
  @IsString()
  source: string;

  @IsNotEmpty()
  @IsString()
  target: string;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => AiWorkflowEdgeData)
  data: AiWorkflowEdgeData;
}
