import { DbDocument } from '../dbDocument.type';
import { ApiParamsValueSchema } from './tool.type';

export enum MCPServerApprovalPolicy {
  ALWAYS_ASK = 'ALWAYS_ASK',
  FINE_GRAINED = 'FINE_GRAINED',
  NO_APPROVAL = 'NO_APPROVAL',
}

export interface McpServer extends DbDocument {
  name: string;
  description: string;
  url: string;
  transport: string;
  approvalPolicy: MCPServerApprovalPolicy;
  requestHeaders?: ApiParamsValueSchema[];
}
