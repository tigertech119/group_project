// server/routes/records.js





/*
const express = require("express");
const mongoose = require("mongoose");

const PatientRecord = require("../models/PatientRecord"); // ensure this model exists (see note below)
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

const router = express.Router();

 
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

*/// server/routes/records.js
const express = require("express");
const mongoose = require("mongoose");
const PatientRecord = require("../models/PatientRecord");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

const router = express.Router();

/**
 * Create or update patient record for an appointment
 */
router.post("/", async (req, res) => {
  try {
    const {
      appointmentId,
      doctorId,
      patientId,
      diagnosis,
      stage,
      treatment,
      tests,
      prescription,
      notes,
      nextFollowUp,
    } = req.body;

    if (!appointmentId || !doctorId || !patientId) {
      return res.status(400).json({ error: "appointmentId, doctorId, and patientId are required" });
    }

    // Validate references
    const [patient, doctor, appointment] = await Promise.all([
      Patient.findById(patientId).select("_id"),
      Doctor.findById(doctorId).select("_id"),
      Appointment.findById(appointmentId).select("_id"),
    ]);
    
    if (!patient) return res.status(404).json({ error: "Patient not found" });
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });
    if (!appointment) return res.status(404).json({ error: "Appointment not found" });

    const normalizedTests = Array.isArray(tests)
      ? tests
      : (typeof tests === "string" && tests.trim()
          ? tests.split(",").map(s => s.trim()).filter(Boolean)
          : []);

    // Upsert - update existing or create new
    const record = await PatientRecord.findOneAndUpdate(
      { appointmentId },
      {
        patientId,
        doctorId,
        diagnosis: diagnosis || "",
        stage: stage || "",
        treatment: treatment || "",
        tests: normalizedTests,
        prescription: prescription || "",
        notes: notes || "",
        nextFollowUp: nextFollowUp || "",
        lastUpdated: new Date()
      },
      { 
        upsert: true, 
        new: true,
        runValidators: true 
      }
    ).populate("doctorId", "profile.fullName email")
     .populate("appointmentId", "department scheduledDate scheduledTime status");

    return res.status(200).json({ 
      message: "Record saved successfully", 
      record 
    });
  } catch (err) {
    console.error("[RECORD CREATE/UPDATE ERROR]", err);
    res.status(500).json({ error: "Server error while saving record" });
  }
});

/**
 * GET records for a doctor with pagination
 */
router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const { doctorId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const records = await PatientRecord.find({ doctorId })
      .populate("patientId", "profile.fullName email")
      .populate("appointmentId", "department scheduledDate scheduledTime status patientId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await PatientRecord.countDocuments({ doctorId });

    res.json({
      records,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (err) {
    console.error("[RECORDS BY DOCTOR ERROR]", err);
    res.status(500).json({ error: "Server error while fetching records" });
  }
});

/**
 * GET records for a patient with pagination
 */
router.get("/patient/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const records = await PatientRecord.find({ patientId })
      .populate("doctorId", "profile.fullName email")
      .populate("appointmentId", "department scheduledDate scheduledTime status")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await PatientRecord.countDocuments({ patientId });

    // Mark as viewed when patient accesses them
    await PatientRecord.updateMany(
      { patientId, _id: { $in: records.map(r => r._id) } },
      { viewedByPatient: true }
    );

    res.json({
      records,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (err) {
    console.error("[RECORDS BY PATIENT ERROR]", err);
    res.status(500).json({ error: "Server error while fetching records" });
  }
});

/**
 * GET single record by appointment ID
 */
router.get("/appointment/:appointmentId", async (req, res) => {
  try {
    const { appointmentId } = req.params;
    
    const record = await PatientRecord.findOne({ appointmentId })
      .populate("doctorId", "profile.fullName email")
      .populate("patientId", "profile.fullName email")
      .populate("appointmentId", "department scheduledDate scheduledTime status");

    if (!record) {
      return res.status(404).json({ error: "Record not found for this appointment" });
    }

    res.json(record);
  } catch (err) {
    console.error("[RECORD BY APPOINTMENT ERROR]", err);
    res.status(500).json({ error: "Server error while fetching record" });
  }
});

module.exports = router;