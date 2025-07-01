import { AuthContext } from "@gryffindor/client/common/api/decorators/hoc/authContextProvider";
import { NotifyError } from "@gryffindor/client/common/components/app/toast";
import { Button } from "@gryffindor/client/common/components/shadcn/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gryffindor/client/common/components/shadcn/components/ui/card";
import { Input } from "@gryffindor/client/common/components/shadcn/components/ui/input";
import { Label } from "@gryffindor/client/common/components/shadcn/components/ui/label";
import { Routes } from "@gryffindor/client/route/routes";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useContext, useEffect, useState } from "react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setIsLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    setIsLoggedIn(false);
  }, [setIsLoggedIn]);

  const onLogin = useCallback(() => {
    if (!email || !password) {
      NotifyError("Login error", "Email and password are required");
      return;
    }
    if (email === "mdesai@ontic.co" && password === "password") {
      navigate({
        to: Routes.HOME,
      });
    } else {
      NotifyError("Login error", "Invalid email or password");
    }
  }, [email, navigate, password]);

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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
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
