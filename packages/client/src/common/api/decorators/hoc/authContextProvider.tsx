import { noop } from "lodash";
import { createContext } from "react";

export type AuthContextType = {
  isLoggedIn: boolean;
  userId: string;
  setUserId: (userId: string) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
};

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: "",
  setUserId: noop,
  setIsLoggedIn: noop,
});

export default function AuthContextProvider({
  children,
  isLoggedIn,
  setIsLoggedIn,
  userId = "",
  setUserId,
}: {
  children: React.ReactNode;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  userId: string;
  setUserId: (userId: string) => void;
}) {
  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, setUserId, userId }}
    >
      {children}
    </AuthContext.Provider>
  );
}
