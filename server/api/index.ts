import express from "express";
import serverless from "serverless-http";

const app = express();

// Manual CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is working!' });
});

app.post('/auth/login', (req, res) => {
  res.json({ message: 'Login endpoint reached', body: req.body });
});

app.post('/auth/register', (req, res) => {
  res.json({ message: 'Register endpoint reached', body: req.body });
});

// Removed the catch-all route

export default serverless(app);