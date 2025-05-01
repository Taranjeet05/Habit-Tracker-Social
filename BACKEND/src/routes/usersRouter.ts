import express, { Request, Response } from "express";
const router = express.Router();
import { loginUser, registerUser } from "../controllers/usersController.js";

// Endpoint -> "/api/users"

// Test route
router.get("/", (req: Request, res: Response) => {
  res.send("Hello from the Users Router");
});

// User registration route
router.post("/register", registerUser);

// User login route
router.post("/login", loginUser);

export default router;
