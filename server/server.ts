import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db'; 
import coursesRouter from './routes/course';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5001; // Use a different port than React (3000)

app.use(cors({
  origin: 'http://localhost:5173', // Your React app URL
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/courses', coursesRouter);

connectDB();

// Middlewares
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Enable parsing of JSON bodies

// A simple test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the Express server!' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});