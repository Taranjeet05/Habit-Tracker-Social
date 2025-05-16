import debug from "debug";
const log = debug("app:usersController");
import { Request, Response } from "express";
import User from "../models/User.js";
import {
  loginSchema,
  registerSchema,
  updateUserSchema,
} from "../validations/user.schema.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/genrateToken.js";

// Create a new user
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
      maxAge: 7 * 24 * 60 * 60 * 1000,
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
    return;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : undefined;
    log("Error during user Registration", errorMessage);
    res.status(500).json({
      message: "Registration Failed",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};

// Authenticate user
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
      maxAge: 7 * 24 * 60 * 60 * 1000,
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
    return;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : undefined;
    log("Error during user login", errorMessage);
    res.status(500).json({
      message: "Login Failed",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};

// Get user profile by ID
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Find user by id from db
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    // Send user data
    res.status(200).json({
      message: "User found",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        profileImage: user.profileImage,
        theme: user.theme,
      },
    });
    return;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : undefined;
    log("Error finding user", errorMessage);
    res.status(500).json({
      message: "An error occurred while retrieving the user",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};

// Update user info (e.g., theme, profile image)
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parsed = updateUserSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(409).json({
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const userId = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: parsed.data },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
    return;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "undefined";
    log("Error to update", errorMessage);
    res.status(500).json({
      message: "Failed to update Profile",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};

// List user's friends
export const getUserFriends = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.id;
    const findUser = await User.findById(userId)
      .select("-password")
      .populate("friends");

    if (!findUser) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }

    res.status(200).json({
      message: "All your friends",
      user: findUser.friends,
    });
    return;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : undefined;
    log("Error finding the friend list", errorMessage);
    res.status(500).json({
      message: "Failed to access the Friend List",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    });
  }
};
