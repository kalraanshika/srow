import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  vehicleNumber: String,
  problem: String,
  adminMsg: { type: String, default: "" },
  status: { type: String, enum: ["pending", "in-progress", "done"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("EmployeeIssue", issueSchema);
