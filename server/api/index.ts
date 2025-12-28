import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "../config/db";
import coursesRouter from "../routes/course";
import dashboardRouter from "../routes/dashboard";
import authRouter from "../routes/auth";
import reportsRouter from "../routes/reports";

dotenv.config();

const app = express();

app.use(cors({
  origin: ["https://skillstash.vercel.app", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json());

const router = express.Router();

router.get("/", (req, res) => {
  res.send("API is running");
});
router.use("/courses", coursesRouter);
router.use("/dashboard", dashboardRouter);
router.use("/auth", authRouter);
router.use("/reports", reportsRouter);

app.use("/api", router); 
app.use("/", router);

connectDB();

if (require.main === module) {
  const port = process.env.PORT || 5001;
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

export default app;