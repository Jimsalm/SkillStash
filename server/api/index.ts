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

const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    const allowedOrigins = [
      'http://localhost:5173',
      'https://skillstash.vercel.app',
      'https://skill-stash.vercel.app'
    ];
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600 
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

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
