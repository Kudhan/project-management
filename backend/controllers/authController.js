

import User from '../models/User.js'; // ✅ Make sure .js is included if using ES Modules
import bcrypt from 'bcrypt';

const signupUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    const existingUser = await User.findOne({ email }); // ✅ Returns a single user or null

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
        error: "UserAlreadyExists"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Correct usage of create
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name
    });

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
    try{

    }catch(err){
        console.error("Error during signin:", err);
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
}

export {signupUser,signinUser}