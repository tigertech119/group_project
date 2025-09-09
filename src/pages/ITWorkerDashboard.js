import React, { useEffect, useState } from "react";
import { getMe } from "../api/auth";
import "./styles.css";

const handleLogout = () => {
  alert("✅ Logged out successfully!");
};

export default function ITWorkerDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await getMe();
      if (res.user) setUser(res.user);
    }
    fetchUser();
  }, []);

  if (!user) return <p>Loading...</p>;

  // 🚩 Case 1: Email not verified
  if (!user.isVerified) {
    return (
      <div className="content-box">
        <h1>IT Worker Dashboard</h1>
        <p>Please verify your email before continuing.</p>
      </div>
    );
  }

  // 🚩 Case 2: Waiting for admin approval
  if (user.applicationStatus === "pending") {
    return (
      <div className="content-box">
        <h1>IT Worker Dashboard</h1>
        <p>✅ Email verified.</p>
        <p>⏳ Waiting for hospital authority approval. You will receive an email once approved.</p>
      </div>
    );
  }

  // 🚩 Case 3: Rejected
  if (user.applicationStatus === "rejected") {
    return (
      <div className="content-box">
        <h1>IT Worker Dashboard</h1>
        <p>❌ Your application was rejected. Please contact hospital administration.</p>
      </div>
    );
  }

  // 🚩 Case 4: Approved → normal dashboard
  return (
    <div className="home-container">
      <header className="header">
        <div className="logo">💻 IT Worker Dashboard</div>
        <button className="btn btn-tertiary" onClick={handleLogout}>
          Logout
        </button>
      </header>
      <main className="main-content">
        <div className="content-box">
          <h1 className="title">Welcome, {user.profile?.fullName} 👋</h1>
          <p className="subtitle">IT Support Specialist</p>

          {/* Profile Card */}
          <div className="profile-card">
            <p><b>Name:</b> {user.profile?.fullName}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Role:</b> {user.role}</p>
            <p><b>Department:</b> {user.profile?.department || "Information Technology"}</p>
          </div>

          {/* IT Worker Actions */}
          <div className="button-grid">
            <button className="action-btn" onClick={() => alert("🛠 System maintenance")}>
              🛠 System Maintenance
            </button>
            <button className="action-btn" onClick={() => alert("🌐 Network monitor")}>
              🌐 Network Monitor
            </button>
            <button className="action-btn" onClick={() => alert("✅ Approve requests")}>
              ✅ Approve Requests
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
