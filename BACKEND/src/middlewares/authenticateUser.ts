import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import debug from "debug";
import User from "../models/User.js";
const log = debug("app:authMiddleware");

interface JwtPayload {
  userId: string;
  email: string;
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // 1. Get token from cookies or Authorization header
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Authentication required. Please login.",
    });
    return;
  }

  // 2. Verify JWT_SECRET exists
  if (!process.env.SECRET) {
    log("JWT_SECRET not configured");
    res.status(500).json({
      success: false,
      message: "Server configuration error",
    });
    return;
  }

  try {
    // 3. Verify token
    const decoded = jwt.verify(token, process.env.SECRET) as JwtPayload;

    // 4. Find user by ID
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User not found. Please login again.",
      });
      return;
    }

    // 5. Attach user to request
    req.user = user;

    next();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    // 6. Handle specific JWT errors
    let message = "Invalid token. Please login again.";

    if (error instanceof jwt.TokenExpiredError) {
      message = "Session expired. Please login again.";
    } else if (error instanceof jwt.JsonWebTokenError) {
      message = "Invalid token. Please login again.";
    }

    log("Authentication error:", error);

    // 7. Clear invalid token cookie
    res.clearCookie("token");

    res.status(401).json({
      success: false,
      message,
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};
