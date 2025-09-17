import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export default function NurseDashboard({ user }) {
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


      <main className="main-content">
        <div className="content-box">
          <h1 className="title">Welcome, {user.profile?.fullName || "Nurse"} 👩‍⚕️</h1>

          <div className="profile-box">
            <p><b>Email:</b> {user.email}</p>
            <p><b>Phone:</b> {user.profile?.phone || "N/A"}</p>
            <p><b>Gender:</b> {user.profile?.gender || "N/A"}</p>
            <p><b>Department:</b> {user.profile?.department || "N/A"}</p>
          </div>

          {/* existing action buttons */}
          <div className="actions">
            <button className="btn btn-primary">📋 View Patients</button>
            <button className="btn btn-tertiary">💊 Manage Medicines</button>
          </div>

          {/* NEW: Account Settings button (placed BELOW existing actions) */}
          <div className="actions" style={{ marginTop: 8 }}>
            <button
              className="btn btn-tertiary"
              onClick={() => navigate("/account-settings")}
            >
              ⚙️ Account Settings
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}



/*  commented on 16.09.25
import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export default function NurseDashboard({ user }) {
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
        <div className="logo">👩‍⚕️ Nurse Dashboard</div>
        <button className="btn btn-tertiary" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="main-content">
        <div className="content-box">
          <h1 className="title">Welcome, {user.profile?.fullName || "Nurse"} 👩‍⚕️</h1>

          <div className="profile-box">
            <p><b>Email:</b> {user.email}</p>
            <p><b>Phone:</b> {user.profile?.phone || "N/A"}</p>
            <p><b>Gender:</b> {user.profile?.gender || "N/A"}</p>
            <p><b>Department:</b> {user.profile?.department || "N/A"}</p>
          </div>

          <div className="actions">
            <button className="btn btn-primary">📋 View Patients</button>
            <button className="btn btn-tertiary">💊 Manage Medicines</button>
          </div>
        </div>
      </main>
    </div>
  );
}
*/



/*  --------------------------------------
----------------------------------------------
-----------------------------------------------
import React, { useEffect, useState } from "react";
import { getMe } from "../api/auth";
import { useNavigate } from "react-router-dom";
import "./styles.css";



  const handleLogout = () => {
    alert("✅ Logged out successfully!");
    navigate("/");
  };

export default function NurseDashboard() {
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
        <h1>Nurse Dashboard</h1>
        <p>Please verify your email before continuing.</p>
      </div>
    );
  }

  // 🚩 Case 2: Waiting for admin approval
  if (user.applicationStatus === "pending") {
    return (
      <div className="content-box">
        <h1>Nurse Dashboard</h1>
        <p>✅ Email verified.</p>
        <p>⏳ Waiting for hospital authority approval. You will receive an email once approved.</p>
      </div>
    );
  }

  // 🚩 Case 3: Rejected
  if (user.applicationStatus === "rejected") {
    return (
      <div className="content-box">
        <h1>Nurse Dashboard</h1>
        <p>❌ Your application was rejected. Please contact hospital administration.</p>
      </div>
    );
  }

  // 🚩 Case 4: Approved → normal dashboard
  return (
    <div className="home-container">
      <header className="header">
        <div className="logo">👩‍⚕️ Nurse Dashboard</div>
        <button className="btn btn-tertiary" onClick={handleLogout}>
          Logout
        </button>
      </header>
  <main className="main-content">
        <div className="content-box">
          <h1 className="title">Welcome, Nurse {user.profile?.fullName} 👋</h1>
          <p className="subtitle">Patient care specialist</p>

          {}
          <div className="profile-card">
            <p><b>Name:</b> {user.profile?.fullName}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Role:</b> {user.role}</p>
            <p><b>Department:</b> Nursing</p>
          </div>

          {}
          <div className="button-grid">
            <button className="action-btn" onClick={() => alert("📋 Patient records")}>
              📋 Patient Records
            </button>
            <button className="action-btn" onClick={() => alert("💊 Medication management")}>
              💊 Medication Admin
            </button>
            <button className="action-btn" onClick={() => alert("🩺 Vital signs monitoring")}>
              🩺 Vital Signs
            </button>
            <button className="action-btn" onClick={() => alert("📞 Nurse station")}>
              📞 Nurse Station
            </button>
          </div>

          {}
          <div style={{ marginTop: "30px", padding: "20px", background: "#e8f5e8", borderRadius: "10px" }}>
            <h3>📅 Today's Schedule</h3>
            <ul style={{ textAlign: "left" }}>
              <li>🕘 9:00 AM - Patient rounds</li>
              <li>🕚 11:00 AM - Medication administration</li>
              <li>🕐 1:00 PM - Lunch break</li>
              <li>🕒 3:00 PM - Doctor consultations</li>
            </ul>
          </div>
        </div>
      </main>
 
    </div>
  );
}
*/