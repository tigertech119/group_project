// src/pages/ITWorkerDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export default function ITWorkerDashboard({ user }) {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pending appointment requests
  useEffect(() => {
    async function fetchAppointments() {
      try {
        const res = await fetch("http://localhost:5000/api/appointments/pending");
        const data = await res.json();
        setAppointments(data); // ✅ Already formatted by backend
      } catch (err) {
        console.error("❌ Error fetching pending appointments:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments();
  }, []);

  // Approve / Reject request
  async function handleAction(appointmentId, status) {
    try {
      const res = await fetch(
        `http://localhost:5000/api/appointments/${appointmentId}/update`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      const data = await res.json();
      if (data.message) {
        alert(data.message);
        // Remove appointment from pending list
        setAppointments((prev) =>
          prev.filter((app) => app._id !== appointmentId)
        );
      }
    } catch (err) {
      console.error("❌ Error updating appointment:", err);
    }
  }

  const handleLogout = () => {
    alert("✅ Logged out successfully!");
    navigate("/");
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <div className="logo">💻 IT Worker Dashboard</div>
        <button className="btn btn-tertiary" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="main-content">
        <div className="content-box">
          <h1 className="title">
            Welcome, {user.profile?.fullName || "IT Worker"} 👋
          </h1>
          <p className="subtitle">Manage appointment approvals</p>

          {loading && <p>Loading pending requests...</p>}

          {!loading && appointments.length === 0 && (
            <p>No pending appointment requests right now ✅</p>
          )}

          <div className="doctor-list">
            {appointments.map((app) => (
              <div key={app._id} className="doctor-card">
                <h2>👤 Patient: {app.patientName}</h2>
                <p><b>Doctor:</b> {app.doctorName}</p>
                <p><b>Department:</b> {app.department}</p>
                <p><b>Status:</b> {app.status}</p>

                <div style={{ marginTop: "10px" }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleAction(app._id, "approved")}
                  >
                    ✅ Approve
                  </button>
                  <button
                    className="btn btn-tertiary"
                    style={{ marginLeft: "10px" }}
                    onClick={() => handleAction(app._id, "rejected")}
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
