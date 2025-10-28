import express from "express";
import Route from "../models/Route.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// ✅ Get ALL routes (visible to normal users)
router.get("/all-routes", auth(["user"]), async (req, res) => {
  try {
    const routes = await Route.find()
      .populate("employee", "name email")
      .sort({ date: -1 }); // optional: latest first

    res.json(routes);
  } catch (err) {
    console.error("Failed to fetch routes:", err);
    res.status(500).json({ message: "Failed to fetch routes" });
  }
});

export default router;
