import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class GenerateTextDto {
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
  runtimeVariables?: Record<string, string>;
}
