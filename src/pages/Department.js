// src/pages/Department.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export default function Department() {
  const navigate = useNavigate();
  const departments = [
    "🫀Cardiology",
    "🧠Neurology",
    "🦴Orthopedics",
    "👶Pediatrics",
    "🩺General Medicine",
    "👁Ophthalmology",
    "🦷Dentistry",
  ];

  return (
    <div className="home-container">
      <main className="main-content">
        <div className="content-box">
          <h1 className="title">Departments</h1>
          <ul>
            {departments.map((dep) => (
              <li
                key={dep}
                onClick={() => navigate(`/doctors/${dep}`)} // ✅ new page
                style={{ cursor: "pointer", margin: "10px 0" }}
              >
                {dep}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
