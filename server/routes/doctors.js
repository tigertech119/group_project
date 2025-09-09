const express = require("express");
const User = require("../models/User");

const router = express.Router();

// ✅ Get doctors by department
router.get("/:department", async (req, res) => {
  try {
    const department = req.params.department;
    const doctors = await User.find({ role: "doctor", "profile.department": department });

    res.json(doctors);
  } catch (err) {
    console.error("[DOCTORS FETCH ERROR]", err);
    res.status(500).json({ error: "Server error while fetching doctors" });
  }
});

module.exports = router;
