import express, { Request, Response } from "express";
const router = express.Router();
import {
  getUserById,
  loginUser,
  registerUser,
  updateUser,
} from "../controllers/usersController.js";
import { authenticateUser } from "../middlewares/authenticateUser.js";

// Test route
router.get("/", (req: Request, res: Response) => {
  res.send("Hello from the Users Router");
});

// Endpoint -> "/api/users"
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:id", authenticateUser, getUserById);
router.patch("/:id", authenticateUser, updateUser);

export default router;
