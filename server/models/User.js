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
    passwordHash: { type: String, required: true }, // hashed password
    role: { type: String, enum: ["patient", "doctor", "admin"], default: "patient" },
    profile: { type: ProfileSchema, default: {} }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
