import { noop } from "lodash";
import { createContext } from "react";

export enum Theme {
  dark = "dark",
  light = "light",
}

export const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({
  theme: Theme.dark,
  setTheme: noop,
});

export default function ThemeProvider({
  children,
  theme,
  setTheme,
}: {
  children: React.ReactNode;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}) {
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
