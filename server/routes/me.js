const express = require("express");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Applicant = require("../models/Applicant");
const Doctor = require("../models/Doctor");
const Nurse = require("../models/Nurse");
const Patient = require("../models/Patient");
const ITWorker = require("../models/ITWorker");
const Wardboy = require("../models/Wardboy");

const router = express.Router();

// ==========================
// GET Current User (from JWT cookie)
// ==========================
router.get("/", async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    let user;
    let userType = payload.userType;

    switch (userType) {
      case "patient":
        user = await Patient.findById(payload.uid).lean();
        break;
      case "doctor":
        user = await Doctor.findById(payload.uid).lean();
        break;
      case "nurse":
        user = await Nurse.findById(payload.uid).lean();
        break;
      case "itworker":
        user = await ITWorker.findById(payload.uid).lean();
        break;
      case "wardboy":
        user = await Wardboy.findById(payload.uid).lean();
        break;
      case "admin":
        user = await User.findById(payload.uid).lean();
        break;
      case "applicant":
        user = await Applicant.findById(payload.uid).lean();
        break;
      default:
        return res.status(401).json({ error: "Invalid user type" });
    }

    if (!user) return res.status(401).json({ error: "User not found" });

    // Strip sensitive fields
    const { passwordHash, verificationCode, resetCode, resetCodeExpires, ...safe } = user;

    res.json({
      user: safe,
      userType,
      role: safe.role || userType   // ✅ Always include role
    });
  } catch (err) {
    console.error("[ME ERROR]", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
});

module.exports = router;


/*
// server/routes/me.js
const express = require("express");
const jwt = require("jsonwebtoken");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Nurse = require("../models/Nurse");
const ITWorker = require("../models/ITWorker");
const Wardboy = require("../models/Wardboy");
const Applicant = require("../models/Applicant");
const User = require("../models/User"); // admin

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    let user, userType = payload.userType;

    switch (userType) {
      case "patient": user = await Patient.findById(payload.uid).lean(); break;
      case "doctor": user = await Doctor.findById(payload.uid).lean(); break;
      case "nurse": user = await Nurse.findById(payload.uid).lean(); break;
      case "itworker": user = await ITWorker.findById(payload.uid).lean(); break;
      case "wardboy": user = await Wardboy.findById(payload.uid).lean(); break;
      case "applicant": user = await Applicant.findById(payload.uid).lean(); break;
      case "admin": user = await User.findById(payload.uid).lean(); break;
      default: return res.status(401).json({ error: "Invalid user type" });
    }

    if (!user) return res.status(401).json({ error: "User not found" });

    const { passwordHash, verificationCode, resetCode, resetCodeExpires, ...safe } = user;
    res.json({ user: safe, userType });
  } catch (err) {
    console.error("[ME ERROR]", err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

module.exports = router;

*/