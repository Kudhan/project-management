import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Verification from "../models/verification.js";
import { sendEmail } from "../libs/send-email.js";
import aj from "../libs/arcjet.js";

const signupUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    const decision = await aj.protect(req, { email }); // Deduct 5 tokens from the bucket
    console.log("Arcjet decision", decision.isDenied());

    if (decision.isDenied() && decision.reason.isRateLimit()) {
      return res.status(403).json({ message: "Invalid email address" });
    }

    // Validate required fields
    if (!email || !name || !password) {
      return res.status(400).json({
        message: "Missing required fields",
        error: "MissingFields"
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
        error: "UserAlreadyExists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      name,
      password: hashedPassword
    });

    const verificationToken = jwt.sign(
      { userId: newUser._id, purpose: "email-verification" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await Verification.create({
      userId: newUser._id,
      token: verificationToken,
      expiresAt: new Date(Date.now() + 3600000) // 1 hour
    });

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const emailBody = `
      <p>Hello ${name},</p>
      <p>Click the link below to verify your email:</p>
      <a href="${verificationLink}">Verify Email</a>
    `;
    const emailSubject = "Email Verification";

    try {
      await sendEmail(newUser.email, emailSubject, emailBody);
    } catch (error) {
      await Verification.deleteOne({ userId: newUser._id });
      await User.deleteOne({ _id: newUser._id });

      return res.status(500).json({
        message: "Failed to send verification email",
        error: "FailedToSendEmail"
      });
    }

    res.status(201).json({
      message: "Verification email sent successfully",
      status: "success",
      user: {
        email: newUser.email,
        name: newUser.name,
        profilePicture: newUser.profilePicture,
        isEmailVerified: newUser.isEmailVerified,
        lastLogin: newUser.lastLogin,
        is2FAEnabled: newUser.is2FAEnabled
      }
    });

  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message
    });
  }
};

const signinUser = async (req, res) => {
  try {
    // Your signin logic here
  } catch (err) {
    console.error("Error during signin:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { userId, purpose } = payload;

    if (purpose !== "email-verification") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const verification = await Verification.findOne({ userId, token });

    if (!verification) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (verification.expiresAt < new Date()) {
      return res.status(401).json({ message: "Token expired" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
      return res.status(200).json({ message: "Email Verified Successfully" });
    }

    return res.status(400).json({ message: "Email already verified" });

  } catch (error) {
    console.error("Error during email verification:", error);
    res.status(500).json({ message: "Error Occurred" });
  }
};

export { signupUser, signinUser, verifyEmail };