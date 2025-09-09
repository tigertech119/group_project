import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export default function PatientDashboard({ user }) {
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = () => {
    alert("✅ Logged out successfully!");
    navigate("/"); // go to Home.js (homepage route)
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <div className="logo">🏥 Patient Dashboard</div>
        <button className="btn btn-tertiary" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Welcome */}
      <main className="main-content">
        <div className="content-box">
          <h1 className="title">
            Welcome, {user.profile?.fullName || "Patient"} 👋
          </h1>
          <p className="subtitle">Manage your healthcare easily</p>

          {/* Profile Card */}
          <div className="profile-card">
            <p><b>Name:</b> {user.profile?.fullName}</p>
            <p>
              <b>Age:</b>{" "}
              {user.profile?.dob
                ? new Date().getFullYear() -
                  new Date(user.profile.dob).getFullYear()
                : "N/A"}
            </p>
            <p><b>Gender:</b> {user.profile?.gender}</p>
            <p><b>Phone:</b> {user.profile?.phone}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Address:</b> {user.profile?.address}</p>
            <p><b>Blood Group:</b> {user.profile?.blood_group }</p>
          </div>

          {/* Actions */}
          <div className="button-grid">
            <button
              className="action-btn"
              onClick={() =>
                alert("📞 Call +1-800-555-1234 to book an appointment")
              }
            >
              📅 Book Appointment
            </button>

            <button
              className="action-btn"
              onClick={() => navigate("/prescriptions")}
            >
              💊 View Prescriptions
            </button>

            <button
              className="action-btn"
              onClick={() => navigate("/view-reports")}
            >
              🧾 Medical Reports
            </button>

            <button
              className="action-btn"
              onClick={() =>
                alert("💳 For billing, please visit the hospital accounts office.")
              }
            >
              💳 Billing & Payments
            </button>

            <button
              className="action-btn"
              onClick={() => alert("💬 Chat service coming soon!")}
            >
              💬 Chat with Doctor
            </button>

            <button
              className="action-btn"
              onClick={() => navigate("/account-settings")}
            >
              ⚙️ Account Settings
            </button>
          </div>

          {/* Notifications */}
          <div className="notifications">
            <h3>🔔 Notifications</h3>
            <ul>
              <li>🩺 Your annual checkup is scheduled for Sept 20, 2025</li>
              <li>💊 New prescription ready for pickup</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
