import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class GenerateTextDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsString()
  systemPrompt: string;
}

export class GenerateSystemPromptDto {
  @IsNotEmpty()
  @IsString()
  text: string;
}

export class ChatRequestDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  chatId: string;

  @IsObject()
  @IsOptional()
  runtimePromptVariables?: Record<string, string>;

  @IsObject()
  @IsOptional()
  runtimeApiVariables?: Record<string, string>;
}
