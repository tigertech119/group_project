// server/routes/records.js
const express = require("express");
const mongoose = require("mongoose");

const PatientRecord = require("../models/PatientRecord"); // ensure this model exists (see note below)
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

const router = express.Router();

/**
 * POST /api/records
 * Create a patient record (doctor visit note)
 * Body: { patientId, doctorId, appointmentId?, diagnosis?, stage?, treatment?, tests?, prescription?, notes?, nextFollowUp? }
 */
router.post("/", async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      appointmentId,
      diagnosis,
      stage,
      treatment,
      tests,           // array of strings or comma-separated string
      prescription,    // free-text prescription (kept simple)
      notes,
      nextFollowUp,    // string date or text (kept flexible)
    } = req.body;

    if (!patientId || !doctorId) {
      return res.status(400).json({ error: "patientId and doctorId are required" });
    }

    // validate refs exist (lightweight)
    const [patient, doctor] = await Promise.all([
      Patient.findById(patientId).select("_id"),
      Doctor.findById(doctorId).select("_id"),
    ]);
    if (!patient) return res.status(404).json({ error: "Patient not found" });
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });

    let appt = null;
    if (appointmentId && mongoose.isValidObjectId(appointmentId)) {
      appt = await Appointment.findById(appointmentId).select("_id");
    }

    const normalizedTests = Array.isArray(tests)
      ? tests
      : (typeof tests === "string" && tests.trim()
          ? tests.split(",").map(s => s.trim()).filter(Boolean)
          : []);

    const record = await PatientRecord.create({
      patientId,
      doctorId,
      appointmentId: appt?._id || undefined,
      diagnosis: diagnosis || "",
      stage: stage || "",
      treatment: treatment || "",
      tests: normalizedTests,
      prescription: prescription || "",
      notes: notes || "",
      nextFollowUp: nextFollowUp || "",
    });

    return res.status(201).json({ message: "Record saved", record });
  } catch (err) {
    console.error("[RECORD CREATE ERROR]", err);
    res.status(500).json({ error: "Server error while creating record" });
  }
});

/**
 * GET /api/records/doctor/:doctorId
 * List records created for this doctor’s patients
 */
router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const { doctorId } = req.params;
    const records = await PatientRecord.find({ doctorId })
      .populate("patientId", "profile.fullName email")
      .populate("doctorId", "profile.fullName email")
      .populate("appointmentId", "department scheduledDate scheduledTime status")
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (err) {
    console.error("[RECORDS BY DOCTOR ERROR]", err);
    res.status(500).json({ error: "Server error while fetching records" });
  }
});

/**
 * GET /api/records/patient/:patientId
 * List records for a patient (for patient view)
 */
router.get("/patient/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;
    const records = await PatientRecord.find({ patientId })
      .populate("doctorId", "profile.fullName email")
      .populate("appointmentId", "department scheduledDate scheduledTime status")
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (err) {
    console.error("[RECORDS BY PATIENT ERROR]", err);
    res.status(500).json({ error: "Server error while fetching records" });
  }
});

module.exports = router;
