
// server/routes/appointments.js
const express = require("express");
const Appointment = require("../models/Appointment");

const router = express.Router();

/**
 * Patient creates a request (no date/time here)
 */
router.post("/request", async (req, res) => {
  try {
    const { patientId, doctorId, department } = req.body;
    if (!patientId || !doctorId || !department) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const appt = await Appointment.create({
      patientId,
      doctorId,
      department,
      status: "pending",
    });

    res.status(201).json({
      message: "✅ Appointment request sent to IT Worker for approval",
      appointment: appt,
    });
  } catch (err) {
    console.error("[CREATE APPT ERROR]", err);
    res.status(500).json({ error: "Server error while creating appointment" });
  }
});

/**
 * Pending list for IT worker (names already formatted)
 */
router.get("/pending", async (_req, res) => {
  try {
    const appts = await Appointment.find({ status: "pending" })
      .populate("patientId", "profile.fullName email")
      .populate("doctorId", "profile.fullName email")
      .sort({ createdAt: -1 });

    const out = appts.map((a) => ({
      _id: a._id,
      department: a.department,
      status: a.status,
      scheduledDate: a.scheduledDate || "",
      scheduledTime: a.scheduledTime || "",
      patientName:
        a.patientId?.profile?.fullName || a.patientId?.email || "Unknown Patient",
      doctorName:
        a.doctorId?.profile?.fullName || a.doctorId?.email || "Unknown Doctor",
    }));

    res.json(out);
  } catch (err) {
    console.error("[PENDING APPTS ERROR]", err);
    res.status(500).json({ error: "Server error while fetching pending appointments" });
  }
});

/**
 * IT worker updates status/schedule.
 * If status=approved or rescheduled, scheduledDate & scheduledTime are REQUIRED.
 */
router.post("/:id/update", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, scheduledDate = "", scheduledTime = "" } = req.body;

    if (!["approved", "rejected", "rescheduled"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // For approved/rescheduled, we require a schedule (IT worker decides this)
    if (
      (status === "approved" || status === "rescheduled") &&
      (!scheduledDate || !scheduledTime)
    ) {
      return res.status(400).json({ error: "Please provide scheduled date & time" });
    }

    const appt = await Appointment.findById(id);
    if (!appt) return res.status(404).json({ error: "Appointment not found" });

    appt.status = status;
    if (status === "approved" || status === "rescheduled") {
      appt.scheduledDate = scheduledDate;
      appt.scheduledTime = scheduledTime;
    }

    await appt.save();

    const populated = await Appointment.findById(id)
      .populate("patientId", "profile.fullName email")
      .populate("doctorId", "profile.fullName email");

    res.json({
      message:
        status === "approved"
          ? "✅ Appointment approved"
          : status === "rejected"
          ? "❌ Appointment rejected"
          : "🔁 Appointment rescheduled",
      appointment: {
        _id: populated._id,
        department: populated.department,
        status: populated.status,
        scheduledDate: populated.scheduledDate || "",
        scheduledTime: populated.scheduledTime || "",
        patientName:
          populated.patientId?.profile?.fullName || populated.patientId?.email,
        doctorName:
          populated.doctorId?.profile?.fullName || populated.doctorId?.email,
      },
    });
  } catch (err) {
    console.error("[UPDATE APPT ERROR]", err);
    res.status(500).json({ error: "Server error while updating appointment" });
  }
});

/**
 * Appointments for a patient
 */
router.get("/patient/:patientId", async (req, res) => {
  try {
    const appts = await Appointment.find({ patientId: req.params.patientId })
      .populate("doctorId", "profile.fullName email")
      .sort({ createdAt: -1 });

    const out = appts.map((a) => ({
      _id: a._id,
      department: a.department,
      status: a.status,
      scheduledDate: a.scheduledDate || "",
      scheduledTime: a.scheduledTime || "",
      doctorName: a.doctorId?.profile?.fullName || a.doctorId?.email || "Unknown Doctor",
    }));

    res.json(out);
  } catch (err) {
    console.error("[PATIENT APPTS ERROR]", err);
    res.status(500).json({ error: "Server error while fetching patient appointments" });
  }
});

// Add to server/routes/appointments.js
/**
 * Get appointments for doctor with pagination
 */
router.get("/doctor/:doctorId/paginated", async (req, res) => {
  try {
    const { doctorId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const appointments = await Appointment.find({ 
      doctorId, 
      status: { $in: ["approved", "rescheduled"] } 
    })
      .populate("patientId", "profile.fullName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Appointment.countDocuments({ 
      doctorId, 
      status: { $in: ["approved", "rescheduled"] } 
    });

    const formatted = appointments.map(a => ({
      _id: a._id,
      patientName: a.patientId?.profile?.fullName || a.patientId?.email || "Unknown",
      department: a.department,
      status: a.status,
      scheduledDate: a.scheduledDate || "",
      scheduledTime: a.scheduledTime || "",
      patientId: a.patientId?._id?.toString() || null,
    }));

    res.json({
      appointments: formatted,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalAppointments: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (err) {
    console.error("[PAGINATED DOCTOR APPTS ERROR]", err);
    res.status(500).json({ error: "Server error while fetching appointments" });
  }
});




/**
 * Appointments for a doctor
 *  – includes patientId so the doctor can create a visit note
 */
router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const appts = await Appointment.find({ doctorId: req.params.doctorId })
      .populate("patientId", "profile.fullName email")
      .sort({ createdAt: -1 });

    const out = appts.map((a) => ({
      _id: a._id,
      department: a.department,
      status: a.status,
      scheduledDate: a.scheduledDate || "",
      scheduledTime: a.scheduledTime || "",
      // >>> include raw patientId for visit-notes
      patientId: a.patientId?._id?.toString() || null,
      patientName: a.patientId?.profile?.fullName || a.patientId?.email || "Unknown",
    }));

    res.json(out);
  } catch (err) {
    console.error("[DOCTOR APPTS ERROR]", err);
    res.status(500).json({ error: "Server error while fetching doctor appointments" });
  }
});

module.exports = router;

