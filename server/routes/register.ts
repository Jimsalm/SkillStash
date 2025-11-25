import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";

const router = express.Router();

router.post("/register", async (req, res) => {
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
