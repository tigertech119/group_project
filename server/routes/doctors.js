const express = require("express");
const Doctor = require("../models/Doctor");

const router = express.Router();

/**
 * GET /api/doctors/search?name=Dr%20John
 * - Case-insensitive match on profile.fullName
 * - Returns basic fields only
 */
router.get("/search", async (req, res) => {
  try {
    const name = (req.query.name || "").trim();
    if (!name) return res.json({ doctors: [] });

    const regex = new RegExp(name, "i");
    const doctors = await Doctor.find(
      { "profile.fullName": regex, role: "doctor" },
      "email role isAvailable profile.fullName profile.phone profile.gender profile.department profile.specialization profile.qualifications profile.experience"
    )
      .sort({ "profile.fullName": 1 })
      .limit(10)
      .lean();

    res.json({ doctors });
  } catch (err) {
    console.error("[DOCTOR SEARCH ERROR]", err);
    res.status(500).json({ error: "Server error while searching doctors" });
  }
});

// ✅ existing route (keep this below /search so it doesn't capture 'search' as a department)
router.get("/:department", async (req, res) => {
  try {
    const department = req.params.department;

    const doctors = await Doctor.find({
      "profile.department": department,
      role: "doctor"
    });

    res.json(doctors);
  } catch (err) {
    console.error("[DOCTORS FETCH ERROR]", err);
    res.status(500).json({ error: "Server error while fetching doctors" });
  }
});

module.exports = router;




/*
const express = require("express");
const Doctor = require("../models/Doctor");

const router = express.Router();

// ✅ Get doctors by department (only approved)
router.get("/:department", async (req, res) => {
  try {
    const department = req.params.department;

    const doctors = await Doctor.find({
      "profile.department": department,
      role: "doctor"
    });

    res.json(doctors);
  } catch (err) {
    console.error("[DOCTORS FETCH ERROR]", err);
    res.status(500).json({ error: "Server error while fetching doctors" });
  }
});

module.exports = router;
*/