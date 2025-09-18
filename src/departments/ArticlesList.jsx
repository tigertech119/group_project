import React, { useEffect, useState } from "react";
import { listDeptArticles, getArticleById } from "../api/articles";

export default function ArticlesList({ department }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await listDeptArticles(department, { page:1, limit:10 });
      if (!res.error) setItems(res.items || []);
    })();
  }, [department]);

  async function openArticle(id) {
    const res = await getArticleById(id);
    if (!res.error) setOpen(res.article);
  }

  return (
    <div>
      {items.length === 0 ? (
        <div className="dept-card">No articles yet.</div>
      ) : (
        <div className="dept-card">
          {items.map(a => (
            <div key={a._id} className="article-item">
              <div className="article-title">{a.title}</div>
              <div style={{ color:"#6b7785", fontSize:13, margin:"4px 0" }}>
                By {a.authorName || "Doctor"} · {new Date(a.publishedAt).toLocaleDateString()}
              </div>
              <button className="tab-btn" onClick={() => openArticle(a._id)}>Read</button>
            </div>
          ))}
        </div>
      )}

      {open && (
        <div className="dept-card">
          <h3 style={{ marginTop:0 }}>{open.title}</h3>
          <div style={{ color:"#6b7785", fontSize:13, margin:"4px 0 10px" }}>
            By {open.author?.profile?.fullName || open.authorName || "Doctor"} · {new Date(open.publishedAt).toLocaleString()}
          </div>
          <div dangerouslySetInnerHTML={{ __html: open.contentHtml }} />
          <button className="tab-btn" onClick={() => setOpen(null)} style={{ marginTop:12 }}>Close</button>
        </div>
      )}
    </div>
  );
}
