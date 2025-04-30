import debug from "debug";
const log = debug("app:usersController");
import { Request, Response } from "express";
import User from "../models/User.js";
import { registerSchema } from "../validations/user.schema.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/genrateToken.js";

export const registerUser = async (req: Request, res: Response) => {
  try {
    // Zod validation
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ errors: parsed.error.flatten().fieldErrors });
    }
    // Check if user already exists
    const { userName, email, password } = parsed.data;
    const existingUser = await User.findOne({ $or: [{ userName }, { email }] });
    if (existingUser) {
      return res
        .status(401)
        .json({ message: "UserName or Email already in use." });
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
    res.cookie("token", token);
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
    throw new Error("User registration failed");
  }
};
