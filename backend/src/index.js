import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { pathToFileURL } from "url";

import path from "path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
if (process.env.NODE_ENV !== "production") {
  app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173", credentials: true }));
}

let databaseReady;
app.use("/api", async (_req, res, next) => {
  try {
    databaseReady ||= connectDB();
    await databaseReady;
    next();
  } catch (error) {
    databaseReady = undefined;
    console.error("Could not connect to PostgreSQL:", error.message);
    res.status(503).json({ message: "Database is temporarily unavailable" });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.get("/api/health", (_req, res) => res.status(200).json({ status: "ok" }));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend", "dist")));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
  });
}

// Vercel imports the HTTP server as a function; local/Docker runs listen normally.
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  connectDB()
    .then(() => server.listen(PORT, () => console.log(`Mingle is running on port ${PORT}`)))
    .catch((error) => {
      console.error("Could not connect to PostgreSQL:", error.message);
      process.exit(1);
    });
}

export { app, server };
