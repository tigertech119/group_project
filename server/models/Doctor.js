const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: "doctor" },
  profile: {
    fullName: String,
    phone: String,
    gender: String,
    department: { type: String, required: true },
    specialization: String,
    qualifications: String,
    experience: Number,
  },
  schedule: {
    days: [String],
    timeSlots: [String],
  },
  isAvailable: { type: Boolean, default: true },
  // ✅ for consistent login checks
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Doctor", doctorSchema);

/*
const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    profile: {
      fullName: String,
      phone: String,
      gender: String,
      department: { type: String, required: true },
      specialization: String,
      qualifications: String,
      experience: Number,
    },
    schedule: {
      days: [String], // ["Monday", "Wednesday", "Friday"]
      timeSlots: [String], // ["9:00-11:00", "2:00-4:00"]
    },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
*/