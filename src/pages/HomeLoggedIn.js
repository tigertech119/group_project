// src/pages/HomeLoggedIn.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const HomeLoggedIn = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any user data from localStorage if needed
    localStorage.removeItem('user');
    alert('✅ Logged out successfully!');
    navigate('/'); // Redirect to original home page
  };

  return (
    <div className="home-container">
      {/* Header with Logout Button */}
      <header className="header" style={{justifyContent: 'flex-end', padding: '15px 30px'}}>
        <button className="btn btn-tertiary" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Main Content - Same as original home page but with different buttons */}
      <main className="main-content">
        <div className="content-box">
          <h1 className="title">Streamline your hospital operations</h1>
          <p className="subtitle">Efficiently manage patients, staff, and appointments</p>
          
          <div className="button-group">
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/departments')}>
              View Departments
            </button>
          </div>

          <div className="action-buttons">
            <button className="btn btn-primary" onClick={() => navigate('/view-reports')}>
              📊 View Reports
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/apply-jobs')}>
              💼 Apply for Jobs
            </button>
            <button className="btn btn-tertiary" onClick={() => navigate('/about')}>
              ℹ️ About Hospital
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomeLoggedIn;