import { UnauthorizedException } from '@nestjs/common';
import jwt from 'jsonwebtoken';

export class JWTUtils {
  static generateToken(payload: any): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
  }

  static verifyToken<T>(token: string): T {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded as T;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
