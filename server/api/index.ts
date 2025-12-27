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
    origin: [
      'http://localhost:5173',
      'https://skillstash.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

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

export default serverless(app);
