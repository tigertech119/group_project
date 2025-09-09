// server/routes/applyJob.js
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// Doctor/Nurse/Wardboy/IT Worker registration
router.post("/", async (req, res) => {
  try {
    const { email, password, role, profile } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: "Email, password and role are required" });
    }

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: "Email already registered" });

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Save user with role and department
    const user = await User.create({
      email,
      passwordHash,
      role,
      profile: {
        ...profile,
        department: profile.department || null, // ✅ department saved here
      },
      isVerified: true, // ✅ Skip email verification for staff
    });

    res.json({ user });
  } catch (err) {
    console.error("[APPLY JOB ERROR]", err);
    res.status(500).json({ error: "Server error while applying job" });
  }
});

module.exports = router;
