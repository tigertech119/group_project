const jwt = require("jsonwebtoken");
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
    
    let user;
    switch (payload.userType) {
      case 'applicants':
        user = await Applicant.findById(payload.uid).lean();
        break;
      case 'doctors':
        user = await Doctor.findById(payload.uid).lean();
        break;
      case 'nurses':
        user = await Nurse.findById(payload.uid).lean();
        break;
      case 'patients':
        user = await Patient.findById(payload.uid).lean();
        break;
      case 'itworkers':
        user = await ITWorker.findById(payload.uid).lean();
        break;
      case 'wardboys':
        user = await Wardboy.findById(payload.uid).lean();
        break;
      default:
        return res.status(401).json({ error: "Invalid user type" });
    }
    
    if (!user) return res.status(401).json({ error: "User not found" });

    req.user = user;
    req.userType = payload.userType;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

/*
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.uid).lean();
    if (!user) return res.status(401).json({ error: "User not found" });

    req.user = user; // attach user to request
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
*/
