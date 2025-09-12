const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Applicant = require("../models/Applicant");
const Doctor = require("../models/Doctor");
const Nurse = require("../models/Nurse");
const Patient = require("../models/Patient");
const ITWorker = require("../models/ITWorker");
const Wardboy = require("../models/Wardboy");
const nodemailer = require("nodemailer");

const router = express.Router();

// ==========================
// Email transporter (Gmail SMTP)
// ==========================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { 
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS 
  }
});

// ==========================
// JWT Cookie Helper
// ==========================
function setAuthCookie(res, uid, userType) {
  const token = jwt.sign({ uid, userType }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

// ==========================
// REGISTER (Patients)
// ==========================
router.post("/register", async (req, res) => {
  try {
    const { email, password, profile } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    if (password.length < 6)
      return res.status(400).json({ error: "Password must be at least 6 characters" });

    const emailLower = email.trim().toLowerCase();

    // Check if email exists in any collection
    const existingUser = await User.findOne({ email: emailLower });
    const existingPatient = await Patient.findOne({ email: emailLower });
    if (existingUser || existingPatient) return res.status(409).json({ error: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const patient = await Patient.create({
      email: emailLower,
      passwordHash,
      role: "patient",
      verificationCode,  // ✅ save verification code
      isVerified: false, // ✅ track verification
      profile: {
        fullName: profile?.fullName || "",
        phone: profile?.phone || "",
        gender: profile?.gender || "",
        dob: profile?.dob || null,
        address: profile?.address || "",
        bloodGroup: profile?.blood_group || "N/A",
      },
    });

    await transporter.sendMail({
      from: `"Apex Hospital" <${process.env.EMAIL_USER}>`,
      to: emailLower,
      subject: "Verify your Apex Hospital account",
      html: `<p>Hello ${patient.profile?.fullName || "User"},</p>
             <p>Welcome to Apex Hospital! Use the code below to verify your account:</p>
             <h2>${verificationCode}</h2>`
    });

    return res.status(201).json({ message: "Verification code sent to email" });
  } catch (err) {
    console.error("[REGISTER ERROR]", err);
    return res.status(500).json({ error: "Server error while registering" });
  }
});

// ==========================
// APPLY JOB (Doctors/Staff)
// ==========================
router.post("/apply-job", async (req, res) => {
  try {
    const { email, password, role, profile } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ error: "Email, password and role are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const emailLower = email.trim().toLowerCase();

    // Check if email exists anywhere
    const existingApplicant = await Applicant.findOne({ email: emailLower });
    const existingUser = await User.findOne({ email: emailLower });
    const existingDoctor = await Doctor.findOne({ email: emailLower });
    const existingNurse = await Nurse.findOne({ email: emailLower });
    const existingITWorker = await ITWorker.findOne({ email: emailLower });
    const existingWardboy = await Wardboy.findOne({ email: emailLower });
    if (existingApplicant || existingUser || existingDoctor || existingNurse || existingITWorker || existingWardboy) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const applicant = await Applicant.create({
      email: emailLower,
      passwordHash,
      role: "applicant",
      appliedFor: role.toLowerCase().replace(/\s+/g, ""), // normalize role
      applicationStatus: "pending",
      verificationCode,
      profile: {
        fullName: profile?.fullName || "",
        phone: profile?.phone || "",
        gender: profile?.gender || "",
        department: profile?.department || null,
      },
    });

    await transporter.sendMail({
      from: `"Apex Hospital" <${process.env.EMAIL_USER}>`,
      to: emailLower,
      subject: "Verify your email - Apex Hospital",
      html: `<p>Hello ${applicant.profile?.fullName || "Applicant"},</p>
             <p>Thank you for applying as a <b>${role}</b>.</p>
             <p>Your verification code is:</p>
             <h2>${verificationCode}</h2>`
    });

    return res.status(201).json({
      message: "Application submitted. Please check your email for a verification code.",
      next: "/verify-email"
    });

  } catch (err) {
    console.error("[APPLY JOB ERROR]", err);
    return res.status(500).json({ error: "Server error while applying for job" });
  }
});

// ==========================
// VERIFY EMAIL
// ==========================
router.post("/verify-email", async (req, res) => {
  try {
    const { email, code } = req.body;
    const emailLower = email.trim().toLowerCase();

    const applicant = await Applicant.findOne({ email: emailLower });
    const patient = await Patient.findOne({ email: emailLower });

    if (!applicant && !patient) {
      return res.status(400).json({ error: "User not found" });
    }

    if (applicant) {
      if (String(applicant.verificationCode) !== String(code)) {
        return res.status(400).json({ error: "Invalid code" });
      }
      applicant.verificationCode = undefined;
      applicant.isVerified = true;
      applicant.applicationStatus = "pending";
      await applicant.save();
      return res.json({ message: "✅ Applicant email verified, awaiting admin approval." });
    }

    if (patient) {
      if (String(patient.verificationCode) !== String(code)) {
        return res.status(400).json({ error: "Invalid code" });
      }
      patient.verificationCode = undefined;
      patient.isVerified = true;
      await patient.save();
      return res.json({ message: "✅ Patient email verified. You can now log in." });
    }

  } catch (err) {
    console.error("[VERIFY EMAIL ERROR]", err);
    return res.status(500).json({ error: "Server error while verifying email" });
  }
});

// ==========================
// LOGIN
// ==========================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailLower = email.trim().toLowerCase();

    let user = await Applicant.findOne({ email: emailLower });
    let userType = "applicant";

    if (!user) { user = await Doctor.findOne({ email: emailLower }); userType = "doctor"; }
    if (!user) { user = await Nurse.findOne({ email: emailLower }); userType = "nurse"; }
    if (!user) { user = await Patient.findOne({ email: emailLower }); userType = "patient"; }
    if (!user) { user = await ITWorker.findOne({ email: emailLower }); userType = "itworker"; }
    if (!user) { user = await Wardboy.findOne({ email: emailLower }); userType = "wardboy"; }
    if (!user) { user = await User.findOne({ email: emailLower }); userType = "admin"; }

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // check if applicant is still pending
    if (userType === "applicant" && user.applicationStatus === "pending") {
      setAuthCookie(res, user._id.toString(), userType);
      const { passwordHash, verificationCode, resetCode, resetCodeExpires, ...safe } = user.toObject();
      return res.json({
        user: safe,
        userType,
        role: safe.role || "applicant",
        message: "Application pending approval. Please wait for admin/IT worker."
      });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    setAuthCookie(res, user._id.toString(), userType);
    const { passwordHash, verificationCode, resetCode, resetCodeExpires, ...safe } = user.toObject();

    return res.json({
      user: safe,
      userType,
      role: safe.role || userType
    });

  } catch (err) {
    console.error("[LOGIN ERROR]", err);
    return res.status(500).json({ error: "Server error while logging in" });
  }
});

// ==========================
// GET ALL APPLICANTS (Admin)
// ==========================
router.get("/applicants", async (_req, res) => {
  try {
    const applicants = await Applicant.find({ applicationStatus: "pending" });
    return res.json({ applicants });
  } catch (err) {
    console.error("[GET APPLICANTS ERROR]", err);
    return res.status(500).json({ error: "Server error while fetching applicants" });
  }
});

// ==========================
// APPROVE / REJECT APPLICANT
// ==========================
router.post("/approve-applicant", async (req, res) => {
  try {
    const { applicantId, status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const applicant = await Applicant.findById(applicantId);
    if (!applicant) return res.status(404).json({ error: "Applicant not found" });

    if (status === "approved") {
      const { email, passwordHash, profile, appliedFor } = applicant;

      let newUser;
      switch (appliedFor) {
        case "doctor":
          newUser = await Doctor.create({ email, passwordHash, role: "doctor", profile });
          break;
        case "nurse":
          newUser = await Nurse.create({ email, passwordHash, role: "nurse", profile });
          break;
        case "itworker":
          newUser = await ITWorker.create({ email, passwordHash, role: "itworker", profile });
          break;
        case "wardboy":
          newUser = await Wardboy.create({ email, passwordHash, role: "wardboy", profile });
          break;
        default:
          return res.status(400).json({ error: "Invalid role" });
      }

      await Applicant.findByIdAndDelete(applicantId);
      return res.json({ message: `✅ Applicant approved as ${appliedFor}` });
    }

    applicant.applicationStatus = "rejected";
    await applicant.save();
    return res.json({ message: "❌ Applicant rejected" });

  } catch (err) {
    console.error("[APPROVE APPLICANT ERROR]", err);
    return res.status(500).json({ error: "Server error while updating applicant" });
  }
});

// ==========================
// LOGOUT
// ==========================
router.post("/logout", (_req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production"
  });
  return res.json({ ok: true });
});

module.exports = router;


 /*

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Applicant = require("../models/Applicant");
const Doctor = require("../models/Doctor");
const Nurse = require("../models/Nurse");
const Patient = require("../models/Patient");
const ITWorker = require("../models/ITWorker");
const Wardboy = require("../models/Wardboy");
const nodemailer = require("nodemailer");

const router = express.Router();
// ==========================
// GET ALL APPLICANTS (Admin only)
// ==========================
router.get("/applicants", async (req, res) => {
  try {
    const applicants = await Applicant.find({ applicationStatus: "pending" });
    res.json({ applicants }); // ✅ always return JSON
  } catch (err) {
    console.error("[GET APPLICANTS ERROR]", err);
    res.status(500).json({ error: "Server error while fetching applicants" });
  }
});
// ==========================
// APPROVE / REJECT APPLICANT (Admin only)
// ==========================
router.post("/approve-applicant", async (req, res) => {
  try {
    const { applicantId, status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const applicant = await Applicant.findById(applicantId);
    if (!applicant) return res.status(404).json({ error: "Applicant not found" });

    if (status === "approved") {
      const { email, passwordHash, profile, appliedFor } = applicant;
      let newUser;

      switch (appliedFor) {
        case "doctor":
          newUser = await Doctor.create({ email, passwordHash, role: "doctor", profile });
          break;
        case "nurse":
          newUser = await Nurse.create({ email, passwordHash, role: "nurse", profile });
          break;
        case "itworker":
          newUser = await ITWorker.create({ email, passwordHash, role: "itworker", profile });
          break;
        case "wardboy":
          newUser = await Wardboy.create({ email, passwordHash, role: "wardboy", profile });
          break;
        default:
          return res.status(400).json({ error: "Invalid role" });
      }

      await Applicant.findByIdAndDelete(applicantId);
      return res.json({ message: `✅ Applicant approved as ${appliedFor}` });
    } else {
      applicant.applicationStatus = "rejected";
      await applicant.save();
      return res.json({ message: "❌ Applicant rejected" });
    }
  } catch (err) {
    console.error("[APPROVE APPLICANT ERROR]", err);
    res.status(500).json({ error: "Server error while updating applicant" });
  }
});

// ==========================
// Email transporter (Gmail SMTP)
// ==========================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { 
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS 
  }
});

// ==========================
// JWT Cookie Helper
// ==========================
function setAuthCookie(res, uid, userType) {
  const token = jwt.sign({ uid, userType }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

// ==========================
// REGISTER (Patients)
// ==========================
router.post("/register", async (req, res) => {
  try {
    const { email, password, profile } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    if (password.length < 6)
      return res.status(400).json({ error: "Password must be at least 6 characters" });

    const emailLower = email.trim().toLowerCase();
    
    // Check if email exists in any collection
    const existingUser = await User.findOne({ email: emailLower });
    const existingPatient = await Patient.findOne({ email: emailLower });
    if (existingUser || existingPatient) return res.status(409).json({ error: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const patient = await Patient.create({
      email: emailLower,
      passwordHash,
      role: "patient", // ✅ ensure role is set
      profile: {
        fullName: profile?.fullName || "",
        phone: profile?.phone || "",
        gender: profile?.gender || "",
        dob: profile?.dob || null,
        address: profile?.address || "",
        bloodGroup: profile?.blood_group || "N/A",
      },
    });

    // Send verification email
    await transporter.sendMail({
      from: `"Apex Hospital" <${process.env.EMAIL_USER}>`,
      to: emailLower,
      subject: "Verify your Apex Hospital account",
      html: `<p>Hello ${patient.profile?.fullName || "User"},</p>
             <p>Welcome to Apex Hospital! Use the code below to verify your account:</p>
             <h2>${verificationCode}</h2>`
    });

    res.status(201).json({ message: "Verification code sent to email" });
  } catch (err) {
    console.error("[REGISTER ERROR]", err);
    res.status(500).json({ error: "Server error while registering" });
  }
});

// ==========================
// APPLY JOB (Doctors/Staff)
// ==========================
router.post("/apply-job", async (req, res) => {
  try {
    const { email, password, role, profile } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: "Email, password and role are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const emailLower = email.trim().toLowerCase();

    // ✅ Check if email exists in any collection
    const existingApplicant = await Applicant.findOne({ email: emailLower });
    const existingUser = await User.findOne({ email: emailLower });
    const existingDoctor = await Doctor.findOne({ email: emailLower });
    const existingNurse = await Nurse.findOne({ email: emailLower });
    const existingITWorker = await ITWorker.findOne({ email: emailLower });
    const existingWardboy = await Wardboy.findOne({ email: emailLower });

    if (existingApplicant || existingUser || existingDoctor || existingNurse || existingITWorker || existingWardboy) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ Create applicant with role + applicationStatus
    const applicant = await Applicant.create({
      email: emailLower,
      passwordHash,
      role: "applicant",
      appliedFor: role.toLowerCase().replace(/\s+/g, ""),

      applicationStatus: "pending",
      profile: {
        fullName: profile?.fullName || "",
        phone: profile?.phone || "",
        gender: profile?.gender || "",
        department: profile?.department || null,
      },
      verificationCode,
    });

    // ✅ Send verification email
    await transporter.sendMail({
      from: `"Apex Hospital" <${process.env.EMAIL_USER}>`,
      to: emailLower,
      subject: "Verify your email - Apex Hospital",
      html: `
        <p>Hello ${applicant.profile?.fullName || "Applicant"},</p>
        <p>Thank you for applying as a <b>${role}</b>.</p>
        <p>Your verification code is:</p>
        <h2>${verificationCode}</h2>
        <p>Please enter this code on the verification page to continue your application.</p>
      `,
    });

    res.status(201).json({
      message: "Application submitted. Please check your email for a verification code.",
      next: "/verify-email"
    });

  } catch (err) {
    console.error("[APPLY JOB ERROR]", err);
    res.status(500).json({ error: "Server error while applying for job" });
  }
});


// ==========================
// LOGIN (Updated for multiple collections + role)
// ==========================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailLower = email.trim().toLowerCase();
    
    // Check all collections
    let user = await Applicant.findOne({ email: emailLower });
    let userType = "applicant";
    
    if (!user) { user = await Doctor.findOne({ email: emailLower }); userType = "doctor"; }
    if (!user) { user = await Nurse.findOne({ email: emailLower }); userType = "nurse"; }
    if (!user) { user = await Patient.findOne({ email: emailLower }); userType = "patient"; }
    if (!user) { user = await ITWorker.findOne({ email: emailLower }); userType = "itworker"; }
    if (!user) { user = await Wardboy.findOne({ email: emailLower }); userType = "wardboy"; }
    if (!user) { user = await User.findOne({ email: emailLower }); userType = "admin"; }

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

// Applicants can log in but only see ApplicantDashboard until approved
if (userType === "applicant" && user.applicationStatus === "pending") {
  setAuthCookie(res, user._id.toString(), userType);
  const { passwordHash, verificationCode, resetCode, resetCodeExpires, ...safe } = user.toObject();
  return res.json({
    user: safe,
    userType,
    role: safe.role || "applicant",
    message: "Application pending approval. Please wait for admin/IT worker."
  });
}



    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    // Create cookie
    setAuthCookie(res, user._id.toString(), userType);

    const { passwordHash, verificationCode, resetCode, resetCodeExpires, ...safe } = user.toObject();

    res.json({
      user: safe,
      userType,
      role: safe.role || userType   // ✅ Always include role
    });
  } catch (err) {
    console.error("[LOGIN ERROR]", err);
    res.status(500).json({ error: "Server error while logging in" });
  }
});

// ==========================
// LOGOUT
// ==========================
router.post("/logout", (_req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production"
  });
  res.json({ ok: true });
});

module.exports = router;

*/

