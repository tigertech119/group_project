import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export default function ApplicantDashboard({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("✅ Logged out successfully!");
    navigate("/");
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <div className="logo">📋 Applicant Dashboard</div>
        <button className="btn btn-tertiary" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-box">
          <h1 className="title">
            Welcome, {user.profile?.fullName || "Applicant"} 👋
          </h1>
          <p className="subtitle">Your application status</p>

          {/* Profile Card */}
          <div className="profile-card">
            <p><b>Name:</b> {user.profile?.fullName}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Applied For:</b> {user.appliedFor ? user.appliedFor.toUpperCase() : "N/A"}</p>
            <p><b>Status:</b> 
              <span style={{ 
                color: user.applicationStatus === "approved" ? "green" : 
                       user.applicationStatus === "rejected" ? "red" : "orange",
                fontWeight: "bold",
                marginLeft: "8px"
              }}>
                {user.applicationStatus?.toUpperCase() || "PENDING"}
              </span>
            </p>
          </div>

          {/* Application Message */}
          <div style={{
            background: "#e3f2fd",
            padding: "20px",
            borderRadius: "10px",
            margin: "20px 0",
            textAlign: "center"
          }}>
            <h2>📨 Application Submitted!</h2>
            <p>Your application for <b>{user.appliedFor}</b> position has been received.</p>
            <p>The admin will review your application and contact you soon.</p>
            <p style={{ marginTop: "15px", fontSize: "1.2em" }}>Good Luck! 🍀</p>
          </div>
        </div>
      </main>
    </div>
  );
}