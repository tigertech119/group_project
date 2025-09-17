

const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Applicant = require("../models/Applicant");
const Doctor = require("../models/Doctor");
const Nurse = require("../models/Nurse");
const Patient = require("../models/Patient");
const ITWorker = require("../models/ITWorker");
const Wardboy = require("../models/Wardboy");

async function requireAuth(req, res, next) {
  try {
    // ✅ added: also accept Bearer tokens (useful for tools/tests)
    const bearer = req.headers.authorization && req.headers.authorization.startsWith("Bearer ")
      ? req.headers.authorization.slice(7)
      : null;

    const token = req.cookies?.token || bearer;
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
}

// ✅ added: simple role guard you can use on routes (optional helper)
function requireRole(...allowed) {
  return (req, res, next) => {
    if (!req.userType || !allowed.includes(req.userType)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}

module.exports = requireAuth;
// ✅ allow importing helper as: const requireAuth = require(...); const { requireRole } = require(...);
module.exports.requireRole = requireRole;



/*

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


*/