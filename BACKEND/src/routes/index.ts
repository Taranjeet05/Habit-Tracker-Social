import express, { Request, Response } from "express";
const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send("🌍 Hello from Habit Tracker backend!");
});

export default router;
