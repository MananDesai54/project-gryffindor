import { AuthContext } from "@gryffindor/client/common/api/decorators/hoc/authContextProvider";
import { useLoginMutation } from "@gryffindor/client/common/api/serverQueries/user/useAuthMutation";
import FormInput from "@gryffindor/client/common/components/app/formInput";
import { NotifyError } from "@gryffindor/client/common/components/app/toast";
import { Button } from "@gryffindor/client/common/components/shadcn/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gryffindor/client/common/components/shadcn/components/ui/card";
import { AuthResponse } from "@gryffindor/client/common/types/user.type";
import { AuthUtils } from "@gryffindor/client/common/utils/authUtils";
import { Routes } from "@gryffindor/client/route/routes";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useContext, useEffect, useState } from "react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setIsLoggedIn } = useContext(AuthContext);

  const { mutate } = useLoginMutation({
    onError: (error) => {
      NotifyError("Login error", error.message || "Invalid email or password");
    },
    onSuccess: (data?: AuthResponse) => {
      data?.token && AuthUtils.setAuthToken(data.token);
      setIsLoggedIn(true);
      navigate({
        to: Routes.HOME,
      });
    },
  });

  useEffect(() => {
    setIsLoggedIn(false);
  }, [setIsLoggedIn]);

  const onLogin = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!email || !password) {
        NotifyError("Login error", "Email and password are required");
        return;
      }
      mutate({
        email,
        password,
      });
    },
    [email, mutate, password],
  );

  return (
    <div className="w-full h-full flex justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Use your email & password below to login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <FormInput
                  label="Email"
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <FormInput
                  label="Password"
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>
              <Button type="submit" className="w-full gap-2">
                Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
