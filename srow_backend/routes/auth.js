import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role });
    await user.save();
    res.json({ message: "User registered" });
  } catch (err) {
    res.status(400).json({ message: "Error registering user", error: err });
  }
});

// Login
router.post("/login", async (req, res) => {
  console.log('body',req.body);
  const { email, password } = req.body;
  console.log('EmaIL',email);
  console.log('password', password);

  try {
    const user = await User.findOne({ email });
    console.log('USER DATA', user);
    if (!user) return res.status(400).json({ message: "User not found" ,error});
    console.log('user not found error',user);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials", error1 });
    console.log('is match data',isMatch);
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Return token + user object (excluding password)
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err });
  }
});

export default router;
