import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "../config/db";
import coursesRouter from "../routes/course";
import dashboardRouter from "../routes/dashboard";
import authRouter from "../routes/auth";
import reportsRouter from "../routes/reports";
import axios from "axios";

dotenv.config();

const app = express();

app.use(cors({
  origin: ["https://skillstash.vercel.app", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json());

app.get("/api/scrape", async (req, res) => {
  try {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).json({ error: "No URL provided" });

    const response = await axios.get("http://localhost:5000/api/scrape", {
      params: { url: targetUrl }
    });

    res.json(response.data);
  } catch (error: any) {
    console.error("Python Proxy Error:", error.message);
    res.status(500).json({ error: "Could not connect to Python scraper locally." });
  }
});

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