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

  // Form fields
  const [diagnosis, setDiagnosis] = useState("");
  const [stage, setStage] = useState("");
  const [treatment, setTreatment] = useState("");
  const [tests, setTests] = useState("");
  const [prescription, setPrescription] = useState("");
  const [notes, setNotes] = useState("");
  const [nextFollowUp, setNextFollowUp] = useState("");

  // Load paginated appointments
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

  // Load paginated records
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
    // Reset form or load existing note if any
    setDiagnosis("");
    setStage("");
    setTreatment("");
    setTests("");
    setPrescription("");
    setNotes("");
    setNextFollowUp("");
    setShowNoteModal(true);

    // Check if note already exists for this appointment
    checkExistingNote(appt._id);
  }

  async function checkExistingNote(appointmentId) {
    try {
      const res = await fetch(`http://localhost:5000/api/records/appointment/${appointmentId}`);
      const data = await res.json();
      if (!data.error && data._id) {
        // Load existing note into form
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
    loadRecords(recordsPage); // Refresh records
  }

  const handleLogout = () => {
    alert("✅ Logged out successfully!");
    navigate("/");
  };

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

/*
// src/pages/DoctorDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { getDoctorAppointments } from "../api/appointment"; // existing helper
import { createRecord, getDoctorRecords } from "../api/records"; // NEW

export default function DoctorDashboard({ user }) {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [activeAppt, setActiveAppt] = useState(null);

  // Form fields
  const [diagnosis, setDiagnosis] = useState("");
  const [stage, setStage] = useState("");
  const [treatment, setTreatment] = useState("");
  const [tests, setTests] = useState(""); // comma-separated
  const [prescription, setPrescription] = useState("");
  const [notes, setNotes] = useState("");
  const [nextFollowUp, setNextFollowUp] = useState("");

  // Fetch doctor's appointments
  useEffect(() => {
    async function loadAppointments() {
      const data = await getDoctorAppointments(user._id);
      if (!data.error) setAppointments(data);
    }
    loadAppointments();
  }, [user._id]);

  // Fetch doctor's recent records
  useEffect(() => {
    async function loadRecords() {
      const data = await getDoctorRecords(user._id);
      if (!data.error) setRecords(data);
    }
    loadRecords();
  }, [user._id]);

  function openModal(appt) {
    setActiveAppt(appt); // appt includes patientId from backend
    // reset form
    setDiagnosis("");
    setStage("");
    setTreatment("");
    setTests("");
    setPrescription("");
    setNotes("");
    setNextFollowUp("");
    setShowModal(true);
  }

  async function submitRecord(e) {
    e.preventDefault();
    if (!activeAppt) return;

    const patientId =
      activeAppt.patientId?._id || // if you ever change to populated object
      activeAppt.patientId ||      // current formatted string id
      null;

    const doctorId = user?._id;

    if (!patientId || !doctorId) {
      alert("❌ patientId and doctorId are required");
      return;
    }

    const payload = {
      patientId,
      doctorId,
      appointmentId: activeAppt._id,
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
    alert("✅ Record saved");

    // Refresh recent records
    const refreshed = await getDoctorRecords(user._id);
    if (!refreshed.error) setRecords(refreshed);

    setShowModal(false);
  }

  const handleLogout = () => {
    alert("✅ Logged out successfully!");
    navigate("/");
  };

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
          <h1 className="title">
            Welcome, Dr. {user.profile?.fullName || "Doctor"} 👋
          </h1>
          <p className="subtitle">Here are your patient appointments & notes</p>

          { }
          <div className="profile-card">
            <p><b>Name:</b> {user.profile?.fullName}</p>
            <p><b>Department:</b> {user.profile?.department || "N/A"}</p>
            <p><b>Phone:</b> {user.profile?.phone}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Gender:</b> {user.profile?.gender}</p>
          </div>

          { }
          <div className="appointments">
            <h3>📅 Approved Appointments</h3>
            {appointments.length === 0 ? (
              <p>No approved appointments yet.</p>
            ) : (
              appointments
                .filter((app) => app.status === "approved" || app.status === "rescheduled")
                .map((app) => (
                  <div key={app._id} className="appointment-card">
                    <p><b>Patient:</b> {app.patientName || "Unknown"}</p>
                    <p><b>Department:</b> {app.department}</p>
                    {(app.scheduledDate || app.scheduledTime) ? (
                      <p><b>Scheduled:</b> {app.scheduledDate || "—"} {app.scheduledTime || ""}</p>
                    ) : null}
                    <div style={{ marginTop: 10 }}>
                      <button className="btn btn-primary" onClick={() => openModal(app)}>
                        ✍️ Add Visit Note
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>

          { }
          <div className="appointments" style={{ marginTop: 24 }}>
            <h3>🗒️ Recent Visit Notes</h3>
            {records.length === 0 ? (
              <p>No notes yet.</p>
            ) : (
              records.slice(0, 8).map((r) => (
                <div key={r._id} className="appointment-card">
                  <p><b>Patient:</b> {r.patientId?.profile?.fullName || r.patientId?.email || "Unknown"}</p>
                  {r.appointmentId && (
                    <p><b>Appt:</b> {r.appointmentId?.department} · {r.appointmentId?.scheduledDate || "—"} {r.appointmentId?.scheduledTime || ""}</p>
                  )}
                  {r.diagnosis && <p><b>Diagnosis:</b> {r.diagnosis}</p>}
                  {r.stage && <p><b>Stage:</b> {r.stage}</p>}
                  {r.treatment && <p><b>Treatment:</b> {r.treatment}</p>}
                  {!!(r.tests && r.tests.length) && <p><b>Tests:</b> {r.tests.join(", ")}</p>}
                  {r.prescription && <p><b>Prescription:</b> {r.prescription}</p>}
                  {r.nextFollowUp && <p><b>Next Follow-up:</b> {r.nextFollowUp}</p>}
                  {r.notes && <p><b>Notes:</b> {r.notes}</p>}
                  <p style={{ opacity: 0.7, fontSize: "0.9em" }}>
                    Created: {new Date(r.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      { }
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            zIndex: 1000,
          }}
        >
          <div
            className="content-box"
            style={{ maxWidth: 800, width: "100%", cursor: "auto", textAlign: "left" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 className="title" style={{ marginBottom: 8 }}>✍️ Add Visit Note</h2>
              <button className="btn btn-tertiary" onClick={() => setShowModal(false)}>✖ Close</button>
            </div>

            <p style={{ marginTop: 0 }}>
              <b>Patient:</b> {activeAppt?.patientName || "Unknown"} &nbsp;|&nbsp;
              <b>Appt:</b> {activeAppt?.department} · {activeAppt?.scheduledDate || "—"} {activeAppt?.scheduledTime || ""}
            </p>

            <form onSubmit={submitRecord}>
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
                <textarea value={treatment} onChange={(e) => setTreatment(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Tests (comma-separated)</label>
                <input
                  value={tests}
                  onChange={(e) => setTests(e.target.value)}
                  placeholder="CBC, Lipid profile"
                />
              </div>

              <div className="form-group">
                <label>Prescription</label>
                <textarea
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  placeholder="Paracetamol 500mg BID × 5 days"
                />
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Next Follow-up (date or text)</label>
                <input
                  value={nextFollowUp}
                  onChange={(e) => setNextFollowUp(e.target.value)}
                  placeholder="2025-09-20 or 'in 2 weeks'"
                />
              </div>

              <button className="btn btn-primary" type="submit">Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
*/


 