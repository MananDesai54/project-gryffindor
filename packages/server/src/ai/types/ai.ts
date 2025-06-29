export enum KnowledgeBaseType {
  TEXT = 'TEXT',
  LINK = 'LINK',
  FILE = 'FILE',
}

export enum AiToolType {
  WEB_HOOK = 'WEB_HOOK',
  AGENT = 'AGENT',
}

export enum AiBuiltInToolType {
  WEB_SEARCH = 'WEB_SEARCH',
  DEEP_RESEARCH = 'DEEP_RESEARCH',
  CODE_INTERPRETER = 'CODE_INTERPRETER',
  STRUCTURED_OUTPUT = 'STRUCTURED_OUTPUT',
  FUNCTION_CALL = 'FUNCTION_CALL',
}

export enum LLMType {
  STANDARD = 'STANDARD',
  CUSTOM = 'CUSTOM',
}

export enum StandardLLMProvider {
  OPENAI = 'OPENAI',
  GOOGLE = 'GOOGLE',
  ANTHROPIC = 'ANTHROPIC',
}
