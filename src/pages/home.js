import React from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div className="home-container">
      {/* Main Content */}
      <main className="main-content">
        <div className="content-box">
          <h1 className="title">Streamline your hospital operations</h1>
          <p className="subtitle">Efficiently manage patients, staff, and appointments</p>
          
          <div className="button-group">
            <button className="btn btn-primary" onClick={() => navigate('/login')}>Login</button>
            <button className="btn btn-secondary" onClick={() => navigate('/register')}>
              Register
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

export default Home;


/*
import React from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate(); 

  return (
    <div className="home-container">
      {}
     
      {}
      <main className="main-content">
        <div className="content-box">
          <h1 className="title">Streamline your hospital operations</h1>
          <p className="subtitle">Efficiently manage patients, staff, and appointments</p>
          <div className="button-group">
            <button className="btn btn-primary" onClick={() => navigate('/login')}>Login</button>
            <button className="btn btn-secondary" onClick={() => navigate('/register')}>
              Register
            </button>
            <button className="btn btn-tertiary">View Departments</button>
          </div>
          <div className="action-buttons">
            <button className="action-btn">
              <span className="icon">📅</span> Book Appointment
            </button>
            <button className="action-btn">
              <span className="icon">📊</span> View Reports
            </button>
            <button className="action-btn">
              <span className="icon">💼</span> Apply for Job
            </button>
          </div>
          <button  className="about-btn" onClick={() => navigate('/about')} >
              About Hospital
             </button>
        </div>
      </main>
    </div>
  );
};

export default Home;
*/