import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

const authRouter = express.Router();

authRouter.post("/login", (req, res) => {
  res.send("Login route");
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