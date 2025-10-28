import express from "express";
import Report from "../models/Report.js";
import { auth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import User from "../models/User.js";

const router = express.Router();

// Create report (User)
router.post("/", auth(["user"]), upload.single("image"), async (req, res) => {
  try {
    const report = new Report({
      user: req.user.id,
      description: req.body.description,
      location: req.body.location,
      image: req.file?.path
    });
    await report.save();
    res.json(report);
  } catch (err) {
    res.status(400).json({ message: "Error creating report", error: err });
  }
});

// My reports
router.get("/my", auth(["user"]), async (req, res) => {
  const reports = await Report.find({ user: req.user.id });
  res.json(reports);
});

export default router;
