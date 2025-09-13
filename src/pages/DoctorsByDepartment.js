// src/pages/DoctorsByDepartment.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./styles.css";
import { getMe } from "../api/auth";
import { requestAppointment } from "../api/appointment.js";

export default function DoctorsByDepartment() {
  const { department } = useParams();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check logged-in user
  useEffect(() => {
    async function fetchUser() {
      const res = await getMe();
      if (res.user) setUser(res.user);
    }
    fetchUser();
  }, []);

  // Fetch doctors by department
  useEffect(() => {
    async function fetchDocs() {
      try {
        const res = await fetch(`http://localhost:5000/api/doctors/${department}`);
        const data = await res.json();
        setDoctors(data);
      } catch (err) {
        console.error("❌ Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDocs();
  }, [department]);

  // Book appointment (no requested date/time; IT worker will set schedule)
  async function handleBook(doctorId) {
    if (!user) {
      alert("⚠️ Please login first to book an appointment");
      return;
    }

    const res = await requestAppointment(user._id, doctorId, department);
    if (res.error) {
      alert("❌ " + res.error);
    } else {
      alert("✅ Request sent. IT worker will schedule your time.");
    }
  }

  return (
    <div className="home-container">
      <main className="main-content">
        <div className="content-box">
          <h1 className="title">{department} Doctors</h1>

          {loading && <p>Loading doctors...</p>}

          {!loading && doctors.length === 0 && (
            <p className="subtitle">No doctors available in this department.</p>
          )}

          <div className="doctor-list">
            {doctors.map((doc) => (
              <div key={doc._id} className="doctor-card">
                <h2>{doc.profile?.fullName || "Unnamed Doctor"}</h2>
                <p><b>Phone:</b> {doc.profile?.phone || "N/A"}</p>
                <p><b>Gender:</b> {doc.profile?.gender || "N/A"}</p>
                <button
                  className="btn btn-primary"
                  onClick={() => handleBook(doc._id)}
                >
                  📅 Book Appointment
                </button>
              </div>
            ))}
          </div>

          <button
            className="about-btn"
            onClick={() => navigate("/departments")}
            style={{ background: "linear-gradient(45deg, #6c757d, #5a6268)", marginTop: "20px" }}
          >
            ← Back
          </button>
        </div>
      </main>
    </div>
  );
}

