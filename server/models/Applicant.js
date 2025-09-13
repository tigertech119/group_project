const mongoose = require("mongoose");

const applicantSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: "applicant" },
  appliedFor: { type: String, required: true }, // "doctor" | "nurse" | "itworker" | "wardboy"
  profile: {
    fullName: String,
    phone: String,
    gender: String,
    department: String,
  },
  applicationStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  // ✅ required for OTP flow
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Applicant", applicantSchema);
