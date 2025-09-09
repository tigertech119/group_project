import React, { useEffect, useState } from "react";
import { getMe } from "../api/auth";
import "./styles.css"; // ✅ make sure you have some global CSS

export default function DoctorDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await getMe();
      if (res.user) setUser(res.user);
    }
    fetchUser();
  }, []);

  if (!user) return <p className="loading">⏳ Loading your dashboard...</p>;

  // 🚩 Case 1: Not verified by email yet
  if (!user.isVerified) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-card warning">
          <h1>Doctor Dashboard</h1>
          <p>📧 Please verify your email before continuing.</p>
        </div>
      </div>
    );
  }

  // 🚩 Case 2: Verified but awaiting admin approval
  if (user.applicationStatus === "pending") {
    return (
      <div className="dashboard-container">
        <div className="dashboard-card info">
          <h1>Doctor Dashboard</h1>
          <p>✅ Email verified.</p>
          <p>⏳ Waiting for hospital authority approval.</p>
          <p>You will receive an email once approved.</p>
        </div>
      </div>
    );
  }

  // 🚩 Case 3: Rejected
  if (user.applicationStatus === "rejected") {
    return (
      <div className="dashboard-container">
        <div className="dashboard-card danger">
          <h1>Doctor Dashboard</h1>
          <p>❌ Your application was <b>rejected</b>.</p>
          <p>Please contact hospital administration.</p>
        </div>
      </div>
    );
  }

  // 🚩 Case 4: Approved → full dashboard
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>👨‍⚕️ Doctor Dashboard</h1>
        <p className="welcome-text">
          Welcome Dr. <b>{user.profile?.fullName}</b>
        </p>
      </header>

      <section className="profile-section">
        <h2>👤 Profile Information</h2>
        <ul>
          <li><b>Email:</b> {user.email}</li>
          <li><b>Department:</b> {user.profile?.department}</li>
          <li><b>Phone:</b> {user.profile?.phone}</li>
          <li><b>Gender:</b> {user.profile?.gender}</li>
        </ul>
      </section>

      <section className="appointments-section">
        <h2>📅 Your Appointments</h2>
        <div className="appointment-card">
          <p>No appointments yet.</p>
        </div>
      </section>
    </div>
  );
}
