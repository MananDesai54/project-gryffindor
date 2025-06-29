import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JWTUtils } from 'src/common/utils/jwtUtil';
import { AuthConstant } from '../constant/auth.constant';
import { AuthContextType } from '../dto/auth.dto';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const httpContext = context.switchToHttp();
      const request = httpContext.getRequest<Request>();
      const authToken = request.headers?.[AuthConstant.X_AUTH_TOKEN] as string;
      if (!authToken) {
        throw new UnauthorizedException('Auth token is required');
      }
      const decodedJwt = await JWTUtils.verifyToken<AuthContextType>(authToken);
      request.context = {
        ...request.context,
        authContext: decodedJwt,
      };
      return true;
    } catch (error) {
      throw new UnauthorizedException(`Unauthorized: ${error.message}`);
    }
  }
}
