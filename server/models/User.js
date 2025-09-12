const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: "admin" }, // 👈 keep for admins
  profile: {
    fullName: String,
    phone: String,
    gender: String,
    dob: Date,
    address: String,
    blood_group: String,
    department: String,
  },
  isVerified: { type: Boolean, default: false },
  verificationCode: String,
  resetCode: String,
  resetCodeExpires: Date,
  applicationStatus: { 
    type: String, 
    enum: ["draft", "pending", "approved", "rejected"], 
    default: "draft" 
  },
}, { timestamps: true });
module.exports = mongoose.model("User", userSchema);

/*const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { 
      type: String, 
      enum: ["patient", "doctor", "nurse", "wardboy", "it worker", "admin"], 
      default: "patient" 
    },
    profile: {
      fullName: String,
      phone: String,
      gender: String,
      dob: Date,
      address: String,
      blood_group: String,
      department: String, // for doctors
    },
    isVerified: { type: Boolean, default: false },   // email verification
    verificationCode: String,                        // OTP for email
    resetCode: String,
    resetCodeExpires: Date,

    // 🟢 NEW flow for applications:
    // draft → before email verification
    // pending → email verified, waiting admin approval
    // approved → admin approved
    // rejected → admin rejected
    applicationStatus: { 
      type: String, 
      enum: ["draft", "pending", "approved", "rejected"], 
      default: "draft" 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
*/
//------------------------------------------------------------------
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