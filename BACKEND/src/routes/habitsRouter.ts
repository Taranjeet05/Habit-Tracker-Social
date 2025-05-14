import express, { Request, Response } from "express";
import { createHabit, getHabitById, getHabitsByUser } from "../controllers/habitsController.js";
import { authenticateUser } from "../middlewares/authenticateUser.js";
const router = express.Router();



// Endpoint -> "/api/habits"
router.post("/", authenticateUser, createHabit);
router.get("/", authenticateUser , getHabitsByUser )
router.get("/:id", authenticateUser, getHabitById);

export default router;
