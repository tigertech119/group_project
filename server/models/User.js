const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["patient", "doctor", "admin", "staff"], default: "patient" },
    profile: {
      name: { type: String },
      phone: { type: String },
      gender: { type: String },
      address: { type: String },
      blood_group: { type: String },   
    },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    resetCode: { type: String },
    resetCodeExpires: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

/*
const mongoose = require("mongoose");

// Embedded profile info
const ProfileSchema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true },
    phone: { type: String, trim: true },
    gender: { type: String, enum: ["male", "female", "other"], default: "other" },
    dob: { type: Date },
    bloodGroup: { type: String, trim: true },
    address: { type: String, trim: true }
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { 
       type: String, 
       enum: ["patient", "doctor", "admin", "nurse", "wardboy", "it worker", "staff", "applicant"],
       default: "patient" 
    },
    profile: { type: ProfileSchema, default: {} },
    // ✅ NEW FIELDS FOR APPLICANTS
    appliedFor: { type: String }, // Stores which job they applied for ("doctor", "nurse", etc.)
    applicationStatus: { 
      type: String, 
      enum: ["pending", "approved", "rejected"],
      default: "pending" 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
*/