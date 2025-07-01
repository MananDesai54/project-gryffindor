import { DbDocument } from "./dbDocument.type";

export interface User extends DbDocument {
  username: string;
  email: string;
}

export type AuthResponse = {
  token: string;
  email: string;
  userId: string;
};
