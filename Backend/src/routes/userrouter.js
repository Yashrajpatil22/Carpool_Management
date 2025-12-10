import express from "express";
import User from "../models/user.model.js";

const userRouter = express.Router();

userRouter.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

userRouter.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).send("Server error");
  }
});


export default userRouter;