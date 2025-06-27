import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Routes } from "@/routes/routes";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = useCallback(() => {
    if (!email || !password) {
      toast("Login error", {
        description: "Email and password are required",
        position: "bottom-center",
        duration: 3000,
        dismissible: true,
      });
      return;
    }
    if (email === "mdesai@ontic.co" && password === "password") {
      navigate({
        to: Routes.HOME,
      });
    } else {
      toast("Login error", {
        description: "Invalid email or password",
        position: "bottom-center",
        duration: 3000,
        dismissible: true,
      });
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
            </div>
            <Button type="submit" className="w-full gap-2">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
