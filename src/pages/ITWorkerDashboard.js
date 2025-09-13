// src/pages/ITWorkerDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import {
  getPendingAppointments,
  updateAppointmentStatus,
} from "../api/appointment"; // make sure path/filename matches

export default function ITWorkerDashboard({ user }) {
  const navigate = useNavigate();

  // ---------- Appointment approvals (modal) ----------
  const [showApptModal, setShowApptModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppts, setLoadingAppts] = useState(false);
  const [schedule, setSchedule] = useState({}); // { [apptId]: { date: "", time: "" } }

  // ---------- Job approvals (modal) ----------
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  // ---------- Load appointments when appointment modal opens ----------
  useEffect(() => {
    if (showApptModal) {
      loadAppointments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showApptModal]);

  async function loadAppointments() {
    setLoadingAppts(true);
    const data = await getPendingAppointments();
    if (!data.error) setAppointments(data);
    setLoadingAppts(false);
  }

  function setField(id, field, value) {
    setSchedule((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: value },
    }));
  }

  async function approveWithSchedule(id) {
    const date = schedule[id]?.date || "";
    const time = schedule[id]?.time || "";
    if (!date || !time) return alert("⚠️ Please set scheduled date & time");

    const res = await updateAppointmentStatus(id, "approved", {
      scheduledDate: date,
      scheduledTime: time,
    });
    if (res.error) return alert("❌ " + res.error);
    alert(res.message || "✅ Appointment approved");
    setAppointments((prev) => prev.filter((a) => a._id !== id));
  }

  async function reschedule(id) {
    const date = schedule[id]?.date || "";
    const time = schedule[id]?.time || "";
    if (!date || !time) return alert("⚠️ Please set new date & time");

    const res = await updateAppointmentStatus(id, "rescheduled", {
      scheduledDate: date,
      scheduledTime: time,
    });
    if (res.error) return alert("❌ " + res.error);
    alert(res.message || "🔁 Appointment rescheduled");
    setAppointments((prev) => prev.filter((a) => a._id !== id));
  }

  async function reject(id) {
    const res = await updateAppointmentStatus(id, "rejected");
    if (res.error) return alert("❌ " + res.error);
    alert(res.message || "❌ Appointment rejected");
    setAppointments((prev) => prev.filter((a) => a._id !== id));
  }

  // ---------- Job approvals: fetch when job modal opens ----------
  useEffect(() => {
    if (showApprovalModal) {
      fetchApplicants();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showApprovalModal]);

  async function fetchApplicants() {
    setLoadingApplicants(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/applicants", {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.applicants) {
        // only pending
        setApplicants(data.applicants.filter((a) => a.applicationStatus === "pending"));
      } else {
        alert("Failed to fetch applicants");
      }
    } catch (_err) {
      alert("Error connecting to server");
    } finally {
      setLoadingApplicants(false);
    }
  }

  async function handleApproveApplicant(applicantId, applicantName) {
    if (!window.confirm(`Approve ${applicantName}?`)) return;

    try {
      const res = await fetch("http://localhost:5000/api/auth/approve-applicant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ applicantId, status: "approved" }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "✅ Applicant approved!");
        fetchApplicants(); // refresh
      } else {
        alert("❌ " + (data.error || "Approval failed"));
      }
    } catch (_err) {
      alert("❌ Error approving applicant");
    }
  }

  async function handleRejectApplicant(applicantId, applicantName) {
    if (!window.confirm(`Reject ${applicantName}?`)) return;

    try {
      const res = await fetch("http://localhost:5000/api/auth/approve-applicant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ applicantId, status: "rejected" }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "❌ Applicant rejected");
        fetchApplicants(); // refresh
      } else {
        alert("❌ " + (data.error || "Rejection failed"));
      }
    } catch (_err) {
      alert("❌ Error rejecting applicant");
    }
  }

  const handleLogout = () => {
    alert("✅ Logged out successfully!");
    navigate("/");
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <div className="logo">💻 IT Worker Dashboard</div>
        <button className="btn btn-tertiary" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="main-content">
        <div className="content-box">
          <h1 className="title">Welcome, {user.profile?.fullName || "IT Worker"} 👋</h1>

          {/* Personal info */}
          <div className="profile-box" style={{ textAlign: "left" }}>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Phone:</b> {user.profile?.phone || "N/A"}</p>
            <p><b>Gender:</b> {user.profile?.gender || "N/A"}</p>
          </div>

          {/* Top actions */}
          <div style={{ margin: "16px 0", display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={() => setShowApptModal(true)}>
              📅 Appointment Approvals
            </button>
            <button className="btn btn-primary" onClick={() => setShowApprovalModal(true)}>
              📋 Job Approvals
            </button>
          </div>
        </div>
      </main>

      {/* ---------- Appointment Approvals Modal ---------- */}
      {showApptModal && (
        <div
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
          onClick={() => setShowApptModal(false)}
        >
          <div
            className="content-box"
            style={{ maxWidth: 800, width: "100%", cursor: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 className="title" style={{ marginBottom: 8 }}>📅 Pending Appointment Requests</h2>
              <button className="btn btn-tertiary" onClick={() => setShowApptModal(false)}>✖ Close</button>
            </div>

            {loadingAppts ? (
              <p>Loading pending requests...</p>
            ) : appointments.length === 0 ? (
              <p>No pending appointment requests right now ✅</p>
            ) : (
              <div className="doctor-list">
                {appointments.map((app) => (
                  <div key={app._id} className="doctor-card">
                    <h3>👤 Patient: {app.patientName}</h3>
                    <p><b>Doctor:</b> {app.doctorName}</p>
                    <p><b>Department:</b> {app.department}</p>
                    <p><b>Status:</b> {app.status}</p>

                    {/* Official schedule inputs */}
                    <div style={{ marginTop: 10, marginBottom: 10 }}>
                      <label style={{ display: "block", marginBottom: 6 }}>Set Scheduled Date:</label>
                      <input
                        type="date"
                        value={schedule[app._id]?.date || ""}
                        onChange={(e) => setField(app._id, "date", e.target.value)}
                        style={{ padding: 8, width: "100%", marginBottom: 8 }}
                      />
                      <label style={{ display: "block", marginBottom: 6 }}>Set Scheduled Time:</label>
                      <input
                        type="time"
                        value={schedule[app._id]?.time || ""}
                        onChange={(e) => setField(app._id, "time", e.target.value)}
                        style={{ padding: 8, width: "100%" }}
                      />
                    </div>

                    <div style={{ marginTop: 10 }}>
                      <button className="btn btn-primary" onClick={() => approveWithSchedule(app._id)}>
                        ✅ Approve (with schedule)
                      </button>
                      <button className="btn btn-tertiary" style={{ marginLeft: 10 }} onClick={() => reschedule(app._id)}>
                        🔁 Reschedule
                      </button>
                      <button className="btn btn-tertiary" style={{ marginLeft: 10 }} onClick={() => reject(app._id)}>
                        ❌ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------- Job Approvals Modal ---------- */}
      {showApprovalModal && (
        <div
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
          onClick={() => setShowApprovalModal(false)}
        >
          <div
            className="content-box"
            style={{ maxWidth: 700, width: "100%", cursor: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 className="title" style={{ marginBottom: 8 }}>📋 Pending Job Applications</h2>
              <button className="btn btn-tertiary" onClick={() => setShowApprovalModal(false)}>✖ Close</button>
            </div>

            {loadingApplicants ? (
              <p>Loading applicants...</p>
            ) : applicants.length === 0 ? (
              <p>No pending applications ✅</p>
            ) : (
              <div className="doctor-list">
                {applicants.map((app) => (
                  <div key={app._id} className="doctor-card">
                    <h3>{app.profile?.fullName || "Unnamed"}</h3>
                    <p><b>Email:</b> {app.email}</p>
                    <p><b>Applied For:</b> {app.appliedFor || app.role || "—"}</p>
                    {app.profile?.department && (
                      <p><b>Department:</b> {app.profile.department}</p>
                    )}

                    <div style={{ marginTop: 10 }}>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleApproveApplicant(app._id, app.profile?.fullName || app.email)}
                      >
                        ✅ Approve
                      </button>
                      <button
                        className="btn btn-tertiary"
                        style={{ marginLeft: 10 }}
                        onClick={() => handleRejectApplicant(app._id, app.profile?.fullName || app.email)}
                      >
                        ❌ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}



/*
// src/pages/ITWorkerDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import {
  getPendingAppointments,
  updateAppointmentStatus,
} from "../api/appointment"; // make sure the file name matches exactly

export default function ITWorkerDashboard({ user }) {
  const navigate = useNavigate();

  // ---------- Appointments state ----------
  const [appointments, setAppointments] = useState([]);
  const [loadingAppts, setLoadingAppts] = useState(true);
  const [schedule, setSchedule] = useState({}); // { [apptId]: { date: "", time: "" } }

  // ---------- Job approvals (modal) state ----------
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  // ---------- Load pending appointments on mount ----------
  useEffect(() => {
    async function load() {
      const data = await getPendingAppointments();
      if (!data.error) setAppointments(data);
      setLoadingAppts(false);
    }
    load();
  }, []);

  // ---------- Helpers for schedule inputs ----------
  function setField(id, field, value) {
    setSchedule((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: value },
    }));
  }

  // ---------- Appointment actions ----------
  async function approveWithSchedule(id) {
    const date = schedule[id]?.date || "";
    const time = schedule[id]?.time || "";
    if (!date || !time) return alert("⚠️ Please set scheduled date & time");

    const res = await updateAppointmentStatus(id, "approved", {
      scheduledDate: date,
      scheduledTime: time,
    });
    if (res.error) return alert("❌ " + res.error);
    alert(res.message || "✅ Appointment approved");
    setAppointments((prev) => prev.filter((a) => a._id !== id));
  }

  async function reschedule(id) {
    const date = schedule[id]?.date || "";
    const time = schedule[id]?.time || "";
    if (!date || !time) return alert("⚠️ Please set new date & time");

    const res = await updateAppointmentStatus(id, "rescheduled", {
      scheduledDate: date,
      scheduledTime: time,
    });
    if (res.error) return alert("❌ " + res.error);
    alert(res.message || "🔁 Appointment rescheduled");
    setAppointments((prev) => prev.filter((a) => a._id !== id));
  }

  async function reject(id) {
    const res = await updateAppointmentStatus(id, "rejected");
    if (res.error) return alert("❌ " + res.error);
    alert(res.message || "❌ Appointment rejected");
    setAppointments((prev) => prev.filter((a) => a._id !== id));
  }

  // ---------- Job approvals: fetch when modal opens ----------
  useEffect(() => {
    if (showApprovalModal) {
      fetchApplicants();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showApprovalModal]);

  async function fetchApplicants() {
    setLoadingApplicants(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/applicants", {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.applicants) {
        // show only pending
        setApplicants(data.applicants.filter((a) => a.applicationStatus === "pending"));
      } else {
        alert("Failed to fetch applicants");
      }
    } catch (_err) {
      alert("Error connecting to server");
    } finally {
      setLoadingApplicants(false);
    }
  }

  async function handleApproveApplicant(applicantId, applicantName) {
    if (!window.confirm(`Approve ${applicantName}?`)) return;

    try {
      const res = await fetch("http://localhost:5000/api/auth/approve-applicant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ applicantId, status: "approved" }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "✅ Applicant approved!");
        fetchApplicants();
      } else {
        alert("❌ " + (data.error || "Approval failed"));
      }
    } catch (_err) {
      alert("❌ Error approving applicant");
    }
  }

  async function handleRejectApplicant(applicantId, applicantName) {
    if (!window.confirm(`Reject ${applicantName}?`)) return;

    try {
      const res = await fetch("http://localhost:5000/api/auth/approve-applicant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ applicantId, status: "rejected" }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "❌ Applicant rejected");
        fetchApplicants();
      } else {
        alert("❌ " + (data.error || "Rejection failed"));
      }
    } catch (_err) {
      alert("❌ Error rejecting applicant");
    }
  }

  const handleLogout = () => {
    alert("✅ Logged out successfully!");
    navigate("/");
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="home-container">
      {}
      <header className="header">
        <div className="logo">💻 IT Worker Dashboard</div>
        <button className="btn btn-tertiary" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="main-content">
        <div className="content-box">
          <h1 className="title">Welcome, {user.profile?.fullName || "IT Worker"} 👋</h1>

          {} //Personal info
          <div className="profile-box" style={{ textAlign: "left" }}>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Phone:</b> {user.profile?.phone || "N/A"}</p>
            <p><b>Gender:</b> {user.profile?.gender || "N/A"}</p>
          </div>
//Top actions
          { }
          <div style={{ margin: "16px 0" }}>
            <button
              className="btn btn-primary"
              onClick={() => setShowApprovalModal(true)}
            >
              📋 Job Approvals
            </button>
          </div>

          <h2 style={{ marginTop: 20 }}>📅 Pending Appointment Requests</h2>

          {loadingAppts && <p>Loading pending requests...</p>}
          {!loadingAppts && appointments.length === 0 && (
            <p>No pending appointment requests right now ✅</p>
          )}

          <div className="doctor-list">
            {appointments.map((app) => (
              <div key={app._id} className="doctor-card">
                <h3>👤 Patient: {app.patientName}</h3>
                <p><b>Doctor:</b> {app.doctorName}</p>
                <p><b>Department:</b> {app.department}</p>
                <p><b>Status:</b> {app.status}</p>
//Official schedule inputs
                {}
                <div style={{ marginTop: 10, marginBottom: 10 }}>
                  <label style={{ display: "block", marginBottom: 6 }}>Set Scheduled Date:</label>
                  <input
                    type="date"
                    value={schedule[app._id]?.date || ""}
                    onChange={(e) => setField(app._id, "date", e.target.value)}
                    style={{ padding: 8, width: "100%", marginBottom: 8 }}
                  />
                  <label style={{ display: "block", marginBottom: 6 }}>Set Scheduled Time:</label>
                  <input
                    type="time"
                    value={schedule[app._id]?.time || ""}
                    onChange={(e) => setField(app._id, "time", e.target.value)}
                    style={{ padding: 8, width: "100%" }}
                  />
                </div>

                <div style={{ marginTop: 10 }}>
                  <button className="btn btn-primary" onClick={() => approveWithSchedule(app._id)}>
                    ✅ Approve (with schedule)
                  </button>
                  <button className="btn btn-tertiary" style={{ marginLeft: 10 }} onClick={() => reschedule(app._id)}>
                    🔁 Reschedule
                  </button>
                  <button className="btn btn-tertiary" style={{ marginLeft: 10 }} onClick={() => reject(app._id)}>
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
//---------- Job Approvals Modal ----------
      { }
      {showApprovalModal && (
        <div
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
          onClick={() => setShowApprovalModal(false)}
        >
          <div
            className="content-box"
            style={{ maxWidth: 700, width: "100%", cursor: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 className="title" style={{ marginBottom: 8 }}>📋 Pending Job Applications</h2>
              <button className="btn btn-tertiary" onClick={() => setShowApprovalModal(false)}>✖ Close</button>
            </div>

            {loadingApplicants ? (
              <p>Loading applicants...</p>
            ) : applicants.length === 0 ? (
              <p>No pending applications ✅</p>
            ) : (
              <div className="doctor-list">
                {applicants.map((app) => (
                  <div key={app._id} className="doctor-card">
                    <h3>{app.profile?.fullName || "Unnamed"}</h3>
                    <p><b>Email:</b> {app.email}</p>
                    <p><b>Applied For:</b> {app.appliedFor || app.role || "—"}</p>
                    {app.profile?.department && (
                      <p><b>Department:</b> {app.profile.department}</p>
                    )}

                    <div style={{ marginTop: 10 }}>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleApproveApplicant(app._id, app.profile?.fullName || app.email)}
                      >
                        ✅ Approve
                      </button>
                      <button
                        className="btn btn-tertiary"
                        style={{ marginLeft: 10 }}
                        onClick={() => handleRejectApplicant(app._id, app.profile?.fullName || app.email)}
                      >
                        ❌ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

*/
