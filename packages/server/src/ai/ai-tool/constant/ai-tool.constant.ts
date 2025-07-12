import { SystemUserConstant } from '../../../core/constant/systemUser.constant';
import { AiTool, WebhookAiTool } from '../schema/ai-tool.schema';
import {
  AiBuiltInToolType,
  AiToolParamDataType,
  AiToolParamValueType,
  AiToolRequestMethod,
  AiToolType,
} from '../types/ai-tool.type';

const AiSendEmailTool = {
  name: 'Send Email tool',
  creator: SystemUserConstant.SYSTEM_USER_ID.toString(),
  description:
    'This tool allows you to send email to a user. Tool will generate subject and body based on provided context.',
  type: AiToolType.WEB_HOOK,
  apiSchema: {
    url: 'http://localhost:3000/dummy-api/send-email',
    method: AiToolRequestMethod.POST,
    body: {
      description: 'Email description',
      payloadParams: [
        {
          datatype: AiToolParamDataType.STRING,
          name: 'body',
          value:
            'This is body for the email. You can provide rich html for the body or you can provide a plain text body. Body needs to be Detailed and to the point. Make sure to include all necessary information. Do not spam too much content. Keep it concise and relevant. You can add details as well as any source links as well.',
          valueType: AiToolParamValueType.LLM_PROMPT,
        },
        {
          datatype: AiToolParamDataType.STRING,
          name: 'subject',
          value:
            'This is subject for the email. Provide Short and concise subject based on the provided context. Subject should be relevant and easy to catch user attention if needed.',
          valueType: AiToolParamValueType.LLM_PROMPT,
        },
        {
          datatype: AiToolParamDataType.STRING,
          name: 'to',
          value: 'mdesai@ontic.co',
          valueType: AiToolParamValueType.CONSTANT,
        },
      ],
    },
  },
  isStandard: true,
  dynamicVariables: { to: '' },
} as Partial<WebhookAiTool>;

const AiWebSearchTool: Partial<AiTool> = {
  creator: SystemUserConstant.SYSTEM_USER_ID.toString(),
  description:
    'This allows you to do research on web using search engines. You can provide search query and get relevant results.',
  name: 'Web Search tool',
  type: AiBuiltInToolType.WEB_SEARCH,
  isStandard: true,
};

export class AiToolConstants {
  static readonly AI_WEB_HOOK_TOOL_DEFAULT_REQ_TIMEOUT = 20000; // 20 seconds

  static readonly STANDARD_TOOLS: Partial<AiTool>[] = [
    AiSendEmailTool,
    AiWebSearchTool,
  ];
}
