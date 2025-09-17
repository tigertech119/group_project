// server/server.js
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const records = require("./routes/records");
//const recordsRoutes = require("./routes/records");

require("dotenv").config();

const appointments = require("./routes/appointments");
const prescriptions = require("./routes/prescriptions");
const doctors = require("./routes/doctors");
const authRoutes = require("./routes/auth");
const meRoutes = require("./routes/me");

const app = express();

// ✅ added: small hardening middleware
const helmet = require("helmet");               // <— security headers
app.disable("x-powered-by");                    // <— hide server signature
app.use(helmet());                              // <— sane defaults for HTTP headers

// ✅ CORS setup (refined for prod security)
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000", // ✅ allow env override
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// ✅ added: trust proxy so Secure cookies work correctly behind reverse proxies (Heroku/Render/NGINX)
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// ✅ Mount routes
app.use("/api/auth", authRoutes);         
app.use("/api/appointments", appointments);
app.use("/api/prescriptions", prescriptions);
app.use("/api/doctors", doctors);
app.use("/api/records", records);
//app.use("/api/records", recordsRoutes);

// 🔑 IMPORTANT: make `/me` accessible at /api/auth/me
app.use("/api/auth/me", meRoutes);

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

// server/server.js
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const records = require("./routes/records");
//const recordsRoutes = require("./routes/records");

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
app.use("/api/records", records);
//app.use("/api/records", recordsRoutes);

// 🔑 IMPORTANT: make `/me` accessible at /api/auth/me
app.use("/api/auth/me", meRoutes);

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

*/