// src/api/appointments.js
import API_BASE from "./config";

// 🔹 NEW: friendly message for unauthenticated users
const AUTH_MSG = "Please login first to book an appointment.";

// Generic response helper
async function handleResponse(res) {
  let data;
  try {
    data = await res.json();
  } catch {
    // If server returned nothing but it’s an auth error, still surface a clean message
    if (res && (res.status === 401 || res.status === 403)) {
      return { error: AUTH_MSG, authError: true };
    }
    return { error: "Invalid server response" };
  }

  // 🔹 NEW: translate 401/403 to a clear login message + flag
  if (res && (res.status === 401 || res.status === 403)) {
    return {
      error: data?.error || data?.message || AUTH_MSG,
      authError: true,
    };
  }

  if (!res.ok) return { error: data?.error || "Request failed" };
  return data;
}

// Patient: create request (now supports optional date/time)
export async function requestAppointment(patientId, doctorId, department, date = "", time = "") {
  try {
    const res = await fetch(`${API_BASE}/api/appointments/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ patientId, doctorId, department, date, time }),
    });
    return await handleResponse(res);
  } catch (err) {
    return { error: "Network error: " + err.message };
  }
}

// IT Worker: list pending
export async function getPendingAppointments() {
  try {
    const res = await fetch(`${API_BASE}/api/appointments/pending`, {
      credentials: "include",
    });
    return await handleResponse(res);
  } catch (err) {
    return { error: "Network error: " + err.message };
  }
}

// ----------------------
// Approve / Reject / Reschedule (IT Worker) — supports optional fields
// ----------------------
export async function updateAppointmentStatus(appointmentId, status, extra = {}) {
  try {
    const res = await fetch(`${API_BASE}/api/appointments/${appointmentId}/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status, ...extra }), // <- include scheduledDate/Time when provided
    });
    return await handleResponse(res);
  } catch (err) {
    return { error: "Network error: " + err.message };
  }
}

// Patient view
export async function getPatientAppointments(patientId) {
  try {
    const res = await fetch(`${API_BASE}/api/appointments/patient/${patientId}`, {
      credentials: "include",
    });
    return await handleResponse(res);
  } catch (err) {
    return { error: "Network error: " + err.message };
  }
}

// Doctor view
export async function getDoctorAppointments(doctorId) {
  try {
    const res = await fetch(`${API_BASE}/api/appointments/doctor/${doctorId}`, {
      credentials: "include",
    });
    return await handleResponse(res);
  } catch (err) {
    return { error: "Network error: " + err.message };
  }
}
