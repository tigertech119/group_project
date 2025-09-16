// server/routes/me.js
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

/**
 * Helper: get model by userType
 */
function modelFor(userType) {
  switch (userType) {
    case "patient": return Patient;
    case "doctor": return Doctor;
    case "nurse": return Nurse;
    case "itworker": return ITWorker;
    case "wardboy": return Wardboy;
    case "admin": return User;
    case "applicant": return Applicant;
    default: return null;
  }
}

/**
 * Helper: sanitize out sensitive fields
 */
function toSafeUser(doc) {
  if (!doc) return null;
  const { passwordHash, verificationCode, resetCode, resetCodeExpires, ...safe } =
    doc.toObject ? doc.toObject() : doc;
  return safe;
}

/**
 * GET current user (from JWT cookie)
 */
router.get("/", async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const Model = modelFor(payload.userType);
    if (!Model) return res.status(401).json({ error: "Invalid user type" });

    const user = await Model.findById(payload.uid).lean();
    if (!user) return res.status(401).json({ error: "User not found" });

    const safe = toSafeUser(user);
    return res.json({ user: safe, userType: payload.userType, role: safe.role || payload.userType });
  } catch (err) {
    console.error("[ME ERROR]", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
});

/**
 * PATCH current user's personal profile
 * - Only updates profile.* fields
 * - Email and role CANNOT be changed
 */
router.patch("/", async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const Model = modelFor(payload.userType);
    if (!Model) return res.status(401).json({ error: "Invalid user type" });

    const user = await Model.findById(payload.uid);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Disallow attempts to change email or role
    if ("email" in req.body || "role" in req.body) {
      return res.status(400).json({ error: "Email and role cannot be changed" });
    }

    const incoming = req.body?.profile || {};
    if (!incoming || typeof incoming !== "object") {
      return res.status(400).json({ error: "Missing profile payload" });
    }

    // Whitelist updatable fields per role
    const base = ["fullName", "phone", "gender"];
    let allowed = [...base];

    switch (payload.userType) {
      case "patient":
        allowed.push("dob", "address", "bloodGroup", "blood_group");
        break;
      case "doctor":
        allowed.push("department", "specialization", "qualifications", "experience");
        break;
      case "nurse":
        allowed.push("qualifications", "experience");
        break;
      case "itworker":
        allowed.push("specialization", "qualifications");
        break;
      case "wardboy":
        // only base profile fields
        break;
      default:
        break;
    }

    // Apply updates to profile
    user.profile = user.profile || {};
    for (const key of allowed) {
      if (incoming[key] !== undefined) {
        if (key === "dob" && incoming[key]) {
          user.profile[key] = new Date(incoming[key]);
        } else if (key === "experience") {
          const num = Number(incoming[key]);
          if (!Number.isNaN(num)) user.profile[key] = num;
        } else if (key === "blood_group") {
          user.profile["bloodGroup"] = incoming[key];
        } else {
          user.profile[key] = incoming[key];
        }
      }
    }

    await user.save();
    const safe = toSafeUser(user);
    return res.json({ user: safe, userType: payload.userType, role: safe.role || payload.userType });
  } catch (err) {
    console.error("[ME PATCH ERROR]", err);
    return res.status(500).json({ error: "Server error while updating profile" });
  }
});

module.exports = router;



/*
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
      role: safe.role || userType
    });
  } catch (err) {
    console.error("[ME ERROR]", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
});

// ==========================
// PATCH Current User (update profile)
// ==========================
router.patch("/", async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    let userType = payload.userType;
    let updates = req.body;

    // 🚫 Prevent email & role changes
    if (updates.email) delete updates.email;
    if (updates.role) delete updates.role;

    let model;
    switch (userType) {
      case "patient": model = Patient; break;
      case "doctor": model = Doctor; break;
      case "nurse": model = Nurse; break;
      case "itworker": model = ITWorker; break;
      case "wardboy": model = Wardboy; break;
      case "admin": model = User; break;
      default: return res.status(400).json({ error: "Invalid user type" });
    }

    const user = await model.findByIdAndUpdate(
      payload.uid,
      { $set: updates },
      { new: true }
    ).lean();

    if (!user) return res.status(404).json({ error: "User not found" });

    const { passwordHash, verificationCode, resetCode, resetCodeExpires, ...safe } = user;

    res.json({
      message: "✅ Profile updated successfully",
      user: safe,
      userType,
      role: safe.role || userType
    });
  } catch (err) {
    console.error("[PATCH ME ERROR]", err);
    return res.status(500).json({ error: "Server error while updating profile" });
  }
});

module.exports = router;
*/



/*   oldest one 
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

 */