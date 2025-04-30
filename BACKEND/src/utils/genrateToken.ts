import jwt from "jsonwebtoken";

interface GenerateTokenProps {
  user: {
    email: string;
    id: string;
  };
}

export const generateToken = (user: GenerateTokenProps["user"]): string => {
  if (!process.env.SECRET) {
    throw new Error("JWT secret is not defined in environment variables");
  }

  return jwt.sign({ email: user.email, id: user.id }, process.env.SECRET, {
    expiresIn: "7d",
  });
};
