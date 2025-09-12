const mongoose = require("mongoose");

const itWorkerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: "itworker" }, // 👈 added
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
}, { timestamps: true });
module.exports = mongoose.model("ITWorker", itWorkerSchema);

/*
const mongoose = require("mongoose");

const itWorkerSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("ITWorker", itWorkerSchema);
*/