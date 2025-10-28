import express from "express";
import multer from "multer";
import Report from "../models/Report.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ✅ Get reports assigned to the logged-in employee
router.get("/my-reports", auth(["employee"]), async (req, res) => {
  try {
    const reports = await Report.find({ assignedEmployee: req.user.id })
      .populate("user", "name email")
      .populate("assignedEmployee", "name email");

    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reports" });
  }
});

// ✅ Update report by assigned employee
router.put(
  "/update-report/:reportId",
  auth(["employee"]),
  upload.single("employeeImage"),
  async (req, res) => {
    const { reportId } = req.params;
    const { message, status } = req.body;
    const employeeImage = req.file ? req.file.filename : undefined;

    try {
      const report = await Report.findOne({
        _id: reportId,
        assignedEmployee: req.user.id, // ensure only assigned employee can update
      });

      if (!report) {
        return res
          .status(404)
          .json({ message: "Report not found or not assigned to you" });
      }

      if (message) report.employeeMsg = message;
      if (status) report.status = status;
      if (employeeImage) report.employeeImage = employeeImage;

      await report.save();
      res.json(report);
    } catch (err) {
      res.status(500).json({ message: "Error updating report" });
    }
  }
);

export default router;
