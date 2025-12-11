import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import authRouter from "./routes/authrouter.js";
import userRouter from "./routes/userrouter.js";
import carRouter from "./routes/carrouter.js";
import rideOfferingRouter from "./routes/rideOfferingRouter.js";
import rideDiscoveryRouter from "./routes/ridediscoveryrouter.js";
import routePointRouter from "./routes/routepointsrouter.js";
import rideRequestRouter from "./routes/rideRequestRouter.js";
import rideAssignmentRouter from "./routes/rideAssignmentRouter.js";
import rideSuggestionRouter from "./routes/rideSuggestionRouter.js";
import rideTrackingRouter from "./routes/rideTrackingRouter.js";

dotenv.config();

const app = express();

app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, user-id');
  res.header('Access-Control-Allow-Credentials', 'true');
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
app.use("/api/ridediscovery", rideDiscoveryRouter);
app.use("/api/routepoints", routePointRouter);
app.use("/api/riderequest", rideRequestRouter);
app.use("/api/rideassignment", rideAssignmentRouter)
app.use("/api/ridesuggestion", rideSuggestionRouter);
app.use("/api/ridetracking", rideTrackingRouter);


connectDB().then(() => {
  console.log("Connection established");
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
  app.listen(process.env.PORT, () => {
    console.log("Server running on port 7777");
  });
});