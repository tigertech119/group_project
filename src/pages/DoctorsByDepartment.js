// src/pages/DoctorsByDepartment.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./styles.css";

export default function DoctorsByDepartment() {
  const { department } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

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
                  onClick={() => alert("Booking feature coming soon!")}
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
