// src/api/auth.js

// Use environment variable if available, fallback to localhost:5000
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

// Helper to handle responses
async function handleResponse(res) {
  let data;
  try {
    data = await res.json();
  } catch {
    return { error: "Invalid server response" };
  }
  if (!res.ok) return { error: data.error || "Request failed" };
  return data;
}

// ----------------------
// Register new user
// ----------------------
export async function registerUser(data) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  } catch (err) {
    return { error: "Network error: " + err.message };
  }
}

// ----------------------
// Login
// ----------------------
export async function loginUser(data) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  } catch (err) {
    return { error: "Network error: " + err.message };
  }
}

// ----------------------
// Apply for Job
// ----------------------
export async function applyJob(data) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/apply-job`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  } catch (err) {
    return { error: "Network error: " + err.message };
  }
}

// ----------------------
// Get logged-in user
// ----------------------
export async function getMe() {
  try {
    const res = await fetch(`${API_BASE}/api/me`, {
      credentials: "include",
    });
    return await handleResponse(res);
  } catch (err) {
    return { error: "Network error: " + err.message };
  }
}

// ----------------------
// Logout
// ----------------------
export async function logoutUser() {
  try {
    const res = await fetch(`${API_BASE}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    return await handleResponse(res);
  } catch (err) {
    return { error: "Network error: " + err.message };
  }
}
