// src/pages/Department.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export default function Department() {
  const navigate = useNavigate();

  const departments = [
    { label: "🫀 Cardiology", value: "Cardiology" },
    { label: "🧠 Neurology", value: "Neurology" },
    { label: "🦴 Orthopedics", value: "Orthopedics" },
    { label: "👶 Pediatrics", value: "Pediatrics" },
    { label: "🩺 General Medicine", value: "General Medicine" },
    { label: "👁 Ophthalmology", value: "Ophthalmology" },
    { label: "🦷 Dentistry", value: "Dentistry" },
  ];

  const handleNavigate = (depValue) => {
    navigate(`/doctors/${depValue}`);
  };

  return (
    <div className="home-container">
      <main className="main-content">
        <div className="content-box">
          <h1 className="title">Departments</h1>
          <ul>
            {departments.map((dep) => (
              <li
                key={dep.value}
                onClick={() => handleNavigate(dep.value)}
                style={{ cursor: "pointer", margin: "10px 0" }}
              >
                {dep.label}
              </li>
            ))}
          </ul>

          {/* ✅ Back button styled same as ApplyJob.js */}
          <button
            className="about-btn"
            onClick={() => navigate("/")}
            style={{ background: "linear-gradient(45deg, #6c757d, #5a6268)" }}
          >
            Back
          </button>
        </div>
      </main>
    </div>
  );
}

