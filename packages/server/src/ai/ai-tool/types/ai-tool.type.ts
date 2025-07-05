export enum AiBuiltInToolType {
  WEB_SEARCH = 'WEB_SEARCH',
  DEEP_RESEARCH = 'DEEP_RESEARCH',
  CODE_INTERPRETER = 'CODE_INTERPRETER',
  STRUCTURED_OUTPUT = 'STRUCTURED_OUTPUT',
  FUNCTION_CALL = 'FUNCTION_CALL',
}

export enum AiToolType {
  WEB_HOOK = 'WEB_HOOK',
  AGENT = 'AGENT',
}

export enum AiToolRequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export enum AiToolParamDataType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
}

export enum AiToolParamValueType {
  DYNAMIC_VARIABLE = 'DYNAMIC_VARIABLE',
  LLM_PROMPT = 'LLM_PROMPT',
  CONSTANT = 'CONSTANT',
}
