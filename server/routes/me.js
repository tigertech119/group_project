const express = require("express");
const bcrypt = require("bcryptjs");
const requireAuth = require("../middleware/requireAuth");
const User = require("../models/User");

const router = express.Router();

// GET current user
router.get("/", requireAuth, async (req, res) => {
  const { passwordHash, ...safe } = req.user;
  res.json({ user: safe });
});

// PATCH update profile
router.patch("/", requireAuth, async (req, res) => {
  const updates = {};

  // Only allow safe profile updates
  if (req.body.profile) {
    updates.profile = {};
    const allowed = ["fullName", "phone", "gender", "dob", "bloodGroup", "address"];
    for (const k of allowed) {
      if (k in req.body.profile) updates.profile[k] = req.body.profile[k];
    }
  }

  // If password change
  if (req.body.newPassword) {
    if (!req.body.currentPassword) {
      return res.status(400).json({ error: "Current password required" });
    }
    const fresh = await User.findById(req.user._id);
    const ok = await bcrypt.compare(req.body.currentPassword, fresh.passwordHash);
    if (!ok) return res.status(401).json({ error: "Current password incorrect" });
    updates.passwordHash = await bcrypt.hash(req.body.newPassword, 10);
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
  const { passwordHash, ...safe } = user.toObject();
  res.json({ user: safe });
});

module.exports = router;
