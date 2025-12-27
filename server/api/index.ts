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
  origin: [
    'http://localhost:5173',
    'https://skillstash.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = express.Router();

// Routes
router.get("/", (req, res) => { res.json({ msg: "API is running" }); });
app.use("/courses", coursesRouter);
app.use("/dashboard", dashboardRouter);
app.use("/auth", authRouter);
app.use("/reports", reportsRouter);

app.use("/api", router);
app.use("/", router);

connectDB()

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

export default serverless(app);
