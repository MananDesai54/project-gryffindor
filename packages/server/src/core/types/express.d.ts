declare namespace Express {
  export interface Request {
    context?: {
      authContext?: import('../auth/dto/auth.dto').AuthContextType;
    };
  }
}
