import AppRouterProvider from "@gryffindor/client/route/routeConfig";
import { useState } from "react";
import AuthContextProvider from "./common/api/decorators/hoc/authContextProvider";
import { AuthUtils } from "./common/utils/authUtils";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(AuthUtils.isLoggedIn());

  return (
    <AuthContextProvider isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
      <AppRouterProvider />
    </AuthContextProvider>
  );
}

export default App;
