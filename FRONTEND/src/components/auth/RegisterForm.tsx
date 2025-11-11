import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../../api/userApi";
import { useUserStore } from "../../store/useUserStore";

const RegisterForm = () => {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      if (data.success && data.data) {
        const user = data.data.user;
        const token = data.data.token;

        //save to localStorage
        localStorage.setItem("token", token ?? "");

        // set Zustand :
        setUser({
          userId: user._id,
          userName: user.userName,
          email: user.email,
          profileImage: user.profileImage ?? null,
          isAuthenticated: true,
        });
        navigate("/dashboard");
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Password and Confirm password must be exactly same");
      return;
    }

    mutate({
      userName: name,
      email,
      password,
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>
          Enter your information to create your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {isError && (
            <p className="text-red-500 text-sm">
              {error?.message || "Something went wrong"}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button type="submit" className="w-full">
            {isPending ? "Creating Account..." : "Register"}
          </Button>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <a
              href="#"
              className="text-accent hover:underline"
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
            >
              Login
            </a>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default RegisterForm;
