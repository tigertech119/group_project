const mongoose = require("mongoose");

const wardboySchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: "wardboy" },
  profile: {
    fullName: String,
    phone: String,
    gender: String,
  },
  assignedWard: String,
  shift: {
    days: [String],
    time: String,
  },
  duties: [String],
  isAvailable: { type: Boolean, default: true },
  // ✅ for consistent login checks
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Wardboy", wardboySchema);

/* 

const mongoose = require("mongoose");

const wardboySchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    profile: {
      fullName: String,
      phone: String,
      gender: String,
    },
    assignedWard: String,
    shift: {
      days: [String],
      time: String
    },
    duties: [String],
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wardboy", wardboySchema);

*/