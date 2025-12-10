import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import authRouter from "./routes/authrouter.js";
import userRouter from "./routes/userrouter.js";
import carRouter from "./routes/carrouter.js";
import rideOfferingRouter from "./routes/rideOfferingRouter.js";

dotenv.config();

const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/car", carRouter);
app.use("/api/rides", rideOfferingRouter);

connectDB().then(() => {
  console.log("Connection established");
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
  app.listen(process.env.PORT, () => {
    console.log("Server running on port 7777");
  });
});