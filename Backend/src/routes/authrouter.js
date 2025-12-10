import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid credentials");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }

    res.status(200).send("Login successful",user);

  } catch (error) {
    res.status(500).send("Server error");
  }
});

authRouter.post("/register", async (req, res) => {
    try {
        const {
          name,
          email,
          password,
          phone,
          address,
          toOfficeTime,
          fromOfficeTime,
          workingDays,
          type,
        } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
          name,
          email,
          password: hashedPassword,
          phone,
          source_address: address,
          toOfficeTime,
          fromOfficeTime,
          workingDays,
          type,
        });

        await user.save();
        res.status(201).send("User registered successfully");


    } catch (error) {
        res.status(500).send("Server error");
    }
  
});

export default authRouter;