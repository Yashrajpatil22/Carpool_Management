import express from "express";
const app = express();
require("dotenv").config();
const connectDB = require("./config/database");
connectDB().then(() => {
  console.log("Connection established");
  app.listen(process.env.PORT, () => {
    console.log("Server running on port 7777");
  });
});
