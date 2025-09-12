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
