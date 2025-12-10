import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import authRouter from "./routes/authrouter.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/auth", authRouter);
connectDB().then(() => {
  console.log("Connection established");
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
  app.listen(process.env.PORT, () => {
    console.log("Server running on port 7777");
  });
});
