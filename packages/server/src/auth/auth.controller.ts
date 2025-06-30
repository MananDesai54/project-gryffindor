import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthContextType, LoginUserDto } from './dto/auth.dto';
import { AuthContext } from './decorators/authContext';
import { AuthGuard } from './guard/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(@Inject() private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body(ValidationPipe) loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  me(@AuthContext() ctx: AuthContextType) {
    return this.authService.me(ctx);
  }
}
