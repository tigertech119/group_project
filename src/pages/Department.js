import React from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';

const Department = () => {
  const navigate = useNavigate();

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

          {/* Back Button */}
          <button 
            className="btn btn-tertiary" 
            onClick={() => navigate('/')}
            style={{ marginTop: "30px" }}
          >
             Back to Home
          </button>
        </div>
      </main>
    </div>
  );
};

export default Department;
