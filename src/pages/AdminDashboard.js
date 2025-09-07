import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export default function AdminDashboard({ user }) {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

const fetchApplicants = async () => {
  try {
    setError("");
    setLoading(true);
    const res = await fetch("http://localhost:5000/api/auth/applicants", {
      credentials: "include",
    });
    
    console.log("API Response status:", res.status);
    
    if (!res.ok) {
      const errorText = await res.text();
      let errorData = {};
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        // If response is not JSON, use the text as error
        throw new Error(errorText || `Server error: ${res.status}`);
      }
      throw new Error(errorData.error || `Server error: ${res.status}`);
    }
    
    const data = await res.json();
    console.log("API Response data:", data);
    
    if (data.applicants) {
      setApplicants(data.applicants);
    } else {
      throw new Error("Invalid response format from server");
    }
  } catch (err) {
    console.error("Fetch error details:", err);
    setError(err.message);
    alert("Error fetching applicants: " + err.message);
  } finally {
    setLoading(false);
  }
};

// Approve or reject applicant
const handleApplication = async (applicantId, status) => {
  try {
    const res = await fetch("http://localhost:5000/api/auth/approve-applicant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ applicantId, status }),
    });

    // Handle non-JSON responses
    const responseText = await res.text();
    let data = {};
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      throw new Error(responseText || "Invalid JSON response");
    }

    if (res.ok) {
      alert(`✅ Applicant ${status} successfully!`);
      fetchApplicants(); // Refresh the list
    } else {
      alert("Failed: " + (data.error || "Unknown error"));
    }
  } catch (err) {
    alert("Error processing application: " + err.message);
  }
};


  useEffect(() => {
    fetchApplicants();
  }, []);

  const handleLogout = () => {
    alert("✅ Logged out successfully!");
    navigate("/");
  };

  if (loading) return <div className="content-box"><p>Loading applicants...</p></div>;

  return (
    <div className="home-container">
      <header className="header">
        <div className="logo">👨‍💼 Admin Dashboard</div>
        <button className="btn btn-tertiary" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="main-content">
        <div className="content-box">
          <h1 className="title">Welcome, Admin {user.profile?.fullName} 👋</h1>
          <p className="subtitle">Manage job applications</p>

          {/* Error Message */}
          {error && (
            <div style={{ 
              background: "#ffebee", 
              color: "#c62828", 
              padding: "10px", 
              borderRadius: "5px", 
              marginBottom: "20px" 
            }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Admin Profile */}
          <div className="profile-card">
            <p><b>Name:</b> {user.profile?.fullName}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Role:</b> {user.role}</p>
          </div>

          {/* Applicants List */}
          <div style={{ marginTop: "30px" }}>
            <h2>📋 Job Applications</h2>
            
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
                    <h3>{applicant.profile?.fullName || "No Name"}</h3>
                    <p><b>Email:</b> {applicant.email}</p>
                    <p><b>Applied for:</b> {applicant.appliedFor}</p>
                    <p><b>Status:</b> 
                      <span style={{ 
                        color: applicant.applicationStatus === "approved" ? "green" : 
                               applicant.applicationStatus === "rejected" ? "red" : "orange",
                        fontWeight: "bold",
                        marginLeft: "8px"
                      }}>
                        {applicant.applicationStatus?.toUpperCase() || "PENDING"}
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
        </div>
      </main>
    </div>
  );
}

