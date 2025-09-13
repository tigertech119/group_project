// src/api/auth.js
import API_BASE from "./config";

// ==========================
// ENHANCED RESPONSE HANDLER
// ==========================
async function handleResponse(res) {
  try {
    const text = await res.text();
    let data;
    
    try {
      data = text ? JSON.parse(text) : {};
    } catch (parseError) {
      // Handle non-JSON responses (HTML errors, etc.)
      return { 
        error: `Invalid server response (status ${res.status}): ${text.slice(0, 100)}...` 
      };
    }
    
    if (!res.ok) {
      return { 
        error: data.error || data.message || `Request failed with status ${res.status}` 
      };
    }
    
    return data;
  } catch (error) {
    return { error: "Failed to process server response: " + error.message };
  }
}

// ==========================
// NETWORK ERROR WRAPPER
// ==========================
async function withNetworkErrorHandling(fetchCall) {
  try {
    return await fetchCall();
  } catch (err) {
    console.error("Network error:", err);
    return { error: "Network error: " + err.message };
  }
}

// ----------------------
// Register new user
// ----------------------
export async function registerUser(data) {
  return withNetworkErrorHandling(async () => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  });
}

// ----------------------
// Login
// ----------------------
export async function loginUser(data) {
  return withNetworkErrorHandling(async () => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  });
}

// ----------------------
// Apply for Job
// ----------------------
export async function applyJob(data) {
  return withNetworkErrorHandling(async () => {
    const res = await fetch(`${API_BASE}/api/auth/apply-job`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  });
}

// ----------------------
// Get logged-in user
// ----------------------
export async function getMe() {
  return withNetworkErrorHandling(async () => {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      credentials: "include",
    });
    return await handleResponse(res);
  });
}

// ----------------------
// Logout
// ----------------------
export async function logoutUser() {
  return withNetworkErrorHandling(async () => {
    const res = await fetch(`${API_BASE}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    return await handleResponse(res);
  });
}

// ----------------------
// Reset password
// ----------------------
export async function resetPassword({ email, code, newPassword }) {
  return withNetworkErrorHandling(async () => {
    const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, code, newPassword }),
    });
    return await handleResponse(res);
  });
}

// ----------------------
// Forgot password
// ----------------------
export async function forgotPassword(email) {
  return withNetworkErrorHandling(async () => {
    const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email }),
    });
    return await handleResponse(res);
  });
}

// ----------------------
// Verify Email (KEEPING YOUR SUPERIOR VERSION)
// ----------------------
export async function verifyEmail(data) {
  return withNetworkErrorHandling(async () => {
    const res = await fetch(`${API_BASE}/api/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    // ✅ Your superior text-first approach
    const text = await res.text();

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      return { error: `Invalid server response (status ${res.status}): ${text.slice(0, 100)}...` };
    }

    if (!res.ok) {
      return { error: result.error || result.message || `Verification failed (status ${res.status})` };
    }

    return result;
  });
}

// ----------------------
// Get Applicants (Admin) - ADDED FOR COMPLETENESS
// ----------------------
export async function getApplicants() {
  return withNetworkErrorHandling(async () => {
    const res = await fetch(`${API_BASE}/api/auth/applicants`, {
      credentials: "include",
    });
    return await handleResponse(res);
  });
}

// ----------------------
// Approve/Reject Applicant (Admin) - ADDED FOR COMPLETENESS
// ----------------------
export async function approveApplicant({ applicantId, status }) {
  return withNetworkErrorHandling(async () => {
    const res = await fetch(`${API_BASE}/api/auth/approve-applicant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ applicantId, status }),
    });
    return await handleResponse(res);
  });
}