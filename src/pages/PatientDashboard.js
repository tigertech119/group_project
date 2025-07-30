import React from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <span role="img" aria-label="hospital">🏥</span> Patient Dashboard
        </div>
        <nav className="nav">
          <a href="#" className="nav-link">Dashboard</a>
          <a href="#" className="nav-link">My Profile</a>
          <a href="#" className="nav-link">Settings</a>
        </nav>
        <button 
          className="about-btn"
          onClick={() => navigate('/')}
          style={{ background: 'linear-gradient(45deg, #6c757d, #5a6268)' }}
        >
          Logout
        </button>
      </header>

      {/* Main Dashboard Content */}
      <main className="main-content">
        <div className="content-box" style={{ textAlign: 'center' }}>
          <h1 className="title">Welcome, Patient!</h1>
          <p className="subtitle">Manage your healthcare easily.</p>

          {/* Patient-Specific Actions */}
          <div className="button-group" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="action-btn">
              <span className="icon">📅</span> Book Appointment
            </button>
            <button className="action-btn">
              <span className="icon">💊</span> View Prescriptions
            </button>
            <button className="action-btn">
              <span className="icon">📄</span> Medical Reports
            </button>
            <button className="action-btn">
              <span className="icon">🧾</span> Billing & Payments
            </button>
            <button className="action-btn">
              <span className="icon">💬</span> Chat with Doctor
            </button>
            <button className="action-btn">
              <span className="icon">⚙️</span> Account Settings
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
