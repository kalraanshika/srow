import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cron from "node-cron";
import { connectDB } from "./config/db.js";
import Route from "./models/Route.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Import routes
import authRoutes from "./routes/auth.js";
import reportRoutes from "./routes/reports.js";
import employeeRoutes from "./routes/employee.js";
import adminRoutes from "./routes/admin.js";
import adminRoot from "./routes/adminRoot.js";
import employeeRoot from "./routes/employeeRoot.js";
import userRoot from "./routes/userRoot.js";
import employeeIssuesRoutes from "./routes/employeeIssues.js";

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/employee-issues", employeeIssuesRoutes);
app.use("/api/adminroot", adminRoot);
app.use("/api/employeeroot", employeeRoot);
app.use("/api/userroot", userRoot);


connectDB().then(() => {
  console.log("✅ MongoDB connected");

//   cron.schedule('* * * * *', () => {
//   console.log('running a task every minute');
// });
  
  cron.schedule(
    "* 0 * * *",
    async () => {
      try {
        console.log("🔄 Resetting collected stops to pending...");

        const result = await Route.updateMany(
          { "stops.status": "collected" },
          { $set: { "stops.$[elem].status": "pending" } },
          { arrayFilters: [{ "elem.status": "collected" }] }
        );

        console.log(`✅ Reset done. Updated ${result.modifiedCount} stops.`);
      } catch (err) {
        console.error("❌ Error resetting stops:", err);
      }
    },
    { timezone: "Asia/Kolkata" }
  );

  // Start server
  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
  });
});
