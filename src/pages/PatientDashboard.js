// src/pages/PatientDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { logoutUser } from "../api/auth";

export default function PatientDashboard({ user }) {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showAppointmentsModal, setShowAppointmentsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchAppointments();
  }, [user._id]);

  async function fetchAppointments() {
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/patient/${user._id}`, {
        credentials: "include",
      });
      const data = await res.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Error fetching appointments:", err);
    }
  }

  const loadRecords = async (page = 1) => {
    try {
      const res = await fetch(`http://localhost:5000/api/records/patient/${user._id}?page=${page}&limit=5`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!data.error) {
        setRecords(data.records);
        setPagination(data.pagination);
        setCurrentPage(page);
      }
    } catch (err) {
      console.error("Error loading records:", err);
    }
  };

  async function handleLogout() {
    try {
      await logoutUser();              // ← end the session on the server
      alert("✅ Logged out successfully!");
      navigate("/");                   // ← go home
    } catch (e) {
      console.error(e);
      navigate("/");                   // fallback
    }
  }

  return (
    <div className="home-container">
      <header className="header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div className="logo">🏥 Patient Dashboard</div>
        <button className="btn btn-tertiary btn--sm" onClick={handleLogout}>Logout</button>
      </header>


      <main className="main-content">
        <div className="content-box">
          <h1 className="title">Welcome, {user.profile?.fullName || "Patient"} 👋</h1>
          <p className="subtitle">Manage your healthcare easily</p>

          {/* Profile */}
          <div className="profile-card" style={{ textAlign: "left" }}>
            <p><b>Name:</b> {user.profile?.fullName}</p>
            <p><b>Gender:</b> {user.profile?.gender}</p>
            <p><b>Phone:</b> {user.profile?.phone}</p>
            <p><b>Email:</b> {user.email}</p>
          </div>

          {/* Actions */}
          <div className="button-grid">
            <button className="action-btn" onClick={() => navigate("/departments")}>
              📅 Book Appointment
            </button>
            <button className="action-btn" onClick={() => navigate("/prescriptions")}>
              💊 View Prescriptions
            </button>
            <button className="action-btn" onClick={() => { setShowNotesModal(true); loadRecords(1); }}>
              🗒️ Doctor Notes
            </button>
            <button className="action-btn" onClick={() => setShowAppointmentsModal(true)}>
              📋 Appointment Schedule
            </button>
             
                <button className="btn btn-tertiary" onClick={() => navigate("/account-settings")}>
                     ⚙️ Account Settings
                </button>


          </div>

          {/* Appointments */}
          <div className="appointments">
            <h3>📅 Your Appointments</h3>
            {appointments.length === 0 ? (
              <p>No appointments yet.</p>
            ) : (
              appointments.slice(0, 3).map((app) => (
                <div key={app._id} className="appointment-card">
                  <p><b>Doctor:</b> {app.doctorName || "Unknown Doctor"}</p>
                  <p><b>Status:</b> {app.status}</p>
                  <p><b>Scheduled:</b> {app.scheduledDate ? `${app.scheduledDate} ${app.scheduledTime || ""}` : "—"}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Doctor Notes Modal */}
      {showNotesModal && (
        <div className="modal-overlay" onClick={() => setShowNotesModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🗒️ Your Doctor Notes</h2>
              <button className="btn btn-tertiary" onClick={() => setShowNotesModal(false)}>✖ Close</button>
            </div>
            
            <div className="modal-body">
              {records.length === 0 ? (
                <p>No doctor notes available yet.</p>
              ) : (
                <>
                  {records.map((record) => (
                    <div key={record._id} className="record-card">
                      <p><b>Doctor:</b> {record.doctorId?.profile?.fullName || "Unknown Doctor"}</p>
                      <p><b>Date:</b> {record.appointmentId?.scheduledDate} {record.appointmentId?.scheduledTime}</p>
                      {record.diagnosis && <p><b>Diagnosis:</b> {record.diagnosis}</p>}
                      {record.treatment && <p><b>Treatment:</b> {record.treatment}</p>}
                      {record.prescription && <p><b>Prescription:</b> {record.prescription}</p>}
                      {record.nextFollowUp && <p><b>Next Follow-up:</b> {record.nextFollowUp}</p>}
                      <p><small>Last updated: {new Date(record.lastUpdated).toLocaleString()}</small></p>
                    </div>
                  ))}
                  
                  {/* Pagination */}
                  <div className="pagination">
                    <button 
                      className="btn btn-tertiary" 
                      disabled={!pagination.hasPrev}
                      onClick={() => loadRecords(currentPage - 1)}
                    >
                      ← Previous
                    </button>
                    
                    <span>Page {currentPage} of {pagination.totalPages}</span>
                    
                    <button 
                      className="btn btn-tertiary" 
                      disabled={!pagination.hasNext}
                      onClick={() => loadRecords(currentPage + 1)}
                    >
                      Next →
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Appointments Modal */}
      {showAppointmentsModal && (
        <div className="modal-overlay" onClick={() => setShowAppointmentsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📋 Your Appointment Schedule</h2>
              <button className="btn btn-tertiary" onClick={() => setShowAppointmentsModal(false)}>✖ Close</button>
            </div>
            
            <div className="modal-body">
              {appointments.length === 0 ? (
                <p>No appointments scheduled.</p>
              ) : (
                appointments.map((app) => (
                  <div key={app._id} className="appointment-card">
                    <p><b>Doctor:</b> {app.doctorName || "Unknown Doctor"}</p>
                    <p><b>Department:</b> {app.department}</p>
                    <p><b>Status:</b> {app.status}</p>
                    <p><b>Scheduled:</b> {app.scheduledDate} {app.scheduledTime}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



/*
// src/pages/PatientDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export default function PatientDashboard({ user }) {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const res = await fetch(`http://localhost:5000/api/appointments/patient/${user._id}`, {
          credentials: "include",
        });
        const data = await res.json();
        setAppointments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Error fetching appointments:", err);
      }
    }
    fetchAppointments();
  }, [user._id]);

  const handleLogout = () => {
    alert("✅ Logged out successfully!");
    navigate("/");
  };

  return (
    <div className="home-container">
      <header className="header">
        <div className="logo">🏥 Patient Dashboard</div>
        <button className="btn btn-tertiary" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="main-content">
        <div className="content-box">
          <h1 className="title">Welcome, {user.profile?.fullName || "Patient"} 👋</h1>
          <p className="subtitle">Manage your healthcare easily</p>

          { }
          <div className="profile-card" style={{ textAlign: "left" }}>
            <p><b>Name:</b> {user.profile?.fullName}</p>
            <p><b>Gender:</b> {user.profile?.gender}</p>
            <p><b>Phone:</b> {user.profile?.phone}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Address:</b> {user.profile?.address}</p>
            <p><b>Blood Group:</b> {user.profile?.blood_group || "N/A"}</p>
          </div>

          { }
          <div className="button-grid">
            <button className="action-btn" onClick={() => navigate("/departments")}>
              📅 Book Appointment
            </button>
            <button className="action-btn" onClick={() => navigate("/prescriptions")}>
              💊 View Prescriptions
            </button>
            <button className="action-btn" onClick={() => navigate("/view-reports")}>
              🧾 Medical Reports
            </button>
            <button className="action-btn" onClick={() => alert("💳 Please visit hospital accounts office.")}>
              💳 Billing & Payments
            </button>
            <button className="action-btn" onClick={() => alert("💬 Chat service coming soon!")}>
              💬 Chat with Doctor
            </button>
            <button className="action-btn" onClick={() => navigate("/account-settings")}>
              ⚙️ Account Settings
            </button>
            <button className="action-btn"  onClick={() => navigate("/my-records")}
>             🗒️ Doctor Notes
            </button>
          </div>
          { }
<div className="appointments">
  <h3>📅 Your Appointments</h3>
  {appointments.length === 0 ? (
    <p>No appointments yet.</p>
  ) : (
    appointments.map((app) => (
      <div key={app._id} className="appointment-card">
        <p><b>Doctor:</b> {app.doctorName || "Unknown Doctor"}</p>
        <p><b>Status:</b> {app.status}</p>
        <p><b>Scheduled:</b> {app.scheduledDate ? `${app.scheduledDate} ${app.scheduledTime || ""}` : "—"}</p>
      </div>
    ))
  )}
</div>

        </div>
      </main>
    </div>
  );
}
  */
