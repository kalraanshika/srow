import mongoose from "mongoose";

const stopSchema = new mongoose.Schema({
  location: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ["pending", "collected"], default: "pending" },
  employeeMsg: { type: String },
});

const routeSchema = new mongoose.Schema({
  routeName: { type: String, required: true },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  stops: [stopSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Route || mongoose.model("Route", routeSchema);
