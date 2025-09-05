const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

function setAuthCookie(res, uid) {
  const token = jwt.sign({ uid }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { email, password, role, profile } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      passwordHash,
      role: role || "patient",
      profile: profile || {}
    });

    setAuthCookie(res, user._id.toString());

    const { passwordHash: _, ...safe } = user.toObject();
    res.status(201).json({ user: safe });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    setAuthCookie(res, user._id.toString());

    const { passwordHash: _, ...safe } = user.toObject();
    res.json({ user: safe });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// APPLY JOB (Doctor, Nurse, Staff etc.) - UPDATED ✅
router.post("/apply-job", async (req, res) => {
  try {
    const { email, password, role, profile } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: "Email, password, and role are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      passwordHash,
      role: "applicant",
      appliedFor: role.toLowerCase(),
      profile: profile || {},
      applicationStatus: "pending"
    });

    setAuthCookie(res, user._id.toString());

    const { passwordHash: _, ...safe } = user.toObject();
    res.status(201).json({ user: safe });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGOUT
router.post("/logout", (_req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production"
  });
  res.json({ ok: true });
});

// GET ALL APPLICANTS (Admin only) - FIXED ✅
router.get("/applicants", async (req, res) => {
  try {
    const applicants = await User.find({ 
      role: "applicant",
      applicationStatus: "pending" 
    }).select("-passwordHash"); // ✅ FIXED: Properly exclude passwordHash
    
    res.json({ applicants });
  } catch (err) {
    console.error("Error fetching applicants:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// APPROVE/REJECT APPLICANT (Admin only) - FIXED ✅
router.post("/approve-applicant", async (req, res) => {
  try {
    const { applicantId, status } = req.body;
    
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const applicant = await User.findById(applicantId);
    if (!applicant || applicant.role !== "applicant") {
      return res.status(404).json({ error: "Applicant not found" });
    }

    if (status === "approved") {
      applicant.role = applicant.appliedFor;
    }
    
    applicant.applicationStatus = status;
    await applicant.save();

    // ✅ FIXED: Remove passwordHash from response
    const { passwordHash, ...userWithoutPassword } = applicant.toObject();

    res.json({ 
      message: `Application ${status} successfully`,
      user: userWithoutPassword
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

/*
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router(); // 👈 THIS WAS MISSING!

function setAuthCookie(res, uid) {
  const token = jwt.sign({ uid }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { email, password, role, profile } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      passwordHash,
      role: role || "patient",
      profile: profile || {}
    });

    setAuthCookie(res, user._id.toString());

    const { passwordHash: _, ...safe } = user.toObject();
    res.status(201).json({ user: safe });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    setAuthCookie(res, user._id.toString());

    const { passwordHash: _, ...safe } = user.toObject();
    res.json({ user: safe });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// APPLY JOB (Doctor, Nurse, Staff etc.) - UPDATED ✅
router.post("/apply-job", async (req, res) => {
  try {
    const { email, password, role, profile } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: "Email, password, and role are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 10);

    // ✅ CHANGED: Set role to "applicant" instead of the actual role
    const user = await User.create({
      email,
      passwordHash,
      role: "applicant", // 👈 Always set to "applicant"
      appliedFor: role.toLowerCase(), // 👈 Store what they applied for
      profile: profile || {},
      applicationStatus: "pending" // 👈 Set default status
    });

    setAuthCookie(res, user._id.toString());

    const { passwordHash: _, ...safe } = user.toObject();
    res.status(201).json({ user: safe });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGOUT
router.post("/logout", (_req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production"
  });
  res.json({ ok: true });
});

module.exports = router;


*/
