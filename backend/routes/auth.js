import express from "express";
import { signupUser,signinUser,verifyEmail } from "../controllers/authController.js";

const router = express.Router();
router.post("/sign-up",signupUser);
router.post("/sign-in",signinUser);
router.post("/verify-email?",verifyEmail);

export default router;


