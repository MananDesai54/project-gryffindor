import { IsEmail, IsString } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class AuthContextType {
  email: string;
  userId: string;
}

export class LoginSuccessDto extends AuthContextType {
  token: string;
}
