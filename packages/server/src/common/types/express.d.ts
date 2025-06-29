declare namespace Express {
  export interface Request {
    context?: {
      authContext?: import('src/auth/dto/auth.dto').AuthContextType;
    };
  }
}
