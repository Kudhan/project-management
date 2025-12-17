import express from "express";
import { signupUser, signinUser, verifyOtp, resendOtp, forgotPassword, resetPassword } from "../controllers/authController.js";

const router = express.Router();
router.post("/sign-up", signupUser);
router.post("/sign-in", signinUser);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;


