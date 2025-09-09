// src/api/auth.js
// THIS api/auth.js ACTS AS MIDDLEMAN BETWEEN SERVER(server/auth.js) AND REACT APP AND FETCH AND SENT STUFF
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

// ----------------------
// Reset password
// ----------------------
export async function resetPassword({ email, code, newPassword }) {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, newPassword }),
      credentials: "include"
    });
    return await res.json();
  } catch (err) {
    console.error("Reset password error:", err);
    return { error: "Network error" };
  }
}


// ----------------------
// Reset password
// ----------------------

export async function forgotPassword(email) {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    return await res.json();
  } catch (err) {
    console.error("Forgot password error:", err);
    return { error: "Network error" };
  }
}


// ----------------------
// Verify Email
// ----------------------
export async function verifyEmail(data) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    return { error: "Network error: " + err.message };
  }
}


