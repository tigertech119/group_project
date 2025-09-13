// src/pages/MyRecords.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { getMe } from "../api/auth";
import { getPatientRecords } from "../api/records";

export default function MyRecords() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load logged-in user
  useEffect(() => {
    async function loadUser() {
      const res = await getMe();
      if (!res.error && res.user) {
        setUser(res.user);
      } else {
        alert("⚠️ Please log in to view your records.");
        navigate("/login");
      }
    }
    loadUser();
  }, [navigate]);

  // Load this patient's records
  useEffect(() => {
    if (!user?._id) return;
    async function loadRecords() {
      setLoading(true);
      const data = await getPatientRecords(user._id);
      if (!data.error) setRecords(data);
      setLoading(false);
    }
    loadRecords();
  }, [user]);

  return (
    <div className="home-container">
      <main className="main-content">
        <div className="content-box">
          <h1 className="title">🗒️ Your Doctor Notes</h1>
          <p className="subtitle">View diagnoses, treatment plans, prescriptions, and follow-ups.</p>

          {loading && <p>Loading...</p>}

          {!loading && records.length === 0 && (
            <p>No visit notes yet.</p>
          )}

          {records.map((r) => (
            <div key={r._id} className="appointment-card">
              <p><b>Doctor:</b> {r.doctorId?.profile?.fullName || r.doctorId?.email || "Unknown"}</p>

              {r.appointmentId && (
                <p>
                  <b>Appointment:</b> {r.appointmentId?.department} ·{" "}
                  {r.appointmentId?.scheduledDate || "—"}{" "}
                  {r.appointmentId?.scheduledTime || ""}
                </p>
              )}

              {r.diagnosis && <p><b>Diagnosis:</b> {r.diagnosis}</p>}
              {r.stage && <p><b>Stage:</b> {r.stage}</p>}
              {r.treatment && <p><b>Treatment:</b> {r.treatment}</p>}
              {!!(r.tests && r.tests.length) && <p><b>Tests:</b> {r.tests.join(", ")}</p>}
              {r.prescription && <p><b>Prescription:</b> {r.prescription}</p>}
              {r.nextFollowUp && <p><b>Next Follow-up:</b> {r.nextFollowUp}</p>}
              {r.notes && <p><b>Notes:</b> {r.notes}</p>}

              <p style={{ opacity: 0.7, fontSize: "0.9em" }}>
                Created: {new Date(r.createdAt).toLocaleString()}
              </p>
            </div>
          ))}

          <button
            className="about-btn"
            onClick={() => navigate(-1)}
            style={{ background: "linear-gradient(45deg, #6c757d, #5a6268)", marginTop: 20 }}
          >
            ← Back
          </button>
        </div>
      </main>
    </div>
  );
}
