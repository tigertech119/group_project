import React, { useState, useEffect } from "react";
import { getMe } from "../api/auth";
import { createArticle } from "../api/articles";

export default function ArticleEditor() {
  const [me, setMe] = useState(null);
  const [department, setDepartment] = useState("Cardiology");
  const [title, setTitle] = useState("");
  const [contentHtml, setContentHtml] = useState("");

  useEffect(() => { (async () => { const r = await getMe(); setMe(r.user || null); })(); }, []);
  const canWrite = me && (me.role === "doctor" || me.role === "Doctor" || (me.profile?.department?.length));

  async function submit(e) {
    e.preventDefault();
    if (!canWrite) return alert("Only doctors can publish articles.");
    const res = await createArticle({ department, title, contentHtml, tags: [] });
    if (res.error) return alert("❌ " + res.error);
    alert("✅ Article published!");
    setTitle(""); setContentHtml("");
  }

  return (
    <div className="dept-content">
      <h1 className="dept-title">Write Department Article</h1>
      {!canWrite && <div className="dept-card">Only doctors can write articles.</div>}
      <form className="dept-card" onSubmit={submit}>
        <div style={{ display:"grid", gap:12 }}>
          <div>
            <label>Department</label>
            <select value={department} onChange={e => setDepartment(e.target.value)}>
              {["Cardiology","Neurology","Orthopedics","Pediatrics","General Medicine","Ophthalmology","Dentistry"].map(d=>(
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Title</label>
            <input value={title} onChange={e=>setTitle(e.target.value)} required />
          </div>
          <div>
            <label>Content (HTML allowed)</label>
            <textarea rows={10} value={contentHtml} onChange={e=>setContentHtml(e.target.value)} placeholder="<p>…</p>" />
          </div>
          <button className="tab-btn" type="submit">Publish</button>
        </div>
      </form>
    </div>
  );
}
