import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginSuccessDto, LoginUserDto } from './dto/auth.dto';
import { EncryptionUtil } from 'src/common/utils/encryptionUtil';
import { JWTUtils } from 'src/common/utils/jwtUtil';

@Injectable()
export class AuthService {
  constructor(@Inject() private readonly userService: UserService) {}

  async login(loginUserDto: LoginUserDto): Promise<LoginSuccessDto> {
    const user = await this.userService.getUserForAuthentication(
      loginUserDto.email,
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid = await EncryptionUtil.compareHashedPassword(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const userJwtToken = await JWTUtils.generateToken({
      email: user.email,
      userId: user._id,
    });
    return {
      token: userJwtToken,
      email: user.email,
      userId: user._id,
    };
  }
}
