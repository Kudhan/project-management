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

    // Verification logic removed by request - defaulting to verified
    // const verificationToken = jwt.sign(...)
    // await Verification.create(...)
    // await sendEmail(...)

    res.status(201).json({
      message: "Account created successfully",
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
    const { email, password } = req.body;
    // Include password explicitly because of select:false in schema
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid Email Or Password" });
    }

    // Verification check bypassed
    /*
    if (!user.isEmailVerified) {
       ... logic removed ...
    }
    */

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

    res.status(200).json({ message: "Login Successful", token, user: userData });

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

    if (!payload || payload.purpose !== "email-verification") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { userId } = payload;

    const verification = await Verification.findOne({ userId, token });
    if (!verification) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (verification.expiresAt < new Date()) {
      return res.status(401).json({ message: "Token expired" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // ✅ Check before updating
    if (user.isEmailVerified) {
      await Verification.findByIdAndDelete(verification._id);
      return res.status(400).json({ message: "Email already verified" });
    }

    // ✅ Now update
    user.isEmailVerified = true;
    await user.save();

    await Verification.findByIdAndDelete(verification._id);

    res.status(200).json({ message: "Email Verified Successfully" });

  } catch (error) {
    console.error("Error during email verification:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export { signupUser, signinUser, verifyEmail };