import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
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

  @IsObject()
  @IsOptional()
  requestHeaders?: Record<string, string>;
}
