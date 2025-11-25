import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import jwt from "jsonwebtoken";

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
    res.status(201).json({ msg: "User Registered", user: newUser });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error });
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
      { id: existingUser._id, email: existingUser.email },
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
      },
    });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", error });
  }
});

export default router;
