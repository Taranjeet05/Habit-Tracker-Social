import { z } from "zod";

export const registerSchema = z.object({
  userName: z.string().min(3, "userName must be at least 3 characters"),
  email: z.string().email("Invalid email format."),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const updateUserSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).optional(),
  emailNotification: z.boolean().optional(),
  profileImage: z.string().optional(),
  friendRequestNotifications: z.boolean().optional(),
  friendActivityNotifications: z.boolean().optional(),
  friendActivity: z.boolean().optional(),
});
