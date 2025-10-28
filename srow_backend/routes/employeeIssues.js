import express from "express";
import EmployeeIssue from "../models/EmployeeIssue.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Employee creates issue
router.post("/create", auth(["employee"]), async (req, res) => {
  try {
    const { name, vehicleNumber, problem } = req.body;
    const issue = new EmployeeIssue({
      employee: req.user.id,
      name,
      vehicleNumber,
      problem
    });
    await issue.save();
    res.json(issue);
  } catch (err) {
    res.status(400).json({ message: "Error creating issue", error: err });
  }
});

// Employee fetches own issues
router.get("/my-issues", auth(["employee"]), async (req, res) => {
  const issues = await EmployeeIssue.find({ employee: req.user.id });
  res.json(issues);
});

// Admin fetches all issues
router.get("/all", auth(["admin"]), async (req, res) => {
  const issues = await EmployeeIssue.find().populate("employee", "name email");
  res.json(issues);
});

// Admin updates issue with solution
router.put("/update/:id", auth(["admin"]), async (req, res) => {
  const { adminMsg, status } = req.body;
  const issue = await EmployeeIssue.findByIdAndUpdate(
    req.params.id,
    { adminMsg, status },
    { new: true }
  );
  res.json(issue);
});

export default router;
