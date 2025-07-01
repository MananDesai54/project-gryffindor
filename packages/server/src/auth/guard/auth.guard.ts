import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JWTUtils } from 'src/common/utils/jwtUtil';
import { AuthConstant } from '../constant/auth.constant';
import { AuthContextType } from '../dto/auth.dto';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    try {
      const httpContext = context.switchToHttp();
      const request = httpContext.getRequest<Request>();
      const authToken = request.headers?.[AuthConstant.X_AUTH_TOKEN] as string;
      if (!authToken) {
        throw new UnauthorizedException('Auth token is required');
      }
      const decodedJwt = JWTUtils.verifyToken<AuthContextType>(authToken);
      request.context = {
        ...request.context,
        authContext: decodedJwt,
      };
      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
