import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AiWorkflowEdgeDto } from './workflow-edge.dto';
import {
  AiWorkflowNodeDto,
  AIWorkflowXYPositionDto,
} from './workflow-node.dto';

class AiWorkflowViewport extends AIWorkflowXYPositionDto {
  @IsPositive()
  @IsNotEmpty()
  zoom: number;
}

class AIWorkflowDataDto {
  @IsArray()
  @ValidateNested()
  @Type(() => AiWorkflowNodeDto)
  nodes: Array<AiWorkflowNodeDto>;

  @IsArray()
  @ValidateNested()
  @Type(() => AiWorkflowEdgeDto)
  edges: Array<AiWorkflowEdgeDto>;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => AiWorkflowViewport)
  viewport: AiWorkflowViewport;
}

export class CreateAIWorkflowDto {
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AIWorkflowDataDto)
  data?: AIWorkflowDataDto;
}

export class UpdateAiWorkflowDto extends CreateAIWorkflowDto {}
