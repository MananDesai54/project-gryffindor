import { DynamicStructuredTool } from '@langchain/core/tools';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { z } from 'zod';
import { WebhookAiTool } from '../../ai-tool/schema/ai-tool.schema';

interface ToolInput {
  queryParams?: Record<string, string>;
  body?: Record<string, any>;
  headers?: Record<string, string>;
}

@Injectable()
export class AiToolFactory {
  createWebhookTool(tool: WebhookAiTool): DynamicStructuredTool {
    const inputSchema = z.object({
      queryParams: z
        .record(z.string())
        .optional()
        .describe(
          tool.apiSchema?.queryParams
            ? `This is information about the query parameters: ${JSON.stringify(tool.apiSchema.queryParams)}`
            : 'Key-value pairs for URL query parameters.',
        ),

      body: z
        .record(z.any())
        .optional()
        .describe(
          tool.apiSchema?.body
            ? `${tool.apiSchema?.body?.description}\n This is information about the body: ${JSON.stringify(tool.apiSchema.body.payloadParams)}`
            : 'Key-value pairs for body.',
        ),

      headers: z
        .record(z.string())
        .optional()
        .describe(
          tool.apiSchema?.headers
            ? `This is information about the headers: ${JSON.stringify(tool.apiSchema.headers)}`
            : 'Key-value pairs for URL headers.',
        ),
    }) satisfies z.ZodType<ToolInput>;

    return new DynamicStructuredTool({
      name: tool.name,
      description: `${tool.description}. Use this tool for requests requiring a ${tool.apiSchema.method} to ${tool.apiSchema.url}. The input should be a JSON string representing the request payload, or an empty string for GET requests.`,
      schema: inputSchema,
      func: async (input: ToolInput) => {
        const { queryParams, body, headers } = input;

        try {
          const response = await axios({
            method: tool.apiSchema.method,
            url: tool.apiSchema.url,
            headers: headers,
            params: queryParams,
            data: body,
          });

          return JSON.stringify(response.data);
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            return `Error: Request failed with status ${error.response.status}. Response data: ${JSON.stringify(error.response.data)}`;
          }
          return `Error calling webhook '${tool.name}': ${error}`;
        }
      },
    });
  }
}
