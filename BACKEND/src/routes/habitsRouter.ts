import express, { Request, Response } from "express";
import { createHabit } from "../controllers/habitsController.js";
const router = express.Router();

// Test route
router.get("/", (req: Request, res: Response) => {
  res.send("Hello from the habitsRouter");
});

// Endpoint -> "/api/habits"
router.post("/", createHabit);

export default router;
