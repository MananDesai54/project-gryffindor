import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

  @IsNotEmpty()
  @IsString()
  sourceHandle: string;

  @IsNotEmpty()
  @IsString()
  targetHandle: string;
}
