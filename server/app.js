import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import projectRoutes from "./routes/project.route.js";
import taskRoutes from "./routes/task.route.js";
import { connected } from './lib/db.js';

dotenv.config();
const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({ 
    origin:process.env.ORIGIN ,
    // Frontend URL
    credentials: true, // Allow cookies and credentials
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/task", taskRoutes);





const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  connected();
  console.log("Backend server is running!");
});