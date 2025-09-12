const express = require("express");
const Appointment = require("../models/Appointment");

const router = express.Router();

// ==========================
// Create new appointment request
// ==========================
router.post("/request", async (req, res) => {
  try {
    const { patientId, doctorId, department } = req.body;
    if (!patientId || !doctorId || !department) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      department,
      status: "pending",
    });

    res.status(201).json({
      message: "✅ Appointment request sent to IT Worker for approval",
      appointment,
    });
  } catch (err) {
    console.error("[CREATE APPOINTMENT ERROR]", err);
    res.status(500).json({ error: "Server error while creating appointment" });
  }
});

// ==========================
// Get all pending appointments (for IT Worker)
// ==========================
router.get("/pending", async (_req, res) => {
  try {
    const appointments = await Appointment.find({ status: "pending" })
      .populate("patientId", "profile.fullName email")
      .populate("doctorId", "profile.fullName email");

    const formatted = appointments.map((app) => ({
      _id: app._id,
      patientName: app.patientId?.profile?.fullName || app.patientId?.email || "Unknown Patient",
      doctorName: app.doctorId?.profile?.fullName || app.doctorId?.email || "Unknown Doctor",
      department: app.department,
      status: app.status,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("[FETCH PENDING APPOINTMENTS ERROR]", err);
    res.status(500).json({ error: "Server error fetching pending appointments" });
  }
});

// ==========================
// Update appointment status (Approve/Reject by IT Worker)
// ==========================
router.post("/:id/update", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("patientId", "profile.fullName email")
      .populate("doctorId", "profile.fullName email");

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json({
      message: `Appointment ${status} successfully`,
      appointment,
    });
  } catch (err) {
    console.error("[UPDATE APPOINTMENT ERROR]", err);
    res.status(500).json({ error: "Server error while updating appointment" });
  }
});

// ==========================
// Get appointments for a specific patient
// ==========================
router.get("/patient/:patientId", async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.params.patientId })
      .populate("doctorId", "profile.fullName email")
      .sort({ createdAt: -1 });

    const formatted = appointments.map((app) => ({
      _id: app._id,
      doctorName: app.doctorId?.profile?.fullName || app.doctorId?.email,
      department: app.department,
      status: app.status,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("[FETCH PATIENT APPOINTMENTS ERROR]", err);
    res.status(500).json({ error: "Server error while fetching patient appointments" });
  }
});

// ==========================
// Get appointments for a specific doctor
// ==========================
router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.params.doctorId })
      .populate("patientId", "profile.fullName email")
      .sort({ createdAt: -1 });

    const formatted = appointments.map((app) => ({
      _id: app._id,
      patientName: app.patientId?.profile?.fullName || app.patientId?.email,
      department: app.department,
      status: app.status,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("[FETCH DOCTOR APPOINTMENTS ERROR]", err);
    res.status(500).json({ error: "Server error while fetching doctor appointments" });
  }
});

module.exports = router;
