
// src/pages/AdminDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export default function AdminDashboard() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch applicants
  useEffect(() => {
    async function fetchApplicants() {
      try {
        const res = await fetch("http://localhost:5000/api/auth/applicants", {
          credentials: "include", // ✅ send cookies (auth)
        });
        const data = await res.json();
        if (res.ok && data.applicants) {
          setApplicants(
            data.applicants.filter((app) => app.applicationStatus === "pending")
          );
        } else {
          console.error("❌ Failed to fetch applicants:", data.error);
        }
      } catch (err) {
        console.error("❌ Error fetching applicants:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchApplicants();
  }, []);

  // Approve / Reject
  async function handleAction(applicantId, status) {
    try {
      const res = await fetch("http://localhost:5000/api/auth/approve-applicant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ send cookies
        body: JSON.stringify({ applicantId, status }),
      });

      const data = await res.json();
      if (!res.ok) {
        return alert("❌ " + (data.error || "Failed to update applicant"));
      }

      alert("✅ " + data.message);
      // Remove applicant from list after action
      setApplicants((prev) => prev.filter((app) => app._id !== applicantId));
    } catch (err) {
      console.error("❌ Error updating applicant:", err);
      alert("❌ Network error while updating applicant");
    }
  }

  // Logout
  const handleLogout = () => {
    // Clear session cookie (optional: call logout endpoint)
    fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    }).finally(() => {
      alert("✅ Logged out successfully!");
      navigate("/"); // redirect to homepage
    });
  };

  return (
    <div className="home-container">
      {/* Header with logout */}
      <header className="header">
        <div className="logo">⚙️ Admin Dashboard</div>
        <button className="btn btn-tertiary" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="main-content">
        <div className="content-box">
          <h1 className="title">Manage Pending Applications</h1>

          {loading && <p>Loading applications...</p>}

          {!loading && applicants.length === 0 && (
            <p>No pending applications right now ✅</p>
          )}

          <div className="doctor-list">
            {applicants.map((app) => (
              <div key={app._id} className="doctor-card">
                <h2>{app.profile?.fullName || "Unnamed"}</h2>
                <p>
                  <b>Email:</b> {app.email}
                </p>
                <p>
                  <b>Role:</b> {app.role}
                </p>
                {app.profile?.department && (
                  <p>
                    <b>Department:</b> {app.profile.department}
                  </p>
                )}

                <div style={{ marginTop: "10px" }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleAction(app._id, "approved")}
                  >
                    ✅ Approve
                  </button>
                  <button
                    className="btn btn-tertiary"
                    style={{ marginLeft: "10px" }}
                    onClick={() => handleAction(app._id, "rejected")}
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

/*
// src/pages/AdminDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export default function AdminDashboard() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch applicants
  useEffect(() => {
    async function fetchApplicants() {
      try {
        const res = await fetch("http://localhost:5000/api/auth/applicants");
        const data = await res.json();
        if (data.applicants) {
          // ✅ only show pending
          setApplicants(data.applicants.filter(app => app.applicationStatus === "pending"));
        }
      } catch (err) {
        console.error("❌ Error fetching applicants:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchApplicants();
  }, []);

  // Approve / Reject
  async function handleAction(applicantId, status) {
    try {
      const res = await fetch("http://localhost:5000/api/auth/approve-applicant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicantId, status })
      });
      const data = await res.json();
      if (data.message) {
        alert(data.message);
        // Remove applicant from list after action
        setApplicants(prev => prev.filter(app => app._id !== applicantId));
      }
    } catch (err) {
      console.error("❌ Error updating applicant:", err);
    }
  }

  // Logout
  const handleLogout = () => {
    alert("✅ Logged out successfully!");
    navigate("/"); // redirect to homepage
  };

  return (
    <div className="home-container">
      {}
      <header className="header">
        <div className="logo">⚙️ Admin Dashboard</div>
        <button className="btn btn-tertiary" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="main-content">
        <div className="content-box">
          <h1 className="title">Manage Pending Applications</h1>

          {loading && <p>Loading applications...</p>}

          {!loading && applicants.length === 0 && (
            <p>No pending applications right now ✅</p>
          )}

          <div className="doctor-list">
            {applicants.map(app => (
              <div key={app._id} className="doctor-card">
                <h2>{app.profile?.fullName || "Unnamed"}</h2>
                <p><b>Email:</b> {app.email}</p>
                <p><b>Role:</b> {app.role}</p>
                {app.profile?.department && <p><b>Department:</b> {app.profile.department}</p>}

                <div style={{ marginTop: "10px" }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleAction(app._id, "approved")}
                  >
                    ✅ Approve
                  </button>
                  <button
                    className="btn btn-tertiary"
                    style={{ marginLeft: "10px" }}
                    onClick={() => handleAction(app._id, "rejected")}
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

*/