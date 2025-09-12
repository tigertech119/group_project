import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export default function DoctorDashboard({ user }) {
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
        <div className="logo">🩺 Doctor Dashboard</div>
        <button className="btn btn-tertiary" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="main-content">
        <div className="content-box">
          <h1 className="title">Welcome, {user.profile?.fullName || "Doctor"} 👨‍⚕️</h1>

          <div className="profile-box">
            <p><b>Email:</b> {user.email}</p>
            <p><b>Phone:</b> {user.profile?.phone || "N/A"}</p>
            <p><b>Gender:</b> {user.profile?.gender || "N/A"}</p>
            <p><b>Department:</b> {user.profile?.department || "N/A"}</p>
          </div>

          <div className="actions">
            <button className="btn btn-primary">📅 View Appointments</button>
            <button className="btn btn-tertiary">🧑‍⚕️ Select Patient</button>
          </div>
        </div>
      </main>
    </div>
  );
}


/*
import React, { useEffect, useState } from "react";
import { getMe } from "../api/auth";
import "./styles.css";

export default function DoctorDashboard() {
  const [user, setUser] = useState(null);
  const [patients] = useState(["Patient A", "Patient B", "Patient C"]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [medicine, setMedicine] = useState("");

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

  // 🚩 Case 4: Approved → full doctor workflow UI
  const handleSave = () => {
    alert(
      `Saved for ${selectedPatient}: Diagnosis = ${diagnosis}, Medicine = ${medicine}`
    );
    setDiagnosis("");
    setMedicine("");
  };

  return (
    <div className="home-container">
      <header className="header">
        <div className="logo">👨‍⚕️ Doctor Dashboard</div>
        <button
          className="btn btn-tertiary"
          onClick={() => {
            alert("✅ Logged out successfully!");
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </header>

      <main className="main-content">
        <div className="content-box">
          <h1 className="title">
            Welcome, Dr. {user?.profile?.fullName || "Doctor"}
          </h1>

          <div className="form-group">
            <label>Select Patient:</label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
            >
              <option value="">Choose</option>
              {patients.map((p, idx) => (
                <option key={idx} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {selectedPatient && (
            <>
              <div className="form-group">
                <label>Diagnosis:</label>
                <input
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Medicines:</label>
                <input
                  value={medicine}
                  onChange={(e) => setMedicine(e.target.value)}
                />
              </div>
              <button className="btn btn-primary" onClick={handleSave}>
                Save
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

 */