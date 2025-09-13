const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "patient" },

    // 👇 your existing profile fields (keep names consistent with your app)
    profile: {
      fullName: String,
      phone: String,
      gender: String,
      dob: Date,
      address: String,
      bloodGroup: String,   // <- matches what your register route writes
    },

    // 👇 collections you already had in the DB screenshot
    allergies: { type: [String], default: [] },
    currentMedications: { type: [String], default: [] },
    medicalHistory: { type: [String], default: [] },

    // ✅ required for email verification flow
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },

    // (optional but nice to have for parity with User)
    resetCode: String,
    resetCodeExpires: Date,
  },
  { timestamps: true }
);

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