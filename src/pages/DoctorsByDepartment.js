// src/pages/DoctorsByDepartment.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./styles.css";
import { getMe } from "../api/auth"; // ✅ check logged-in user

export default function DoctorsByDepartment() {
  const { department } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // ✅ Check logged-in user
  useEffect(() => {
    async function fetchUser() {
      const res = await getMe();
      if (res.user) setUser(res.user);
    }
    fetchUser();
  }, []);

  // ✅ Fetch doctors by department
  useEffect(() => {
    async function fetchDoctors() {
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
    fetchDoctors();
  }, [department]);

  // ✅ Book appointment handler
  async function handleBook(doctorId) {
    if (!user) {
      alert("⚠️ Please login first to book an appointment");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/appointments/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          patientId: user._id,
          doctorId,
          department,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Appointment request sent to IT Worker for approval");
      } else {
        alert("❌ " + (data.error || "Booking failed"));
      }
    } catch (err) {
      alert("❌ Network error: " + err.message);
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
        </div>
      </main>
    </div>
  );
}
