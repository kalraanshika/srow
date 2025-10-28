import express from "express";
import Route from "../models/Route.js";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Create route
router.post("/", auth(["admin"]), async (req, res) => {
  try {
    const { routeName, stops, employeeId } = req.body;

    const newRoute = new Route({
      routeName,
      employee: employeeId,
      stops: stops.map((s) => ({
        location: s.location,
        time: s.time,
      })),
    });

    await newRoute.save();
    res.json(newRoute);
  } catch (err) {
    res.status(500).json({ message: "Error creating route", error: err.message });
  }
});

// Get all employees
router.get("/employees", auth(["admin"]), async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "Error fetching employees", error: err.message });
  }
});

// Get all routes
router.get("/routes", auth(["admin"]), async (req, res) => {
  try {
    const routes = await Route.find().populate("employee", "name email");
    res.json(routes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching routes", error: err.message });
  }
});

export default router;
