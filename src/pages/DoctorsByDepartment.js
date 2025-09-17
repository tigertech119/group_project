// src/pages/DoctorsByDepartment.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; // ✅ added useLocation
import "./styles.css";
import { getMe } from "../api/auth";
import { requestAppointment } from "../api/appointment.js";

export default function DoctorsByDepartment() {
  const { department } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // ✅ re-check user when route changes

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // ✅ Check logged-in user on load & when route changes
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await getMe();
        if (res.user) setUser(res.user);
        else setUser(null);
      } catch {
        setUser(null);
      }
    }
    fetchUser();
  }, [location.key]); // runs again after logout redirect

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

  // Book appointment
  async function handleBook(doctorId) {
    if (!user || user.role !== "patient") {
      alert("⚠️ Please login as a patient to book an appointment");
      navigate("/login");
      return;
    }

    const res = await requestAppointment(user._id, doctorId, department);

    if (res.authError) {
      alert(res.error || "⚠️ Please login first to book an appointment");
      navigate("/login");
      return;
    }

    if (res.error) {
      alert("❌ " + res.error);
      return;
    }

    alert("✅ Request sent. IT worker will schedule your time.");
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

                {/* ✅ Conditional rendering */}
                {user?.role === "patient" ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleBook(doc._id)}
                  >
                    📅 Book Appointment
                  </button>
                ) : (
                  <p className="subtitle" style={{ color: "#888", marginTop: "8px" }}>
                    ⚠️ Login as a patient to book an appointment
                  </p>
                )}
              </div>
            ))}
          </div>

          <button
            className="about-btn"
            onClick={() => navigate(-1)}
            style={{ background: "linear-gradient(45deg, #6c757d, #5a6268)", marginTop: "20px" }}
          >
            Back
          </button>
        </div>
      </main>
    </div>
  );
}
