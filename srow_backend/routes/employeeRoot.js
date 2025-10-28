import express from "express";
import Route from "../models/route.js";   // ✅ Use capitalized model name
import { auth } from "../middleware/auth.js";

const router = express.Router();

/**
 * ✅ Get routes assigned to the logged-in employee
 * Endpoint: GET /api/employeeroot/my-routes
 */
router.get("/my-routes", auth(["employee"]), async (req, res) => {
  try {
    const routes = await Route.find({ employee: req.user.id })
      .populate("employee", "name email");

    res.json(routes);
  } catch (err) {
    console.error("Error fetching routes:", err);
    res
      .status(500)
      .json({ message: "Error fetching routes", error: err.message });
  }
});

/**
 * ✅ Mark stop as collected
 * Endpoint: PUT /api/employeeroot/collect/:routeId/:stopId
 */
router.put("/collect/:routeId/:stopId", auth(["employee"]), async (req, res) => {
  const { routeId, stopId } = req.params;
  const { message } = req.body;

  try {
    const route = await Route.findById(routeId); // ✅ Use model Route
    if (!route) return res.status(404).json({ message: "Route not found" });

    const stop = route.stops.id(stopId); // ✅ Access subdocument by id
    if (!stop) return res.status(404).json({ message: "Stop not found" });

    stop.status = "collected";
    if (message) stop.employeeMsg = message;

    await route.save();
    res.json(route);
  } catch (err) {
    console.error("Error updating stop:", err);
    res
      .status(500)
      .json({ message: "Error updating stop", error: err.message });
  }
});

export default router;
