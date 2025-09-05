import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export default function ITWorkerDashboard({ user }) {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const navigate = useNavigate();

  // Fetch all applicants (same as admin)
  const fetchApplicants = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/applicants", {
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to fetch applicants");
      
      const data = await res.json();
      if (data.applicants) {
        setApplicants(data.applicants);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Error fetching applicants");
    } finally {
      setLoading(false);
    }
  };

  // Approve or reject applicant (same as admin)
  const handleApplication = async (applicantId, status) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/approve-applicant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ applicantId, status }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`✅ Applicant ${status} successfully!`);
        fetchApplicants();
      } else {
        alert("Failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Error processing application");
    }
  };

  const handleLogout = () => {
    alert("✅ Logged out successfully!");
    navigate("/");
  };

  if (loading) return <div className="content-box"><p>Loading...</p></div>;

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
            <p><b>Department:</b> Information Technology</p>
          </div>

          {/* IT Worker Actions */}
          <div className="button-grid">
            <button className="action-btn" onClick={() => alert("🖥️ System maintenance panel")}>
              🖥️ System Maintenance
            </button>
            <button className="action-btn" onClick={() => alert("📊 Network monitoring")}>
              📊 Network Monitor
            </button>
            <button className="action-btn" onClick={() => alert("🔒 Security settings")}>
              🔒 Security Panel
            </button>
            <button 
              className="action-btn" 
              onClick={() => setShowAdminPanel(!showAdminPanel)}
              style={{ background: "linear-gradient(45deg, #9C27B0, #BA68C8)" }}
            >
              👨‍💼 Admin Functions
            </button>
          </div>

          {/* Admin Panel (for IT workers) */}
          {showAdminPanel && (
            <div style={{ marginTop: "30px", padding: "20px", border: "2px solid #2196F3", borderRadius: "10px" }}>
              <h2>👨‍💼 IT Admin Panel</h2>
              <p style={{ color: "#666", marginBottom: "20px" }}>Manage job applications</p>

              {applicants.length === 0 ? (
                <p>No pending applications.</p>
              ) : (
                <div style={{ marginTop: "20px" }}>
                  {applicants.map((applicant) => (
                    <div key={applicant._id} style={{
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "15px",
                      marginBottom: "15px",
                      background: "#f9f9f9"
                    }}>
                      <h3>{applicant.profile?.fullName}</h3>
                      <p><b>Email:</b> {applicant.email}</p>
                      <p><b>Applied for:</b> {applicant.appliedFor}</p>
                      <p><b>Status:</b> 
                        <span style={{ 
                          color: applicant.applicationStatus === "approved" ? "green" : 
                                 applicant.applicationStatus === "rejected" ? "red" : "orange",
                          fontWeight: "bold",
                          marginLeft: "8px"
                        }}>
                          {applicant.applicationStatus?.toUpperCase()}
                        </span>
                      </p>
                      
                      {applicant.applicationStatus === "pending" && (
                        <div style={{ marginTop: "10px" }}>
                          <button 
                            onClick={() => handleApplication(applicant._id, "approved")}
                            style={{
                              background: "#4CAF50",
                              color: "white",
                              border: "none",
                              padding: "8px 15px",
                              borderRadius: "4px",
                              marginRight: "10px",
                              cursor: "pointer"
                            }}
                          >
                            ✅ Approve
                          </button>
                          <button 
                            onClick={() => handleApplication(applicant._id, "rejected")}
                            style={{
                              background: "#f44336",
                              color: "white",
                              border: "none",
                              padding: "8px 15px",
                              borderRadius: "4px",
                              cursor: "pointer"
                            }}
                          >
                            ❌ Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}