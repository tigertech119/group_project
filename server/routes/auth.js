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
// REGISTER
// ==========================
router.post("/register", async (req, res) => {
  try {
    const { email, password, profile } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });
    if (password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters" });

    const emailLower = email.trim().toLowerCase();
    const existing = await User.findOne({ email: emailLower });
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      email: emailLower,
      passwordHash,
      role: "patient",  // default role
      profile: profile || {},
      isVerified: false,
      verificationCode
    });

    // Send verification email
    await transporter.sendMail({
      from: `"Apex Hospital" <${process.env.EMAIL_USER}>`,
      to: emailLower,
      subject: "Verify your Apex Hospital account",
      html: `<p>Hello ${user.profile?.name || "User"},</p>
             <p>Welcome to Apex Hospital! Use the code below to verify your account:</p>
             <h2>${verificationCode}</h2>
             <p>If you didn’t request this, you can ignore this email.</p>`
    });

    res.status(201).json({ message: "Verification code sent to email" });
  } catch (err) {
    console.error("[REGISTER ERROR]", err);
    res.status(500).json({ error: "Server error while registering" });
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
    if (user.verificationCode !== code) return res.status(400).json({ error: "Invalid code" });

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
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
    if (!user.isVerified) return res.status(401).json({ error: "Please verify your email first" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    setAuthCookie(res, user._id.toString());

    const { passwordHash, verificationCode, resetCode, ...safe } = user.toObject();
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
    await user.save();

    console.log(`[FORGOT PASSWORD] Reset code ${resetCode} for ${emailLower}`);

    await transporter.sendMail({
      from: `"Apex Hospital" <${process.env.EMAIL_USER}>`,
      to: emailLower,
      subject: "Password Reset Code - Apex Hospital",
      html: `<p>Hello ${user.profile?.name || "User"},</p>
             <p>You requested a password reset. Use the code below:</p>
             <h2>${resetCode}</h2>
             <p>If you didn’t request this, you can ignore this email.</p>`
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

    console.log(`[RESET PASSWORD] Stored: ${user.resetCode}, Submitted: ${code}`);

    if (user.resetCode !== code) {
      return res.status(400).json({ error: "Invalid or expired reset code" });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetCode = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("[RESET PASSWORD ERROR]", err);
    res.status(500).json({ error: "Server error while resetting password" });
  }
});

module.exports = router;
