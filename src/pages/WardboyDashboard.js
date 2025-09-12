import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export default function WardboyDashboard({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    alert("✅ Logged out successfully!");
    navigate("/");
  };

  if (!user) return <p>Loading...</p>;

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
          <h1 className="title">Welcome, {user.profile?.fullName || "Wardboy"} 🧹</h1>

          <div className="profile-box">
            <p><b>Email:</b> {user.email}</p>
            <p><b>Phone:</b> {user.profile?.phone || "N/A"}</p>
            <p><b>Gender:</b> {user.profile?.gender || "N/A"}</p>
          </div>

          <div className="actions">
            <button className="btn btn-primary">🏥 Assist Doctors</button>
            <button className="btn btn-tertiary">🧽 Maintain Wards</button>
          </div>
        </div>
      </main>
    </div>
  );
}
