import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { ApiParamsValueSchema } from 'src/ai/ai-tool/dto/ai-tool.dto';
import { MCPServerApprovalPolicy } from '../types/mcp-server.type';

export class CreateMCPServerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(MCPServerApprovalPolicy)
  @IsNotEmpty()
  approvalPolicy: MCPServerApprovalPolicy;

  @IsUrl({ require_tld: false })
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  transport: string;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => ApiParamsValueSchema)
  requestHeaders?: ApiParamsValueSchema[];
}
