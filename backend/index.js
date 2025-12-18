import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import routes from "./routes/index.js";

import "./models/user.js";
import "./models/project.js";
import "./models/task.js";
import "./models/workspace.js";
import "./models/comment.js";
import "./models/activity.js";
import "./models/workspace-invite.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ✅ MongoDB */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/* ✅ FIXED CORS */
const allowedOrigins = [
  "http://localhost:5173",
  "https://collabsphere-1anb3jek9-kudhans-projects.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(morgan("dev"));

/* ✅ Health check */
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the backend server" });
});

/* ✅ API routes */
app.use("/api", routes);

/* ❌ 404 */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ❌ Error handler */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
