import express from "express";
import { validateRequest } from "zod-express-middleware";
import {
  createWorkspace,
  getWorkspaces
  
} from "../controllers/workspace.js";
import {
  workspaceSchema,
} from "../libs/validate-schema.js";
import authMiddleware from "../middleware/auth-middleware.js";
import { z } from "zod";


const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validateRequest({ body: workspaceSchema }),
  createWorkspace
);

router.get("/",authMiddleware,getWorkspaces);
export default router;
