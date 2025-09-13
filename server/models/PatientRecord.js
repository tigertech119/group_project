// server/models/PatientRecord.js
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
