const mongoose = require("mongoose");

const itWorkerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: "itworker" },
  profile: {
    fullName: String,
    phone: String,
    gender: String,
    specialization: String,
    qualifications: String,
  },
  department: { type: String, default: "Information Technology" },
  systemsAccess: [String],
  isAvailable: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },

  // 🔑 add reset support
  resetCode: String,
  resetCodeExpires: Date,
}, { timestamps: true });

module.exports = mongoose.model("ITWorker", itWorkerSchema);

