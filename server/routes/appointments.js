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
      // requestedDate/Time intentionally not used now
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

    const out = appts.map(a => ({
      _id: a._id,
      department: a.department,
      status: a.status,
      // scheduled fields will be blank until IT sets them
      scheduledDate: a.scheduledDate || "",
      scheduledTime: a.scheduledTime || "",
      patientName: a.patientId?.profile?.fullName || a.patientId?.email || "Unknown Patient",
      doctorName:  a.doctorId?.profile?.fullName  || a.doctorId?.email  || "Unknown Doctor",
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
    if ((status === "approved" || status === "rescheduled") && (!scheduledDate || !scheduledTime)) {
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
        patientName: populated.patientId?.profile?.fullName || populated.patientId?.email,
        doctorName:  populated.doctorId?.profile?.fullName  || populated.doctorId?.email,
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

    const out = appts.map(a => ({
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

/**
 * Appointments for a doctor
 */
router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const appts = await Appointment.find({ doctorId: req.params.doctorId })
      .populate("patientId", "profile.fullName email")
      .sort({ createdAt: -1 });

    const out = appts.map(a => ({
      _id: a._id,
      department: a.department,
      status: a.status,
      scheduledDate: a.scheduledDate || "",
      scheduledTime: a.scheduledTime || "",
      patientName: a.patientId?.profile?.fullName || a.patientId?.email || "Unknown",
    }));

    res.json(out);
  } catch (err) {
    console.error("[DOCTOR APPTS ERROR]", err);
    res.status(500).json({ error: "Server error while fetching doctor appointments" });
  }
});

module.exports = router;


/*const express = require("express");
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Doctor  = require("../models/Doctor");

const router = express.Router();

function nameFrom(doc) {
  if (!doc) return "Unknown";
  return doc.profile?.fullName || doc.email || "Unknown";
}

router.post("/request", async (req, res) => {
  try {
    const { patientId, doctorId, department, requestedDate = "", requestedTime = "" } = req.body;
    if (!patientId || !doctorId || !department) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const appt = await Appointment.create({
      patientId,
      doctorId,
      department,
      requestedDate,
      requestedTime,
      status: "pending",
    });

    res.status(201).json({
      message: "✅ Appointment request sent to IT Worker for approval",
      appointment: appt,
    });
  } catch (err) {
    console.error("[CREATE APPOINTMENT ERROR]", err);
    res.status(500).json({ error: "Server error while creating appointment" });
  }
});


router.get("/pending", async (_req, res) => {
  try {
    const appts = await Appointment.find({ status: "pending" })
      .populate("patientId", "profile.fullName email")
      .populate("doctorId",  "profile.fullName email")
      .sort({ createdAt: -1 });

    const formatted = appts.map(a => ({
      _id: a._id,
      patientName: nameFrom(a.patientId),
      doctorName:  nameFrom(a.doctorId),
      department:  a.department,
      status:      a.status,
      requestedDate: a.requestedDate || "",
      requestedTime: a.requestedTime || "",
      scheduledDate: a.scheduledDate || "",
      scheduledTime: a.scheduledTime || "",
    }));
    res.json(formatted);
  } catch (err) {
    console.error("[FETCH PENDING APPOINTMENTS ERROR]", err);
    res.status(500).json({ error: "Server error while fetching pending appointments" });
  }
});


router.post("/:id/update", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, scheduledDate = "", scheduledTime = "" } = req.body;

    if (!["approved", "rejected", "rescheduled"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const appt = await Appointment.findById(id)
      .populate("patientId", "profile.fullName email")
      .populate("doctorId",  "profile.fullName email");

    if (!appt) return res.status(404).json({ error: "Appointment not found" });

    // Decide final scheduled fields
    let finalScheduledDate = scheduledDate;
    let finalScheduledTime = scheduledTime;

    if (status === "approved") {
      // If approving "as-is" (no schedule sent), copy patient's requested date/time
      if (!finalScheduledDate && appt.requestedDate) finalScheduledDate = appt.requestedDate;
      if (!finalScheduledTime && appt.requestedTime) finalScheduledTime = appt.requestedTime;
    }

    if (status === "rescheduled") {
      // Reschedule requires the new values (can be empty if front-end allows, but that's on purpose)
      // fallthrough to set fields below
    }

    // Apply changes
    appt.status = status;
    if (status === "approved" || status === "rescheduled") {
      appt.scheduledDate = finalScheduledDate || "";
      appt.scheduledTime = finalScheduledTime || "";
    }

    await appt.save();

    res.json({
      message:
        status === "approved"
          ? "✅ Appointment approved"
          : status === "rejected"
          ? "❌ Appointment rejected"
          : "🔁 Appointment rescheduled",
      appointment: {
        _id: appt._id,
        patientName: nameFrom(appt.patientId),
        doctorName:  nameFrom(appt.doctorId),
        department: appt.department,
        status: appt.status,
        requestedDate: appt.requestedDate || "",
        requestedTime: appt.requestedTime || "",
        scheduledDate: appt.scheduledDate || "",
        scheduledTime: appt.scheduledTime || "",
      },
    });
  } catch (err) {
    console.error("[UPDATE APPOINTMENT ERROR]", err);
    res.status(500).json({ error: "Server error while updating appointment" });
  }
});

router.get("/patient/:patientId", async (req, res) => {
  try {
    const appts = await Appointment.find({ patientId: req.params.patientId })
      .populate("doctorId", "profile.fullName email")
      .sort({ createdAt: -1 });

    const formatted = appts.map(a => ({
      _id: a._id,
      doctorName: nameFrom(a.doctorId),
      department: a.department,
      status: a.status,
      requestedDate: a.requestedDate || "",
      requestedTime: a.requestedTime || "",
      scheduledDate: a.scheduledDate || "",
      scheduledTime: a.scheduledTime || "",
    }));
    res.json(formatted);
  } catch (err) {
    console.error("[FETCH PATIENT APPOINTMENTS ERROR]", err);
    res.status(500).json({ error: "Server error while fetching patient appointments" });
  }
});


router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const appts = await Appointment.find({
      doctorId: req.params.doctorId,
      status: { $in: ["approved", "rescheduled"] },
    })
      .populate("patientId", "profile.fullName email")
      .sort({ createdAt: -1 });

    const formatted = appts.map(a => ({
      _id: a._id,
      patientName: nameFrom(a.patientId),
      department: a.department,
      status: a.status,
      requestedDate: a.requestedDate || "",
      requestedTime: a.requestedTime || "",
      scheduledDate: a.scheduledDate || "",
      scheduledTime: a.scheduledTime || "",
    }));
    res.json(formatted);
  } catch (err) {
    console.error("[FETCH DOCTOR APPOINTMENTS ERROR]", err);
    res.status(500).json({ error: "Server error while fetching doctor appointments" });
  }
});

module.exports = router;
*/

/*
// server/routes/appointments.js
const express = require("express");
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

const router = express.Router();

router.post("/request", async (req, res) => {
  try {
    const { patientId, doctorId, department, date = "", time = "" } = req.body;
    if (!patientId || !doctorId || !department) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      department,
      date,  // requested
      time,  // requested
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


router.get("/pending", async (_req, res) => {
  try {
    const appts = await Appointment.find({ status: "pending" })
      .populate("patientId", "profile.fullName email")
      .populate("doctorId", "profile.fullName email")
      .sort({ createdAt: -1 });

    const formatted = appts.map((a) => ({
      _id: a._id,
      patientName: a.patientId?.profile?.fullName || a.patientId?.email || "Unknown Patient",
      doctorName: a.doctorId?.profile?.fullName || a.doctorId?.email || "Unknown Doctor",
      department: a.department,
      status: a.status,
      requestedDate: a.date || "",
      requestedTime: a.time || "",
      scheduledDate: a.scheduledDate || "",
      scheduledTime: a.scheduledTime || "",
    }));

    res.json(formatted);
  } catch (err) {
    console.error("[FETCH PENDING APPOINTMENTS ERROR]", err);
    res.status(500).json({ error: "Server error while fetching pending appointments" });
  }
});


router.post("/:id/update", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, scheduledDate = "", scheduledTime = "", note = "" } = req.body;

    if (!["approved", "rejected", "rescheduled"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const update = { status, note };
    if (scheduledDate) update.scheduledDate = scheduledDate;
    if (scheduledTime) update.scheduledTime = scheduledTime;

    const appt = await Appointment.findByIdAndUpdate(id, update, { new: true })
      .populate("patientId", "profile.fullName email")
      .populate("doctorId", "profile.fullName email");

    if (!appt) return res.status(404).json({ error: "Appointment not found" });

    res.json({
      message:
        status === "approved"
          ? "✅ Appointment approved"
          : status === "rejected"
          ? "❌ Appointment rejected"
          : "🔁 Appointment rescheduled",
      appointment: appt,
    });
  } catch (err) {
    console.error("[UPDATE APPOINTMENT ERROR]", err);
    res.status(500).json({ error: "Server error while updating appointment" });
  }
});

router.get("/patient/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;
    const appts = await Appointment.find({ patientId })
      .populate("doctorId", "profile.fullName email")
      .sort({ createdAt: -1 });

    const formatted = appts.map((a) => ({
      _id: a._id,
      doctorName: a.doctorId?.profile?.fullName || a.doctorId?.email || "Unknown Doctor",
      department: a.department,
      status: a.status,
      requestedDate: a.date || "",
      requestedTime: a.time || "",
      scheduledDate: a.scheduledDate || "",
      scheduledTime: a.scheduledTime || "",
    }));

    res.json(formatted);
  } catch (err) {
    console.error("[FETCH PATIENT APPOINTMENTS ERROR]", err);
    res.status(500).json({ error: "Server error while fetching patient appointments" });
  }
});

router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const { doctorId } = req.params;
    const appts = await Appointment.find({ doctorId })
      .populate("patientId", "profile.fullName email")
      .sort({ createdAt: -1 });

    const formatted = appts.map((a) => ({
      _id: a._id,
      patientName: a.patientId?.profile?.fullName || a.patientId?.email || "Unknown Patient",
      department: a.department,
      status: a.status,
      requestedDate: a.date || "",
      requestedTime: a.time || "",
      scheduledDate: a.scheduledDate || "",
      scheduledTime: a.scheduledTime || "",
    }));

    res.json(formatted);
  } catch (err) {
    console.error("[FETCH DOCTOR APPOINTMENTS ERROR]", err);
    res.status(500).json({ error: "Server error while fetching doctor appointments" });
  }
});

module.exports = router;
*/