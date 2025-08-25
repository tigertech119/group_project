const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

// middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/me", require("./routes/me"));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

// connect & start
async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.DB_NAME });
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 API on http://localhost:${PORT}`));
  } catch (e) {
    console.error("❌ MongoDB connection error:", e.message);
    process.exit(1);
  }
}

start();
