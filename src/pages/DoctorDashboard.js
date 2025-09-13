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
      {/* Header */}
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

          {/* Doctor Profile */}
          <div className="profile-card">
            <p><b>Name:</b> {user.profile?.fullName}</p>
            <p><b>Department:</b> {user.profile?.department || "N/A"}</p>
            <p><b>Phone:</b> {user.profile?.phone}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Gender:</b> {user.profile?.gender}</p>
          </div>

          {/* Approved/Rescheduled Appointments */}
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

          {/* Recent Notes */}
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

      {/* Modal */}
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

  // Fetch doctor's approved/rescheduled appointments
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
    setActiveAppt(appt);
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

    const payload = {
      patientId: activeAppt.patientId?._id || activeAppt.patientId, // depending on populate
      doctorId: user._id,
      appointmentId: activeAppt._id,
      diagnosis,
      stage,
      treatment,
      tests,         // can be comma-separated; backend normalizes
      prescription,  // simple free text
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
      {}
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

          {}
          <div className="profile-card">
            <p><b>Name:</b> {user.profile?.fullName}</p>
            <p><b>Department:</b> {user.profile?.department || "N/A"}</p>
            <p><b>Phone:</b> {user.profile?.phone}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Gender:</b> {user.profile?.gender}</p>
          </div>

          {}
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
                    ) : (
                      (app.requestedDate || app.requestedTime) && (
                        <p><b>Requested:</b> {app.requestedDate || "—"} {app.requestedTime || ""}</p>
                      )
                    )}
                    <div style={{ marginTop: 10 }}>
                      <button className="btn btn-primary" onClick={() => openModal(app)}>
                        ✍️ Add Visit Note
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>

          {}
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

      {}
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
                <input value={tests} onChange={(e) => setTests(e.target.value)} placeholder="CBC, Lipid profile" />
              </div>

              <div className="form-group">
                <label>Prescription</label>
                <textarea value={prescription} onChange={(e) => setPrescription(e.target.value)} placeholder="Paracetamol 500mg BID × 5 days" />
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Next Follow-up (date or text)</label>
                <input value={nextFollowUp} onChange={(e) => setNextFollowUp(e.target.value)} placeholder="2025-09-20 or 'in 2 weeks'" />
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