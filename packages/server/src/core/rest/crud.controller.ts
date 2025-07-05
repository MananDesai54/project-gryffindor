import { AuthContextType } from 'src/auth/dto/auth.dto';

export interface CRUDController<T> {
  create(data: Partial<T>, ctx: AuthContextType): Promise<T>;
  read(id: string): Promise<T>;
  delete(id: string, ctx: AuthContextType): Promise<T>;
  update(id: string, data: Partial<T>, ctx: AuthContextType): Promise<T>;
}

export interface CRUDService<T> {
  create(data: Partial<T>, ctx: AuthContextType): Promise<T>;
  read(id: string): Promise<T>;
  delete(id: string, ctx: AuthContextType): Promise<T>;
  update(id: string, data: Partial<T>, ctx: AuthContextType): Promise<T>;
}
