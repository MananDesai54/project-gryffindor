import { DynamicStructuredTool } from '@langchain/core/tools';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { z } from 'zod';
import { WebhookAiTool } from '../../ai-tool/schema/ai-tool.schema';
import {
  AiToolParamDataType,
  AiToolParamValueType,
} from '../types/ai-tool.type';
import { ApiParamsValueSchema } from '../dto/ai-tool.dto';

interface ToolInput {
  queryParams?: Record<string, string>;
  body?: Record<string, any>;
  headers?: Record<string, string>;
  url: string;
}

export function generateZodSchemaFromApiDef(
  paramSchema: ApiParamsValueSchema[],
  runTimeApiVariables?: Record<string, string>,
): z.ZodObject<any> | null {
  if (!paramSchema || paramSchema?.length === 0) {
    return null;
  }

  const zodShape: Record<string, z.ZodTypeAny> = {};

  for (const schema of paramSchema) {
    let fieldSchema: z.ZodTypeAny;

    // 1. Map your stored type string to a Zod schema type
    switch (schema.datatype as AiToolParamDataType) {
      case AiToolParamDataType.NUMBER:
        fieldSchema = z.number();
        break;
      case AiToolParamDataType.BOOLEAN:
        fieldSchema = z.boolean();
        break;
      case AiToolParamDataType.STRING:
      default:
        fieldSchema = z.string();
        break;
    }

    fieldSchema = fieldSchema.describe(
      `name of field is ${schema.name}. description: ${schema.description}. If param valuetype is ${AiToolParamValueType.DYNAMIC_VARIABLE} then you can use ${JSON.stringify(runTimeApiVariables)}`,
    );

    fieldSchema = fieldSchema.optional();

    zodShape[schema.name] = fieldSchema;
  }

  return z.object(zodShape);
}

@Injectable()
export class AiToolFactory {
  private readonly logger = new Logger(AiToolFactory.name);

  createWebhookTool(
    tool: WebhookAiTool,
    runTimeApiVariables?: Record<string, string>,
  ): DynamicStructuredTool {
    const bodySchema = generateZodSchemaFromApiDef(
      tool.apiSchema.body?.payloadParams,
      runTimeApiVariables,
    );

    const headersSchema = generateZodSchemaFromApiDef(
      tool.apiSchema.headers,
      runTimeApiVariables,
    );
    const queryParamsSchema = generateZodSchemaFromApiDef(
      tool.apiSchema.queryParams,
      runTimeApiVariables,
    );

    const inputSchema = z.object({
      queryParams: queryParamsSchema || z.undefined(),
      body:
        bodySchema?.describe(tool.apiSchema?.body?.description || '') ||
        z.undefined(),
      headers: headersSchema || z.undefined(),
      url: z
        .string()
        .url()
        .describe(
          `The URL to send the request to. Based on query please Create a valid api url using ${tool.apiSchema.url} and ${JSON.stringify(tool.apiSchema.pathParam)}. If param is ${AiToolParamValueType.DYNAMIC_VARIABLE} then you can use ${JSON.stringify(runTimeApiVariables)}. Consider the request method as ${tool.apiSchema.method}`,
        ),
    }) satisfies z.ZodType<ToolInput>;

    return new DynamicStructuredTool({
      name: tool.name,
      description: `${tool.description}. Use this tool for requests requiring a ${tool.apiSchema.method} to ${tool.apiSchema.url}. The input should be a JSON string representing the request payload, or an empty string for GET requests. This are runtime variables that can be used: ${JSON.stringify(runTimeApiVariables)}`,
      schema: inputSchema,
      func: async (input: ToolInput) => {
        const { queryParams, body, headers, url } = input;

        this.logger.log('Ai webhook tool call');
        this.logger.log({ input });
        try {
          const response = await axios({
            method: tool.apiSchema.method,
            url,
            headers,
            params: queryParams,
            data: body,
          });
          this.logger.log('Ai webhook tool call success', response.data);

          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          return JSON.stringify({ response: response.data });
        } catch (error) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          this.logger.log({ error, message: 'Ai webhook tool call error' });
          if (axios.isAxiosError(error) && error.response) {
            return `Error: Request failed with status ${error.response.status}. Response data: ${JSON.stringify(error.response.data)}`;
          }
          return `Error calling webhook '${tool.name}': ${error}`;
        }
      },
    });
  }
}
