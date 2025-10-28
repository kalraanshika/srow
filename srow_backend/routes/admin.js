import express from "express";
import Report from "../models/Report.js";
import User from "../models/User.js";

const router = express.Router();

// Get all employees
router.get("/employees", async (req, res) => {
  const employees = await User.find({ role: "employee" });
  res.json(employees);
});

// Admin get all reports
router.get("/reports", async (req, res) => {
  const reports = await Report.find().populate("user assignedEmployee");
  res.json(reports);
});

// Assign report to employee
router.put("/reports/:reportId/assign", async (req, res) => {
  const { reportId } = req.params;
  const { employeeId } = req.body;
  const report = await Report.findByIdAndUpdate(
    reportId,
    { assignedEmployee: employeeId, status: "in-progress" },
    { new: true }
  ).populate("user assignedEmployee");

  res.json(report);
});

export default router;
