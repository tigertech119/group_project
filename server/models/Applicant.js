const mongoose = require("mongoose");

const applicantSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: "applicant" }, // 👈 added
  appliedFor: { type: String, required: true }, 
  profile: {
    fullName: String,
    phone: String,
    gender: String,
    department: String, 
  },
  applicationStatus: { 
    type: String, 
    enum: ["pending", "approved", "rejected"], 
    default: "pending" 
  },
}, { timestamps: true });
module.exports = mongoose.model("Applicant", applicantSchema);
/*
const mongoose = require("mongoose");

const applicantSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    appliedFor: { type: String, required: true }, // "doctor", "nurse", etc.
    profile: {
      fullName: String,
      phone: String,
      gender: String,
      department: String, // for doctors
    },
    applicationStatus: { 
      type: String, 
      enum: ["pending", "approved", "rejected"], 
      default: "pending" 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Applicant", applicantSchema);

*/