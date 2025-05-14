import express, { Request, Response } from "express";
import { createHabit, getHabitsByUser } from "../controllers/habitsController.js";
import { authenticateUser } from "../middlewares/authenticateUser.js";
const router = express.Router();



// Endpoint -> "/api/habits"
router.post("/", authenticateUser, createHabit);
router.get("/user/:userId", authenticateUser , getHabitsByUser )

export default router;
