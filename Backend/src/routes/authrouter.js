import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Return user data (excluding password)
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        type: user.type,
        home_address: user.home_address,
        work_address: user.work_address,
        toOfficeTime: user.toOfficeTime,
        fromOfficeTime: user.fromOfficeTime,
        workingDays: user.workingDays
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

authRouter.post("/register", async (req, res) => {
    try {
        const {
          name,
          email,
          password,
          phone,
          homeAddress,
          workAddress,
          toOfficeTime,
          fromOfficeTime,
          workingDays,
          type,
        } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: "User already exists with this email" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
          name,
          email,
          password: hashedPassword,
          phone,
          home_address: homeAddress,
          work_address: workAddress,
          toOfficeTime,
          fromOfficeTime,
          workingDays,
          type,
        });

        await user.save();
        
        // Return user ID for subsequent vehicle registration
        res.status(201).json({ 
          message: "User registered successfully",
          userId: user._id,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            type: user.type
          }
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
  
});

export default authRouter;