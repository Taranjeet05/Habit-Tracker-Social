import express, { Request, Response } from "express";
const router = express.Router();
import { registerUser } from "../controllers/usersController.js";

// Test route
router.get("/", (req: Request, res: Response) => {
  res.send("Hello form the Users Router");
});

// User registration route
router.post("/register", registerUser);

export default router;
