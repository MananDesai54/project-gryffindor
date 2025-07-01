import { noop } from "lodash";
import { createContext } from "react";

export type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
};

export const AuthContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: noop,
});

export default function AuthContextProvider({
  children,
  isLoggedIn,
  setIsLoggedIn,
}: {
  children: React.ReactNode;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}) {
  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}
