const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config();

const appointments = require("./routes/appointments");
const prescriptions = require("./routes/prescriptions");
const doctors = require("./routes/doctors");
const authRoutes = require("./routes/auth");
const meRoutes = require("./routes/me");

const app = express();

// ✅ CORS setup
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// ✅ Mount routes
app.use("/api/auth", authRoutes);         
app.use("/api/appointments", appointments);
app.use("/api/prescriptions", prescriptions);
app.use("/api/doctors", doctors);
app.use("/api/me", meRoutes);

// ✅ Health check
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// ✅ Start server
async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.DB_NAME });
    console.log("✅ MongoDB connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 API running at http://localhost:${PORT}`));
  } catch (err) {
    console.error("❌ DB connection error:", err.message);
    process.exit(1);
  }
}

start();


/*
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

// middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN,   // must be http://localhost:3000 in .env
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
 
*/