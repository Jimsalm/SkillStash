import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware/auth";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        role?: string;
      };
    }
  }
}

const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ msg: "Email is already existing" });
    }

    const cryptedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: cryptedPassword,
    });

    const jwtSecret = process.env.JWT_SECRET as string;
    const token = jwt.sign(
      { id: newUser._id,
        email: newUser.email,
        role: newUser.role },
      jwtSecret,
      { expiresIn: "7d" }
    );

    const userWithoutPassword = newUser.toObject();
    delete (userWithoutPassword as any).password;

    res.status(201).json({ msg: "User Registered", user: userWithoutPassword, token: token });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ 
      msg: "Server Error", 
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ msg: "No user with the given email" });
    }

    const isPassMatch = await bcrypt.compare(password, existingUser.password);
    if (!isPassMatch) {
      return res.status(400).json({ msg: "Incorrect Password" });
    }

    const jwtSecret = process.env.JWT_SECRET as string;

    const token = jwt.sign(
      { id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role },
      jwtSecret,
      { expiresIn: "7d" }
    );

    res.json({
      msg: "Logged In",
      token,
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", error });
  }
});

router.get("/me", authMiddleware, async (req: Request, res: Response) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ msg: "Unauthorized" });
  }
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

export default router;
