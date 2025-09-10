// server/routes/prescriptions.js
const express = require("express");
const Prescription = require("../models/Prescription");
const Appointment = require("../models/Appointment");

const router = express.Router();

// Create prescription
router.post("/", async (req, res) => {
  try {
    const { appointmentId, doctorId, diagnosis, medicines } = req.body;
    const app = await Appointment.findById(appointmentId);
    if (!app) return res.status(404).json({ error: "Appointment not found" });

    const prescription = await Prescription.create({
      appointmentId,
      doctorId,
      patientId: app.patientId,
      diagnosis,
      medicines,
    });

    res.json({ message: "Prescription saved", prescription });
  } catch (err) {
    res.status(500).json({ error: "Server error while saving prescription" });
  }
});

// Get prescriptions by patient
router.get("/:patientId", async (req, res) => {
  const list = await Prescription.find({ patientId: req.params.patientId });
  res.json(list);
});

module.exports = router;
