// src/api/records.js
import API_BASE from "./config";

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

export async function createRecord(payload) {
  try {
    const res = await fetch(`${API_BASE}/api/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    return await handleResponse(res);
  } catch (err) {
    return { error: "Network error: " + err.message };
  }
}

export async function getDoctorRecords(doctorId) {
  try {
    const res = await fetch(`${API_BASE}/api/records/doctor/${doctorId}`, {
      credentials: "include",
    });
    return await handleResponse(res);
  } catch (err) {
    return { error: "Network error: " + err.message };
  }
}

export async function getPatientRecords(patientId) {
  try {
    const res = await fetch(`${API_BASE}/api/records/patient/${patientId}`, {
      credentials: "include",
    });
    return await handleResponse(res);
  } catch (err) {
    return { error: "Network error: " + err.message };
  }
}
