import debug from "debug";
const log = debug("app:usersController");
import { Request, Response } from "express";
import User from "../models/User.js";
import { loginSchema, registerSchema } from "../validations/user.schema.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/genrateToken.js";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Zod validation
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(409).json({ errors: parsed.error.flatten().fieldErrors });
      return;
    }
    // Check if user already exists
    const { userName, email, password } = parsed.data;
    const existingUser = await User.findOne({ $or: [{ userName }, { email }] });
    if (existingUser) {
      res.status(401).json({ message: "UserName or Email already in use." });
      return;
    }
    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);
    // Create user
    const newUser = await User.create({
      userName,
      email,
      password: hashPassword,
    });
    // Create JWT token
    const token = generateToken(newUser);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400000, // 1 day
    });
    // Send response
    res.status(201).json({
      message: "User registered successfully 🎉",
      token,
      user: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        profileImage: newUser.profileImage,
        theme: newUser.theme,
      },
    });
  } catch (error: any) {
    log("Error during user registration:", error.message);
    res.status(500).json({
      message: "Registration Failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Zod validation
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, password } = parsed.data;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // Generate token
    const token = generateToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400000, // 1 day
    });

    // Success response
    res.status(200).json({
      message: "Login successful 🎉",
      token,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        profileImage: user.profileImage,
        theme: user.theme,
      },
    });
  } catch (error: any) {
    log("Error during user login:", error.message);
    res.status(500).json({
      message: "Login Failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
