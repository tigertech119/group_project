
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export default function ITWorkerDashboard({ user }) {
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("✅ Logged out successfully!");
    navigate("/");
  };

  // Fetch applicants when modal opens
  useEffect(() => {
    if (showApprovalModal) {
      fetchApplicants();
    }
  }, [showApprovalModal]);

  // Simple fetch function
  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/applicants", {
        credentials: "include",
      });
      
      if (res.ok) {
        const data = await res.json();
        setApplicants(data.applicants || []);
      } else {
        alert("Failed to fetch applicants");
      }
    } catch (err) {
      alert("Error connecting to server");
    }
    setLoading(false);
  };

  // Simple approve function
  const handleApprove = async (applicantId, applicantName) => {
    if (window.confirm(`Approve ${applicantName}?`)) {
      try {
        const res = await fetch("http://localhost:5000/api/auth/approve-applicant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ applicantId, status: "approved" }),
        });

        if (res.ok) {
          alert("✅ Applicant approved!");
          fetchApplicants(); // Refresh list
        } else {
          alert("Approval failed");
        }
      } catch (err) {
        alert("Error approving applicant");
      }
    }
  };

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

          <div className="profile-card">
            <p><b>Name:</b> {user.profile?.fullName}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Role:</b> {user.role}</p>
            <p><b>Department:</b> Information Technology</p>
          </div>

          <div className="button-grid">
            <button className="action-btn" onClick={() => alert("🖥️ System maintenance panel")}>
              🖥️ System Maintenance
            </button>
            <button className="action-btn" onClick={() => alert("📊 Network monitoring")}>
              📊 Network Monitor
            </button>
            <button 
              className="action-btn" 
              onClick={() => setShowApprovalModal(true)}
              style={{ background: "linear-gradient(45deg, #9C27B0, #BA68C8)" }}
            >
              👨‍💼 Approve Requests
            </button>
          </div>

          {}
          {showApprovalModal && (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000
            }}>
              <div style={{
                background: "white",
                padding: "30px",
                borderRadius: "10px",
                maxWidth: "500px",
                maxHeight: "80vh",
                overflowY: "auto"
              }}>
                <h3>👨‍💼 Approve Job Applications</h3>
                
                {loading ? (
                  <p>Loading applicants...</p>
                ) : applicants.length === 0 ? (
                  <p>No pending applications</p>
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
                        <h4>{applicant.profile?.fullName || "No Name"}</h4>
                        <p><b>Email:</b> {applicant.email}</p>
                        <p><b>Applied for:</b> {applicant.appliedFor}</p>
                        <p><b>Status:</b> 
                          <span style={{ 
                            color: "orange",
                            fontWeight: "bold",
                            marginLeft: "8px"
                          }}>
                            PENDING
                          </span>
                        </p>
                        
                        <button 
                          onClick={() => handleApprove(applicant._id, applicant.profile?.fullName)}
                          style={{
                            background: "#4CAF50",
                            color: "white",
                            border: "none",
                            padding: "8px 15px",
                            borderRadius: "4px",
                            marginTop: "10px",
                            cursor: "pointer"
                          }}
                        >
                          ✅ Approve
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => setShowApprovalModal(false)}
                  style={{
                    background: "#f44336",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    marginTop: "20px",
                    cursor: "pointer"
                  }}
                >
                  ❌ Close
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
