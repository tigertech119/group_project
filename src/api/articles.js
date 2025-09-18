// src/api/articles.js
import API_BASE from "../api/config";

async function handle(res) {
  const text = await res.text();
  let data; try { data = text ? JSON.parse(text) : {}; } catch { return { error: text?.slice(0,120) || "Invalid response" }; }
  if (!res.ok) return { error: data.error || data.message || `HTTP ${res.status}` };
  return data;
}

// Public
export async function listDeptArticles(department, { page=1, limit=10 }={}) {
  const res = await fetch(`${API_BASE}/api/department-articles/${encodeURIComponent(department)}?page=${page}&limit=${limit}`, { credentials:"include" });
  return handle(res);
}
export async function getArticleById(id) {
  const res = await fetch(`${API_BASE}/api/department-articles/id/${id}`, { credentials:"include" });
  return handle(res);
}

// Doctor-only
export async function createArticle(payload) {
  const res = await fetch(`${API_BASE}/api/department-articles`, {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    credentials:"include",
    body: JSON.stringify(payload),
  });
  return handle(res);
}
export async function updateArticle(id, payload) {
  const res = await fetch(`${API_BASE}/api/department-articles/${id}`, {
    method:"PUT",
    headers:{ "Content-Type":"application/json" },
    credentials:"include",
    body: JSON.stringify(payload),
  });
  return handle(res);
}
export async function deleteArticle(id) {
  const res = await fetch(`${API_BASE}/api/department-articles/${id}`, {
    method:"DELETE",
    credentials:"include",
  });
  return handle(res);
}
