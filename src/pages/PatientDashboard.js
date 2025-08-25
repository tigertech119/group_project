import React from "react";
import "./styles.css";

export default function PatientDashboard({ user }) {
  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <div className="logo">🏥 Patient Dashboard</div>
        <button className="btn btn-tertiary">Logout</button>
      </header>

      {/* Welcome */}
      <main className="main-content">
        <div className="content-box">
          <h1 className="title">Welcome, {user.profile?.fullName || "Patient"} 👋</h1>
          <p className="subtitle">Manage your healthcare easily</p>

          {/* Profile Card */}
          <div className="profile-card">
            <p><b>Name:</b> {user.profile?.fullName}</p>
            <p><b>Age:</b> {user.profile?.dob ? new Date().getFullYear() - new Date(user.profile.dob).getFullYear() : "N/A"}</p>
            <p><b>Gender:</b> {user.profile?.gender}</p>
            <p><b>Phone:</b> {user.profile?.phone}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Address:</b> {user.profile?.address}</p>
            <p><b>Blood Group:</b> {user.profile?.bloodGroup || "N/A"}</p>
          </div>

          {/* Actions */}
          <div className="button-grid">
            <button className="action-btn">📅 Book Appointment</button>
            <button className="action-btn">💊 View Prescriptions</button>
            <button className="action-btn">🧾 Medical Reports</button>
            <button className="action-btn">💳 Billing & Payments</button>
            <button className="action-btn">💬 Chat with Doctor</button>
            <button className="action-btn">⚙️ Account Settings</button>
          </div>

          {/* Notifications */}
          <div className="notifications">
            <h3>🔔 Notifications</h3>
            <p>No upcoming appointments</p>
          </div>
        </div>
      </main>
    </div>
  );
}
