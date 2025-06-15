import express from "express";
import authRoutes from "./auth.js";
import workspaceRoutes from "./workspace.js";

const router = express.Router();

router.use("/auth", authRoutes); // Mounts /api/auth routes
router.use("/workspaces",workspaceRoutes);

export default router;
