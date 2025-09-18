const mongoose = require("mongoose");

const DepartmentArticleSchema = new mongoose.Schema({
  department: { type: String, required: true }, // e.g. "Cardiology"
  title: { type: String, required: true },
  contentHtml: { type: String, default: "" }, // kept simple; can swap to markdown later
  tags: { type: [String], default: [] },

  authorDoctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  authorName: { type: String },

  isPublished: { type: Boolean, default: true },
  publishedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("DepartmentArticle", DepartmentArticleSchema);
