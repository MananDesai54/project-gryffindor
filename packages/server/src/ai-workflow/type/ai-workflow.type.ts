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
