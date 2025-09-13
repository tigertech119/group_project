// server/models/Appointment.js
const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctorId:  { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    department: String,

    // what the patient suggested
    requestedDate: { type: String, default: "" },
    requestedTime: { type: String, default: "" },

    // what the IT worker schedules officially
    scheduledDate: { type: String, default: "" },
    scheduledTime: { type: String, default: "" },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "rescheduled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);

/*
// server/models/Appointment.js
const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    department: { type: String, required: true },

    // Patient's requested slot (optional)
    date: { type: String, default: "" }, // requestedDate
    time: { type: String, default: "" }, // requestedTime

    // IT worker scheduled slot (optional)
    scheduledDate: { type: String, default: "" },
    scheduledTime: { type: String, default: "" },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "rescheduled"],
      default: "pending",
    },
    note: { type: String, default: "" }, // optional notes
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);

*/