import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Verification from "../models/verification.js";
import { sendEmail } from "../libs/send-email.js";
import aj from "../libs/arcjet.js";

// Helper to generate 6 digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const signupUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    const decision = await aj.protect(req, { email });
    if (decision.isDenied() && decision.reason.isRateLimit()) {
      return res.status(403).json({ message: "Rate limit exceeded" });
    }

    if (!email || !name || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If user exists but not verified, we could resend OTP, but for security just say exists
      // Or if we want to support retry signup: check if !isEmailVerified and update
      if (!existingUser.isEmailVerified) {
        const otp = generateOTP();
        const hashedOtp = await bcrypt.hash(otp, 10);
        existingUser.verificationOtp = hashedOtp;
        existingUser.verificationOtpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
        existingUser.name = name;
        existingUser.password = await bcrypt.hash(password, 10);
        await existingUser.save();

        await sendEmail(email, "Verify your account", `<p>Your verification code is: <b>${otp}</b></p>`);

        return res.status(200).json({
          message: "Verification code sent to email",
          status: "pending_verification",
          email: email
        });
      }

      return res.status(400).json({ message: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);

    const newUser = await User.create({
      email,
      name,
      password: hashedPassword,
      verificationOtp: hashedOtp,
      verificationOtpExpires: Date.now() + 10 * 60 * 1000 // 10 mins
    });

    await sendEmail(email, "Verify your account", `<p>Your verification code is: <b>${otp}</b></p>`);

    res.status(201).json({
      message: "Account created. Please check your email for verification code.",
      status: "pending_verification",
      email: newUser.email
    });

  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

const signinUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid Email Or Password" });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Email not verified. Please verify your account.",
        status: "pending_verification",
        email: user.email
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Email Or Password" });
    }

    const token = jwt.sign(
      { userId: user._id, purpose: "login" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    user.lastLogin = new Date();
    await user.save();

    const userData = user.toObject();
    delete userData.password;
    delete userData.twoFAOtp;
    delete userData.verificationOtp;

    res.status(200).json({ message: "Login Successful", token, user: userData });

  } catch (err) {
    console.error("Error during signin:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email }).select("+verificationOtp +verificationOtpExpires");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isEmailVerified && !user.verificationOtp) {
      return res.status(400).json({ message: "User already verified" });
    }

    if (!user.verificationOtp || !user.verificationOtpExpires) {
      return res.status(400).json({ message: "No OTP request found" });
    }

    if (user.verificationOtpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const isValid = await bcrypt.compare(otp, user.verificationOtp);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isEmailVerified = true;
    user.verificationOtp = undefined;
    user.verificationOtpExpires = undefined;
    await user.save();

    // Generate token for auto-login after verification
    const token = jwt.sign(
      { userId: user._id, purpose: "login" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userData = user.toObject();
    delete userData.password;
    delete userData.verificationOtp;

    res.status(200).json({ message: "Email verified successfully", token, user: userData });

  } catch (error) {
    console.error("Error verification:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.verificationOtp = hashedOtp;
    user.verificationOtpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail(email, "Resend Verification Code", `<p>Your verification code is: <b>${otp}</b></p>`);

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // For security, checking user existence blindly is risky but standard in simple apps.
      // Better to always say "If email exists, code sent"
      return res.status(200).json({ message: "If account exists, OTP sent" });
    }

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);

    // We can reuse verificationOtp fields or add specific reset fields. 
    // Reusing is fine if flows don't overlap destructively.
    user.verificationOtp = hashedOtp;
    user.verificationOtpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail(email, "Reset Password", `<p>Your password reset code is: <b>${otp}</b></p>`);

    res.status(200).json({ message: "OTP sent to email" });

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email }).select("+verificationOtp +verificationOtpExpires");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.verificationOtp || user.verificationOtpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const isValid = await bcrypt.compare(otp, user.verificationOtp);
    if (!isValid) return res.status(400).json({ message: "Invalid OTP" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.verificationOtp = undefined;
    user.verificationOtpExpires = undefined;
    // Also verify email if they reset password successfully via email OTP
    user.isEmailVerified = true;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Deprecated verifyEmail (link based) can be kept or removed. Removing to avoid confusion.
const verifyEmail = async (req, res) => {
  res.status(410).json({ message: "This endpoint is deprecated. Use OTP verification." });
};

export { signupUser, signinUser, verifyOtp, resendOtp, forgotPassword, resetPassword, verifyEmail };