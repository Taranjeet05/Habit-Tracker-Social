import express, { Request, Response } from "express";
const router = express.Router();
import { loginUser, registerUser } from "../controllers/usersController.js";

// Test route
router.get("/", (req: Request, res: Response) => {
  res.send("Hello from the Users Router");
});

// Endpoint -> "/api/users"
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
