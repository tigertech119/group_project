const mongoose = require("mongoose");

const nurseSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: "nurse" },
  profile: {
    fullName: String,
    phone: String,
    gender: String,
    qualifications: String,
    experience: Number,
  },
  ward: String,
  shift: {
    days: [String],
    time: String,
  },
  isAvailable: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },

  // 🔑 add reset support
  resetCode: String,
  resetCodeExpires: Date,
}, { timestamps: true });

module.exports = mongoose.model("Nurse", nurseSchema);

/*
const mongoose = require("mongoose");

const nurseSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    profile: {
      fullName: String,
      phone: String,
      gender: String,
      qualifications: String,
      experience: Number,
    },
    ward: String,
    shift: {
      days: [String],
      time: String
    },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Nurse", nurseSchema);
*/