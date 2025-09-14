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

    const emailLower = String(email).trim().toLowerCase();

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
      verificationCode,  // save verification code
      isVerified: false, // track verification
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

    const emailLower = String(email).trim().toLowerCase();

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
      verificationCode,       // ensure schema has this
      isVerified: false,      // ensure schema has this
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
// VERIFY EMAIL - COMPLETE VERSION (checks all collections)
// ==========================
router.post("/verify-email", async (req, res) => {
  try {
    const { email, code } = req.body;
    const emailLower = String(email || "").trim().toLowerCase();

    // Check ALL user collections
    const results = await Promise.all([
      Applicant.findOne({ email: emailLower }),
      Patient.findOne({ email: emailLower }),
      Doctor.findOne({ email: emailLower }),
      Nurse.findOne({ email: emailLower }),
      ITWorker.findOne({ email: emailLower }),
      Wardboy.findOne({ email: emailLower }),
      User.findOne({ email: emailLower }) // admin users
    ]);

    const user = results.find(u => u !== null);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // already verified?
    if (user.isVerified) {
      return res.status(400).json({ error: "Email already verified" });
    }

    // code must exist and match
    if (!user.verificationCode || String(user.verificationCode) !== String(code)) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    // mark verified & clear code
    user.verificationCode = undefined;
    user.isVerified = true;
    
    // If applicant, keep status as pending (approval is separate)
    if (user.applicationStatus) {
      user.applicationStatus = "pending";
    }
    
    await user.save();

    return res.json({ 
      success: true,
      message: "✅ Email verified successfully!",
      userType: user.role || user.appliedFor || "patient"
    });

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
    const emailLower = String(email || "").trim().toLowerCase();

    let user = await Applicant.findOne({ email: emailLower });
    let userType = "applicant";

    if (!user) { user = await Doctor.findOne({ email: emailLower }); userType = "doctor"; }
    if (!user) { user = await Nurse.findOne({ email: emailLower }); userType = "nurse"; }
    if (!user) { user = await Patient.findOne({ email: emailLower }); userType = "patient"; }
    if (!user) { user = await ITWorker.findOne({ email: emailLower }); userType = "itworker"; }
    if (!user) { user = await Wardboy.findOne({ email: emailLower }); userType = "wardboy"; }
    if (!user) { user = await User.findOne({ email: emailLower }); userType = "admin"; }

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // Prevent login if not verified (except applicants who are pending but must still be verified)
   // allow admin when the flag is false; enforce when flag is true
const adminVerificationRequired = process.env.ADMIN_VERIFICATION_REQUIRED === "true";

if (userType === "admin") {
  if (adminVerificationRequired && !user.isVerified) {
    return res.status(401).json({ error: "Please verify your email first" });
  }
} else if (userType !== "applicant" && !user.isVerified) {
  return res.status(401).json({ error: "Please verify your email first" });
}


    // Applicants: must be verified; if pending, allow login with "pending" message
    if (userType === "applicant") {
      if (!user.isVerified) {
        return res.status(401).json({ error: "Please verify your email first" });
      }
      
      // NOTE: If you want to also require correct password before showing "pending",
      // you can move the bcrypt.compare() check above this block.
      if (user.applicationStatus === "pending") {
        setAuthCookie(res, user._id.toString(), userType);
        const { passwordHash, verificationCode, resetCode, resetCodeExpires, ...safe } = user.toObject();
        return res.json({
          user: safe,
          userType,
          role: safe.role || "applicant",
          message: "Application pending approval. Please wait for admin/IT worker."
        });
      }
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

    // 🔒 Enforce email verification before approval
    if (!applicant.isVerified) {
      return res.status(400).json({ error: "Applicant must verify email before approval" });
    }

    if (status === "approved") {
      const { email, passwordHash, profile, appliedFor } = applicant;

      let newUser;
      switch (appliedFor) {
        case "doctor":
          newUser = await Doctor.create({ email, passwordHash, role: "doctor", profile, isVerified: true });
          break;
        case "nurse":
          newUser = await Nurse.create({ email, passwordHash, role: "nurse", profile, isVerified: true });
          break;
        case "itworker":
          newUser = await ITWorker.create({ email, passwordHash, role: "itworker", profile, isVerified: true });
          break;
        case "wardboy":
          newUser = await Wardboy.create({ email, passwordHash, role: "wardboy", profile, isVerified: true });
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

// ==========================
// FORGOT PASSWORD
// ==========================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const emailLower = email.trim().toLowerCase();

    // Find user in all collections
    const results = await Promise.all([
      Applicant.findOne({ email: emailLower }),
      Patient.findOne({ email: emailLower }),
      Doctor.findOne({ email: emailLower }),
      Nurse.findOne({ email: emailLower }),
      ITWorker.findOne({ email: emailLower }),
      Wardboy.findOne({ email: emailLower }),
      User.findOne({ email: emailLower }) // admin
    ]);

    const user = results.find(Boolean);
    if (!user) return res.status(404).json({ error: "User not found" });

    // generate reset code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = code;
    user.resetCodeExpires = Date.now() + 15 * 60 * 1000; // valid 15 mins
    await user.save();

    await transporter.sendMail({
      from: `"Apex Hospital" <${process.env.EMAIL_USER}>`,
      to: emailLower,
      subject: "Password Reset - Apex Hospital",
      html: `<p>Hello,</p>
             <p>Use the code below to reset your password (valid 15 minutes):</p>
             <h2>${code}</h2>`
    });

    return res.json({ message: "Reset code sent to email" });
  } catch (err) {
    console.error("[FORGOT PASSWORD ERROR]", err);
    return res.status(500).json({ error: "Server error while requesting password reset" });
  }
});



// ==========================
// RESET PASSWORD
// ==========================
router.post("/reset-password", async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    console.log("RESET PASSWORD ROUTE HIT", req.body); // debug

    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: "Email, code and new password are required" });
    }

    // ✅ 1. Enforce minimum password length
    if (newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    const emailLower = email.trim().toLowerCase();

    const results = await Promise.all([
      Applicant.findOne({ email: emailLower }),
      Patient.findOne({ email: emailLower }),
      Doctor.findOne({ email: emailLower }),
      Nurse.findOne({ email: emailLower }),
      ITWorker.findOne({ email: emailLower }),
      Wardboy.findOne({ email: emailLower }),
      User.findOne({ email: emailLower })
    ]);

    const user = results.find(Boolean);
    if (!user) return res.status(404).json({ error: "User not found" });

    // check reset code validity
    if (!user.resetCode || user.resetCode !== code) {
      return res.status(400).json({ error: "Invalid or expired reset code" });
    }
    if (user.resetCodeExpires && Date.now() > user.resetCodeExpires) {
      return res.status(400).json({ error: "Reset code expired" });
    }

    // ✅ 2. Check if new password is same as old
    const isSame = await bcrypt.compare(newPassword, user.passwordHash);
    if (isSame) {
      return res.status(400).json({ error: "New password must be different from the old password" });
    }

    // ✅ 3. Save the new password (only if valid and different)
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    await user.save();

    return res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("[RESET PASSWORD ERROR]", err);
    return res.status(500).json({ error: "Server error while resetting password" });
  }
});






module.exports = router;
