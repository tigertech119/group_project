// src/pages/Department.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export default function Department() {
  const navigate = useNavigate();

  // ✅ Store label (with emoji) and value (clean name for API & URL)
  const departments = [
    { label: "🫀 Cardiology", value: "Cardiology" },
    { label: "🧠 Neurology", value: "Neurology" },
    { label: "🦴 Orthopedics", value: "Orthopedics" },
    { label: "👶 Pediatrics", value: "Pediatrics" },
    { label: "🩺 General Medicine", value: "General Medicine" },
    { label: "👁 Ophthalmology", value: "Ophthalmology" },
    { label: "🦷 Dentistry", value: "Dentistry" },
  ];

  return (
    <div className="home-container">
      <main className="main-content">
        <div className="content-box">
          <h1 className="title">Departments</h1>
          <ul>
            {departments.map((dep) => (
              <li
                key={dep.value}
                onClick={() => navigate(`/doctors/${dep.value}`)} // ✅ clean value used in route
                style={{ cursor: "pointer", margin: "10px 0" }}
              >
                {dep.label}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
