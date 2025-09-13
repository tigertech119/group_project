const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Applicant = require("../models/Applicant");
const Doctor = require("../models/Doctor");
const Nurse = require("../models/Nurse");
const Patient = require("../models/Patient");
const ITWorker = require("../models/ITWorker");
const Wardboy = require("../models/Wardboy");

module.exports = async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { uid, userType } = payload;

    let user = null;

    switch (userType) {
      case "patient":
        user = await Patient.findById(uid).lean();
        break;
      case "doctor":
        user = await Doctor.findById(uid).lean();
        break;
      case "nurse":
        user = await Nurse.findById(uid).lean();
        break;
      case "itworker":
        user = await ITWorker.findById(uid).lean();
        break;
      case "wardboy":
        user = await Wardboy.findById(uid).lean();
        break;
      case "admin":
        user = await User.findById(uid).lean();
        break;
      case "applicant":
        user = await Applicant.findById(uid).lean();
        break;
      default:
        return res.status(401).json({ error: "Invalid user type" });
    }

    if (!user) return res.status(401).json({ error: "User not found" });

    // attach for downstream handlers
    req.user = user;
    req.userType = userType;
    req.userId = uid;

    next();
  } catch (err) {
    console.error("[requireAuth]", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
