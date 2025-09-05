import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export default function WardboyDashboard({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("✅ Logged out successfully!");
    navigate("/");
  };

  return (
    <div className="home-container">
      <header className="header">
        <div className="logo">🧹 Wardboy Dashboard</div>
        <button className="btn btn-tertiary" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="main-content">
        <div className="content-box">
          <h1 className="title">Welcome, {user.profile?.fullName} 👋</h1>
          <p className="subtitle">Hospital support staff</p>

          {/* Profile Card */}
          <div className="profile-card">
            <p><b>Name:</b> {user.profile?.fullName}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Role:</b> {user.role}</p>
            <p><b>Department:</b> Support Services</p>
          </div>

          {/* Wardboy Actions */}
          <div className="button-grid">
            <button className="action-btn" onClick={() => alert("🧹 Cleaning schedule")}>
              🧹 Cleaning Duties
            </button>
            <button className="action-btn" onClick={() => alert("🛌 Patient room maintenance")}>
              🛌 Room Maintenance
            </button>
            <button className="action-btn" onClick={() => alert("📦 Supply management")}>
              📦 Supplies
            </button>
            <button className="action-btn" onClick={() => alert("🚚 Equipment transport")}>
              🚚 Equipment
            </button>
          </div>

          {/* Tasks */}
          <div style={{ marginTop: "30px", padding: "20px", background: "#fff3e0", borderRadius: "10px" }}>
            <h3>✅ Today's Tasks</h3>
            <ul style={{ textAlign: "left" }}>
              <li>🧼 Clean patient rooms (1-10)</li>
              <li>🛏️ Change bed linens (Ward A)</li>
              <li>📦 Restock supplies (Floor 2)</li>
              <li>🚚 Transport equipment to OR</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}