// src/pages/DoctorDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { getDoctorAppointments } from "../api/appointment";
import { createRecord, getDoctorRecords } from "../api/records";

export default function DoctorDashboard({ user }) {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [showAppointmentsModal, setShowAppointmentsModal] = useState(false);
  const [showRecordsModal, setShowRecordsModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [activeAppt, setActiveAppt] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPage, setRecordsPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [recordsPagination, setRecordsPagination] = useState({});

  const [diagnosis, setDiagnosis] = useState("");
  const [stage, setStage] = useState("");
  const [treatment, setTreatment] = useState("");
  const [tests, setTests] = useState("");
  const [prescription, setPrescription] = useState("");
  const [notes, setNotes] = useState("");
  const [nextFollowUp, setNextFollowUp] = useState("");

  const loadAppointments = async (page = 1) => {
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/doctor/${user._id}/paginated?page=${page}&limit=5`);
      const data = await res.json();
      if (!data.error) {
        setAppointments(data.appointments);
        setPagination(data.pagination);
        setCurrentPage(page);
      }
    } catch (err) {
      console.error("Error loading appointments:", err);
    }
  };

  const loadRecords = async (page = 1) => {
    const data = await getDoctorRecords(user._id, page, 5);
    if (!data.error) {
      setRecords(data.records);
      setRecordsPagination(data.pagination);
      setRecordsPage(page);
    }
  };

  function openNoteModal(appt) {
    setActiveAppt(appt);

    setDiagnosis("");
    setStage("");
    setTreatment("");
    setTests("");
    setPrescription("");
    setNotes("");
    setNextFollowUp("");
    setShowNoteModal(true);

    checkExistingNote(appt._id);
  }

  async function checkExistingNote(appointmentId) {
    try {
      const res = await fetch(`http://localhost:5000/api/records/appointment/${appointmentId}`);
      const data = await res.json();
      if (!data.error && data._id) {
        setDiagnosis(data.diagnosis || "");
        setStage(data.stage || "");
        setTreatment(data.treatment || "");
        setTests(data.tests?.join(", ") || "");
        setPrescription(data.prescription || "");
        setNotes(data.notes || "");
        setNextFollowUp(data.nextFollowUp || "");
      }
    } catch (err) {
      console.error("Error checking existing note:", err);
    }
  }

  async function submitRecord(e) {
    e.preventDefault();
    if (!activeAppt) return;

    const payload = {
      appointmentId: activeAppt._id,
      doctorId: user._id,
      patientId: activeAppt.patientId,
      diagnosis,
      stage,
      treatment,
      tests,
      prescription,
      notes,
      nextFollowUp,
    };

    const res = await createRecord(payload);
    if (res.error) {
      alert("❌ " + res.error);
      return;
    }
    
    alert("✅ Record saved successfully");
    setShowNoteModal(false);
    loadRecords(recordsPage); 
  }

  const handleLogout = () => {
    alert("✅ Logged out successfully!");
    navigate("/");
  };

  return (
    <div className="home-container">


      <main className="main-content">
        <div className="content-box">
          <h1 className="title">
            Welcome, Dr. {user.profile?.fullName || "Doctor"} 👋
          </h1>

          <div className="profile-card">
            <p><b>Name:</b> {user.profile?.fullName}</p>
            <p><b>Department:</b> {user.profile?.department || "N/A"}</p>
            <p><b>Phone:</b> {user.profile?.phone}</p>
            <p><b>Email:</b> {user.email}</p>
          </div>

          {/* Action Buttons */}
          <div className="button-grid" style={{ marginTop: "20px" }}>
            <button className="btn btn-primary" onClick={() => { setShowAppointmentsModal(true); loadAppointments(1); }}>
              📅 View Appointments
            </button>
            <button className="btn btn-primary" onClick={() => { setShowRecordsModal(true); loadRecords(1); }}>
              🗒️ View Patient Records
            </button>
           
            <button className="btn btn-primary" onClick={() => navigate("/doctor/articles/new")}>
             ✍️ Add Article
            </button>
            <button className="btn btn-tertiary" onClick={() => navigate("/account-settings")}>
               ⚙️ Account Settings
              </button>


          </div>
        </div>
      </main>

      {/* Appointments Modal */}
      {showAppointmentsModal && (
        <div className="modal-overlay" onClick={() => setShowAppointmentsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📅 Your Appointments</h2>
              <button className="btn btn-tertiary" onClick={() => setShowAppointmentsModal(false)}>✖ Close</button>
            </div>
            
            <div className="modal-body">
              {appointments.length === 0 ? (
                <p>No appointments found.</p>
              ) : (
                <>
                  {appointments.map((appt) => (
                    <div key={appt._id} className="appointment-card">
                      <p><b>Patient:</b> {appt.patientName}</p>
                      <p><b>Department:</b> {appt.department}</p>
                      <p><b>Scheduled:</b> {appt.scheduledDate} {appt.scheduledTime}</p>
                      <button className="btn btn-primary" onClick={() => openNoteModal(appt)}>
                        ✍️ Write Note
                      </button>
                    </div>
                  ))}
                  
                  {/* Pagination */}
                  <div className="pagination">
                    <button 
                      className="btn btn-tertiary" 
                      disabled={!pagination.hasPrev}
                      onClick={() => loadAppointments(currentPage - 1)}
                    >
                      ← Previous
                    </button>
                    
                    <span>Page {currentPage} of {pagination.totalPages}</span>
                    
                    <button 
                      className="btn btn-tertiary" 
                      disabled={!pagination.hasNext}
                      onClick={() => loadAppointments(currentPage + 1)}
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

      {/* Records Modal */}
      {showRecordsModal && (
        <div className="modal-overlay" onClick={() => setShowRecordsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🗒️ Patient Records</h2>
              <button className="btn btn-tertiary" onClick={() => setShowRecordsModal(false)}>✖ Close</button>
            </div>
            
            <div className="modal-body">
              {records.length === 0 ? (
                <p>No records found.</p>
              ) : (
                <>
                  {records.map((record) => (
                    <div key={record._id} className="record-card">
                      <p><b>Patient:</b> {record.patientId?.profile?.fullName || "Unknown"}</p>
                      <p><b>Appointment:</b> {record.appointmentId?.scheduledDate} {record.appointmentId?.scheduledTime}</p>
                      {record.diagnosis && <p><b>Diagnosis:</b> {record.diagnosis}</p>}
                      <p><small>Last updated: {new Date(record.lastUpdated).toLocaleString()}</small></p>
                    </div>
                  ))}
                  
                  {/* Pagination */}
                  <div className="pagination">
                    <button 
                      className="btn btn-tertiary" 
                      disabled={!recordsPagination.hasPrev}
                      onClick={() => loadRecords(recordsPage - 1)}
                    >
                      ← Previous
                    </button>
                    
                    <span>Page {recordsPage} of {recordsPagination.totalPages}</span>
                    
                    <button 
                      className="btn btn-tertiary" 
                      disabled={!recordsPagination.hasNext}
                      onClick={() => loadRecords(recordsPage + 1)}
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

      {/* Note Modal */}
      {showNoteModal && activeAppt && (
        <div className="modal-overlay" onClick={() => setShowNoteModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✍️ Medical Note for {activeAppt.patientName}</h2>
              <button className="btn btn-tertiary" onClick={() => setShowNoteModal(false)}>✖ Close</button>
            </div>
            
            <div className="modal-body">
              <p><b>Appointment:</b> {activeAppt.department} · {activeAppt.scheduledDate} {activeAppt.scheduledTime}</p>
              
              <form onSubmit={submitRecord} className="note-form">
                <div className="form-group">
                  <label>Diagnosis</label>
                  <input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
                </div>

                <div className="form-group">
                  <label>Stage</label>
                  <input value={stage} onChange={(e) => setStage(e.target.value)} />
                </div>

                <div className="form-group">
                  <label>Treatment Plan</label>
                  <textarea value={treatment} onChange={(e) => setTreatment(e.target.value)} rows="3" />
                </div>

                <div className="form-group">
                  <label>Tests (comma-separated)</label>
                  <input value={tests} onChange={(e) => setTests(e.target.value)} placeholder="CBC, Lipid profile" />
                </div>

                <div className="form-group">
                  <label>Prescription</label>
                  <textarea value={prescription} onChange={(e) => setPrescription(e.target.value)} placeholder="Paracetamol 500mg BID × 5 days" rows="3" />
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows="3" />
                </div>

                <div className="form-group">
                  <label>Next Follow-up</label>
                  <input value={nextFollowUp} onChange={(e) => setNextFollowUp(e.target.value)} placeholder="2025-09-20 or 'in 2 weeks'" />
                </div>

                <button className="btn btn-primary" type="submit">Save Note</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
