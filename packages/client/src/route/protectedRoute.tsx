import { Outlet, useNavigate } from "@tanstack/react-router";
import { useContext, useEffect } from "react";
import { AuthContext } from "../common/api/decorators/hoc/authContextProvider";
import { useMeQuery } from "../common/api/serverQueries/user/useAuthQuery";
import { Routes } from "./routes";
import Loader from "../common/components/app/loader";

export default function ProtectedRoute() {
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const { data: user, isLoading, error } = useMeQuery();

  useEffect(() => {
    if (isLoading) return;
    if (error) {
      setIsLoggedIn(false);
      navigate({
        to: Routes.LOGIN,
        replace: true,
      });
    } else if (user) {
      setIsLoggedIn(true);
    }
  }, [error, isLoading, navigate, setIsLoggedIn, user]);

  if (isLoading) {
    return (
      <Loader className="w-screen h-screen flex justify-center items-center" />
    );
  }
  return <Outlet />;
}
