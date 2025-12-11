import express from "express";
import User from "../models/user.model.js";

const userRouter = express.Router();

userRouter.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

userRouter.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;

    // Remove password from update if present (password updates should use separate route)
    if (updateData.password) {
      delete updateData.password;
    }

    // Remove email from update to prevent duplicates
    if (updateData.email) {
      delete updateData.email;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id, 
      updateData, 
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


export default userRouter;