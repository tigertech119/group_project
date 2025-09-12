// src/api/appointments.js
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
// Request appointment (Patient)
// ----------------------
export async function requestAppointment(patientId, doctorId, department) {
  try {
    const res = await fetch(`${API_BASE}/api/appointments/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ patientId, doctorId, department }),
    });
    return await handleResponse(res);
  } catch (err) {
    return { error: "Network error: " + err.message };
  }
}

// ----------------------
// Get all pending (IT Worker)
// ----------------------
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
// Approve or Reject (IT Worker)
// ----------------------
export async function updateAppointmentStatus(appointmentId, status) {
  try {
    const res = await fetch(`${API_BASE}/api/appointments/${appointmentId}/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }), // status = "approved" / "rejected"
    });
    return await handleResponse(res);
  } catch (err) {
    return { error: "Network error: " + err.message };
  }
}

// ----------------------
// Get appointments for a Patient
// ----------------------
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

// ----------------------
// Get appointments for a Doctor
// ----------------------
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
