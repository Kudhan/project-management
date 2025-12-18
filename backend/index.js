import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import { createServer } from "http";
import routes from "./routes/index.js";
import { initSocket } from "./socket.js";

import "./models/user.js";
import "./models/project.js";
import "./models/task.js";
import "./models/workspace.js";
import "./models/comment.js";
import "./models/activity.js";
import "./models/workspace-invite.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

/* ======================= MongoDB ======================= */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    /* ======================= Server ======================= */
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/* ======================= CORS (FIXED) ======================= */
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server requests (health checks, curl, etc.)
      if (!origin) return callback(null, true);

      // Allow localhost (dev)
      if (origin === "http://localhost:5173") {
        return callback(null, true);
      }

      // Allow environment variables (Production)
      const allowedOrigins = [process.env.CLIENT_URL, process.env.FRONTEND_URL].filter(Boolean);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow ALL Vercel deployments (prod + preview)
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ======================= Middleware ======================= */
app.use(express.json());
app.use(morgan("dev"));

/* ======================= Socket.io ======================= */
initSocket(httpServer);

/* ======================= Routes ======================= */
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the backend server" });
});

app.use("/api", routes);

/* ======================= 404 ======================= */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ======================= Error Handler ======================= */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});


