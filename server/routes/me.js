const express = require("express");
const bcrypt = require("bcryptjs");
const requireAuth = require("../middleware/requireAuth");
const User = require("../models/User");

const router = express.Router();

// GET profile
router.get("/", requireAuth, async (req, res) => {
  const { passwordHash, ...safe } = req.user;
  res.json({ user: safe });
});

// PATCH profile
router.patch("/", requireAuth, async (req, res) => {
  const allowedProfileFields = ["fullName", "phone", "gender", "dob", "bloodGroup", "address"];
  const updates = {};

  if (req.body.profile) {
    updates.profile = {};
    for (const k of allowedProfileFields) {
      if (k in req.body.profile) updates.profile[k] = req.body.profile[k];
    }
  }

  if (req.body.newPassword) {
    if (!req.body.currentPassword) {
      return res.status(400).json({ error: "Current password is required" });
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
