import { IsEmail, IsString } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class LoginSuccessDto {
  token: string;
  email: string;
}
