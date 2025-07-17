export enum AiWorkflowNodeCategory {
  IO = 'io',
  LLM = 'llm',
  Agent = 'agent',
  Data = 'data',
}

export enum AiWorkflowNodeType {
  ChatInput = 'chatInput',
  ChatOutput = 'chatOutput',
  TextInput = 'textInput',
  TextOutput = 'textOutput',

  Agent = 'agent',
  LLM = 'llm',

  URL = 'url',
  File = 'file',
  WebSearch = 'webSearch',
  WebApi = 'webApi',
}

export enum AiWorkflowNodeInputFieldValueType {
  string = 'string',
  number = 'number',
  boolean = 'boolean',
  array = 'array',
  object = 'object',
  connection = 'connection',
}

export enum AiWorkflowNodeConnectionType {
  Message = 'message',
  Tool = 'tool',
}
