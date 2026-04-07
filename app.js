import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cron from "node-cron";

import ReportRoutes from "./routes/ReportRoute.js";
import CrowdRoutes from "./routes/CrowdRoute.js";
import QuizRoutes from "./routes/QuizRoute.js";
import RewardRoutes from "./routes/RewardRoute.js";
import UserRoutes from "./routes/UserRoute.js";
import AdminRoutes from "./routes/AdminRoute.js";
import StationRoutes from "./routes/StationRoute.js";
import AutoUpdateService from "./services/AutoUpdateService.js";
import TrainRoutes from "./routes/TrainRoute.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/report", ReportRoutes);
app.use("/api/crowd", CrowdRoutes);
app.use("/api/quiz", QuizRoutes);
app.use("/api/reward", RewardRoutes);
app.use("/api/user", UserRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/station", StationRoutes);
app.use("/api/train", TrainRoutes);
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

cron.schedule("* * * * *", async () => {
  try {
    await AutoUpdateService.runCronUpdate();
    console.log(" Train & crowd auto-update run at", new Date().toLocaleTimeString());
  } catch (err) {
    console.error(" Cron job error:", err.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});