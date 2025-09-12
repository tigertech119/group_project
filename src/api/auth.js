// src/api/auth.js
import API_BASE from "./config";

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
// src/api/auth.js
export async function getMe() {
  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      credentials: "include", // ✅ send cookies (JWT token)
    });
    return await handleResponse(res); // ✅ backend always returns { user, userType }
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
    const res = await fetch(`${API_BASE}/api/auth/reset-password`, {  // ✅ use API_BASE
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, code, newPassword }),
    });
    return await handleResponse(res);
  } catch (err) {
    return { error: "Network error: " + err.message };
  }
}

// ----------------------
// Forgot password
// ----------------------
export async function forgotPassword(email) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {  // ✅ use API_BASE
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email }),
    });
    return await handleResponse(res);
  } catch (err) {
    return { error: "Network error: " + err.message };
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

    let result;
    try {
      result = await res.json(); // try parse JSON
    } catch {
      result = { error: "Invalid server response" }; // fallback
    }

    if (!res.ok) {
      return { error: result.error || res.statusText || "Verification failed" };
    }

    return result;
  } catch (err) {
    console.error("❌ Network error in verifyEmail:", err);
    return { error: "Network error: " + err.message };
  }
}
