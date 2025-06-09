import express from "express";
import authRoutes from "./auth.js";

const router = express.Router();

router.use("/auth", authRoutes); // Mounts /api/auth routes

export default router;
