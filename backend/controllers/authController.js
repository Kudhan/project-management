import User from "../models/user.js";
import bcrypt from "bcryptjs";

const signupUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
        error: "UserAlreadyExists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, name, password: hashedPassword });

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
    // Your signin logic
  } catch (err) {
    console.error("Error during signin:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message
    });
  }
};

export { signupUser, signinUser };
