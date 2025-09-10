const express = require("express");
const Appointment = require("../models/Appointment");

const router = express.Router();

// ✅ Book appointment
router.post("/book", async (req, res) => {
  try {
    const { patientId, doctorId, department, date, time } = req.body;
    if (!patientId || !doctorId || !department || !date || !time) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const appointment = await Appointment.create({
      patientId, doctorId, department, date, time
    });

    res.status(201).json({ message: "Appointment booked", appointment });
  } catch (err) {
    console.error("[BOOK APPOINTMENT ERROR]", err);
    res.status(500).json({ error: "Server error while booking appointment" });
  }
});

module.exports = router;
