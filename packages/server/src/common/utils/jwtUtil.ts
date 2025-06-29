import { UnauthorizedException } from '@nestjs/common';
import jwt from 'jsonwebtoken';

export class JWTUtils {
  static async generateToken(payload: any): Promise<string> {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
  }

  static async verifyToken<T>(token: string): Promise<T> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded as T;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
