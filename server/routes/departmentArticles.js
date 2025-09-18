const express = require("express");
const DepartmentArticle = require("../models/DepartmentArticle");
const requireAuth = require("../middleware/requireAuth");
const { requireRole } = require("../middleware/requireAuth"); // exported helper  :contentReference[oaicite:12]{index=12}
const Doctor = require("../models/Doctor");

const router = express.Router();

// Public list (published only)
router.get("/:department", async (req, res) => {
  try {
    const { department } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      DepartmentArticle.find({ department, isPublished: true })
        .sort({ publishedAt: -1 }).skip(skip).limit(limit)
        .select("_id title department authorName publishedAt"),
      DepartmentArticle.countDocuments({ department, isPublished: true })
    ]);

    res.json({
      items,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }
    });
  } catch (err) {
    console.error("[ARTICLES LIST ERROR]", err);
    res.status(500).json({ error: "Server error while fetching articles" });
  }
});

// Public read single
router.get("/id/:id", async (req, res) => {
  try {
    const a = await DepartmentArticle.findById(req.params.id)
      .populate("authorDoctorId", "profile.fullName email");
    if (!a) return res.status(404).json({ error: "Article not found" });
    res.json({ article: a });
  } catch (err) {
    console.error("[ARTICLE READ ERROR]", err);
    res.status(500).json({ error: "Server error while fetching article" });
  }
});

// Doctor creates article
router.post("/", requireAuth, requireRole("doctor"), async (req, res) => {
  try {
    const { department, title, contentHtml="", tags=[] } = req.body;
    const doctor = await Doctor.findById(req.userId).lean();
    if (!doctor) return res.status(403).json({ error: "Doctor not found" });

    const doc = await DepartmentArticle.create({
      department, title, contentHtml, tags,
      authorDoctorId: req.userId,
      authorName: doctor?.profile?.fullName || doctor?.email
    });

    res.status(201).json({ message: "Article published", article: { _id: doc._id } });
  } catch (err) {
    console.error("[ARTICLE CREATE ERROR]", err);
    res.status(500).json({ error: "Server error while creating article" });
  }
});

// Doctor updates own article
router.put("/:id", requireAuth, requireRole("doctor"), async (req, res) => {
  try {
    const found = await DepartmentArticle.findById(req.params.id);
    if (!found) return res.status(404).json({ error: "Not found" });
    if (String(found.authorDoctorId) !== String(req.userId)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const { title, contentHtml, tags, isPublished } = req.body;
    if (title !== undefined) found.title = title;
    if (contentHtml !== undefined) found.contentHtml = contentHtml;
    if (tags !== undefined) found.tags = tags;
    if (isPublished !== undefined) found.isPublished = isPublished;
    await found.save();
    res.json({ message: "Article updated" });
  } catch (err) {
    console.error("[ARTICLE UPDATE ERROR]", err);
    res.status(500).json({ error: "Server error while updating article" });
  }
});

// Doctor deletes own article
router.delete("/:id", requireAuth, requireRole("doctor"), async (req, res) => {
  try {
    const found = await DepartmentArticle.findById(req.params.id);
    if (!found) return res.status(404).json({ error: "Not found" });
    if (String(found.authorDoctorId) !== String(req.userId)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    await DepartmentArticle.findByIdAndDelete(req.params.id);
    res.json({ message: "Article deleted" });
  } catch (err) {
    console.error("[ARTICLE DELETE ERROR]", err);
    res.status(500).json({ error: "Server error while deleting article" });
  }
});

module.exports = router;
