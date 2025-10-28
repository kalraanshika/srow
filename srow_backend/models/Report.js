import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedEmployee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["pending", "in-progress", "done"], default: "pending" },
    image: String,
    employeeMsg: String,
    employeeImage: String,
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
