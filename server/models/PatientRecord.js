// server/models/PatientRecord.js
const mongoose = require("mongoose");

const patientRecordSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctorId:  { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true, unique: true },

    diagnosis: String,
    stage: String,
    treatment: String,
    tests: [String],
    prescription: String,
    notes: String,
    nextFollowUp: String,
    
    // Track if note has been viewed by patient
    viewedByPatient: { type: Boolean, default: false },
    lastUpdated: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Ensure one record per appointment
patientRecordSchema.index({ appointmentId: 1 }, { unique: true });

module.exports = mongoose.model("PatientRecord", patientRecordSchema);

/*
const mongoose = require("mongoose");

const patientRecordSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctorId:  { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },

    diagnosis: String,
    stage: String,
    treatment: String,
    tests: [String],          // simple list of tests
    prescription: String,     // free-text prescription (kept simple)
    notes: String,
    nextFollowUp: String,     // text or date string
  },
  { timestamps: true }
);

module.exports = mongoose.model("PatientRecord", patientRecordSchema);
 */
