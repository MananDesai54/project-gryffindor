import AppRouterProvider from "@gryffindor/client/route/routeConfig";
import { useCallback, useEffect, useState } from "react";
import AuthContextProvider from "./common/api/decorators/hoc/authContextProvider";
import { AuthUtils } from "./common/utils/authUtils";
import ThemeProvider, {
  Theme,
} from "./common/api/decorators/hoc/themeProvider";
import { LocalStorageUtils } from "./common/utils/localStorageUtils";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(AuthUtils.isLoggedIn());
  const [userId, setUserId] = useState<string>("");
  const [theme, setTheme] = useState<Theme>(
    (LocalStorageUtils.getItem("theme") as Theme) || Theme.dark,
  );

  const updateTheme = useCallback((theme: Theme) => {
    setTheme(theme);
    LocalStorageUtils.setItem("theme", theme);
  }, []);

  useEffect(() => {
    document.body.className = theme || Theme.dark;
  }, [theme]);

  return (
    <AuthContextProvider
      isLoggedIn={isLoggedIn}
      setIsLoggedIn={setIsLoggedIn}
      setUserId={setUserId}
      userId={userId}
    >
      <ThemeProvider theme={theme || Theme.dark} setTheme={updateTheme}>
        <AppRouterProvider />
      </ThemeProvider>
    </AuthContextProvider>
  );
}

export default App;
