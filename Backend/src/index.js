import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";

dotenv.config();

const app = express();

connectDB().then(() => {
  console.log("Connection established");
  app.listen(process.env.PORT, () => {
    console.log("Server running on port 7777");
  });
});
