const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
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
function setAuthCookie(res, uid) {
  const token = jwt.sign({ uid }, process.env.JWT_SECRET, { expiresIn: "7d" });
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
    const existing = await User.findOne({ email: emailLower });
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      email: emailLower,
      passwordHash,
      role: "patient",
      profile: {
        fullName: profile?.fullName || "",
        phone: profile?.phone || "",
        gender: profile?.gender || "",
        dob: profile?.dob || null,
        address: profile?.address || "",
        blood_group: profile?.blood_group || "N/A",
      },
      isVerified: false,
      verificationCode,
    });

    // Send verification email
    await transporter.sendMail({
      from: `"Apex Hospital" <${process.env.EMAIL_USER}>`,
      to: emailLower,
      subject: "Verify your Apex Hospital account",
      html: `<p>Hello ${user.profile?.fullName || "User"},</p>
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
    const existing = await User.findOne({ email: emailLower });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Create user as draft until email verification
    const user = await User.create({
      email: emailLower,
      passwordHash,
      role: role.toLowerCase(),
      profile: {
        fullName: profile?.fullName || "",
        phone: profile?.phone || "",
        gender: profile?.gender || "",
        department: profile?.department || null,
      },
      isVerified: false,             // ✅ must verify email
      verificationCode,              // ✅ send code
      applicationStatus: "draft"     // ✅ draft until email verified
    });

    // Send verification email
    await transporter.sendMail({
      from: `"Apex Hospital" <${process.env.EMAIL_USER}>`,
      to: emailLower,
      subject: "Verify your email - Apex Hospital",
      html: `
        <p>Hello ${user.profile?.fullName || "Applicant"},</p>
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
// GET ALL APPLICANTS (Admin only)
// ==========================
router.get("/applicants", async (req, res) => {
  try {
    const applicants = await User.find({
      role: { $ne: "patient" },
      applicationStatus: { $in: ["pending", "approved", "rejected"] }
    });
    res.json({ applicants });
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

    const applicant = await User.findById(applicantId);
    if (!applicant) return res.status(404).json({ error: "Applicant not found" });

    applicant.applicationStatus = status;
    await applicant.save();

    res.json({ message: `Applicant ${status} successfully!` });
  } catch (err) {
    console.error("[APPROVE APPLICANT ERROR]", err);
    res.status(500).json({ error: "Server error while updating applicant" });
  }
});

// ==========================
// VERIFY EMAIL
// ==========================
router.post("/verify-email", async (req, res) => {
  try {
    const { email, code } = req.body;
    const emailLower = email.trim().toLowerCase();
    const user = await User.findOne({ email: emailLower });

    if (!user) return res.status(400).json({ error: "User not found" });
    if (user.isVerified) return res.status(400).json({ error: "Already verified" });
    if (String(user.verificationCode) !== String(code)) {
      return res.status(400).json({ error: "Invalid code" });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.applicationStatus = "pending"; // 🚩 only now goes to admin
    await user.save();

    res.json({ message: "Email verified successfully. Awaiting admin approval." });
  } catch (err) {
    console.error("[VERIFY EMAIL ERROR]", err);
    res.status(500).json({ error: "Server error while verifying email" });
  }
});


// ==========================
// LOGIN
// ==========================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailLower = email.trim().toLowerCase();
    const user = await User.findOne({ email: emailLower });

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // ✅ Admin and staff check
    if (user.role === "admin" || user.applicationStatus === "approved") {
      // skip verification for admin/staff
    } else if (!user.isVerified) {
      return res.status(401).json({ error: "Please verify your email first" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    setAuthCookie(res, user._id.toString());

    const { passwordHash, verificationCode, resetCode, resetCodeExpires, ...safe } = user.toObject();
    res.json({ user: safe });
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

// ==========================
// FORGOT PASSWORD
// ==========================
router.post("/forgot-password", async (req, res) => {
  try {
    if (!req.body.email) return res.status(400).json({ error: "Email is required" });

    const emailLower = req.body.email.trim().toLowerCase();
    const user = await User.findOne({ email: emailLower });
    if (!user) return res.status(400).json({ error: "No account found with this email" });

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = resetCode;
    user.resetCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await transporter.sendMail({
      from: `"Apex Hospital" <${process.env.EMAIL_USER}>`,
      to: emailLower,
      subject: "Password Reset Code - Apex Hospital",
      html: `<h2>${resetCode}</h2><p>Valid for 10 minutes</p>`
    });

    res.json({ message: "Reset code sent to your email" });
  } catch (err) {
    console.error("[FORGOT PASSWORD ERROR]", err);
    res.status(500).json({ error: "Server error while sending reset code" });
  }
});

// ==========================
// RESET PASSWORD
// ==========================
router.post("/reset-password", async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: "Email, code and new password are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const emailLower = email.trim().toLowerCase();
    const user = await User.findOne({ email: emailLower });
    if (!user) return res.status(400).json({ error: "User not found" });

    if (String(user.resetCode) !== String(code)) {
      return res.status(400).json({ error: "Invalid reset code" });
    }

    if (!user.resetCodeExpires || Date.now() > new Date(user.resetCodeExpires).getTime()) {
      return res.status(400).json({ error: "Expired reset code" });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.passwordHash);
    if (isSamePassword) {
      return res.status(400).json({ error: "New password must be different" });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("[RESET PASSWORD ERROR]", err);
    res.status(500).json({ error: "Server error while resetting password" });
  }
});

module.exports = router;
