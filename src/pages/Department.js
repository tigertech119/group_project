import React from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';
const Department = () => {
  return (
    <div className="home-container">
      <main className="main-content">
        <div className="content-box">
          <h1 className="title">Hospital Departments</h1>
          <ul style={{ textAlign: "left", fontSize: "1.2em" }}>
            <li>🫀 Cardiology</li>
            <li>🧠 Neurology</li>
            <li>🦴 Orthopedics</li>
            <li>👶 Pediatrics</li>
            <li>🩺 General Medicine</li>
            <li>👁 Ophthalmology</li>
            <li>🦷 Dentistry</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Department;