const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: "patient" }, // 👈 added
  profile: {
    fullName: String,
    phone: String,
    gender: String,
    dob: Date,
    address: String,
    bloodGroup: String,
    emergencyContact: String,
  },
  medicalHistory: [{
    condition: String,
    diagnosedDate: Date,
    treatment: String
  }],
  allergies: [String],
  currentMedications: [String],
}, { timestamps: true });

module.exports = mongoose.model("Patient", patientSchema);
/*
const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    profile: {
      fullName: String,
      phone: String,
      gender: String,
      dob: Date,
      address: String,
      bloodGroup: String,
      emergencyContact: String,
    },
    medicalHistory: [{
      condition: String,
      diagnosedDate: Date,
      treatment: String
    }],
    allergies: [String],
    currentMedications: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);


 */