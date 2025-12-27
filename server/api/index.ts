import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "../config/db";
import coursesRouter from "../routes/course";
import dashboardRouter from "../routes/dashboard";
import authRouter from "../routes/auth";
import reportsRouter from "../routes/reports";
import serverless from "serverless-http";

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(
  cors({ 
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        process.env.VERCEL_URL
      ];
      if(!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/courses", coursesRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/auth", authRouter);
app.use("/api/reports", reportsRouter);

connectDB();

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

export const handler = serverless(app);

export default handler;
