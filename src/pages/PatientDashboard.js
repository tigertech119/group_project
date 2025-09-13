// src/pages/PatientDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export default function PatientDashboard({ user }) {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const res = await fetch(`http://localhost:5000/api/appointments/patient/${user._id}`, {
          credentials: "include",
        });
        const data = await res.json();
        setAppointments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Error fetching appointments:", err);
      }
    }
    fetchAppointments();
  }, [user._id]);

  const handleLogout = () => {
    alert("✅ Logged out successfully!");
    navigate("/");
  };

  return (
    <div className="home-container">
      <header className="header">
        <div className="logo">🏥 Patient Dashboard</div>
        <button className="btn btn-tertiary" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="main-content">
        <div className="content-box">
          <h1 className="title">Welcome, {user.profile?.fullName || "Patient"} 👋</h1>
          <p className="subtitle">Manage your healthcare easily</p>

          {/* Profile */}
          <div className="profile-card" style={{ textAlign: "left" }}>
            <p><b>Name:</b> {user.profile?.fullName}</p>
            <p><b>Gender:</b> {user.profile?.gender}</p>
            <p><b>Phone:</b> {user.profile?.phone}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Address:</b> {user.profile?.address}</p>
            <p><b>Blood Group:</b> {user.profile?.blood_group || "N/A"}</p>
          </div>

          {/* Actions */}
          <div className="button-grid">
            <button className="action-btn" onClick={() => navigate("/departments")}>
              📅 Book Appointment
            </button>
            <button className="action-btn" onClick={() => navigate("/prescriptions")}>
              💊 View Prescriptions
            </button>
            <button className="action-btn" onClick={() => navigate("/view-reports")}>
              🧾 Medical Reports
            </button>
            <button className="action-btn" onClick={() => alert("💳 Please visit hospital accounts office.")}>
              💳 Billing & Payments
            </button>
            <button className="action-btn" onClick={() => alert("💬 Chat service coming soon!")}>
              💬 Chat with Doctor
            </button>
            <button className="action-btn" onClick={() => navigate("/account-settings")}>
              ⚙️ Account Settings
            </button>
            <button className="action-btn"  onClick={() => navigate("/my-records")}
>             🗒️ Doctor Notes
            </button>
          </div>
          {/* Appointments */}
<div className="appointments">
  <h3>📅 Your Appointments</h3>
  {appointments.length === 0 ? (
    <p>No appointments yet.</p>
  ) : (
    appointments.map((app) => (
      <div key={app._id} className="appointment-card">
        <p><b>Doctor:</b> {app.doctorName || "Unknown Doctor"}</p>
        <p><b>Status:</b> {app.status}</p>
        <p><b>Scheduled:</b> {app.scheduledDate ? `${app.scheduledDate} ${app.scheduledTime || ""}` : "—"}</p>
      </div>
    ))
  )}
</div>

        </div>
      </main>
    </div>
  );
}
