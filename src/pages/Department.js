import React from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <span role="img" aria-label="hospital">🏥</span> About Apex Hospital
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-box" style={{ textAlign: 'center' }}>
          <h1 className="title">About Our Hospital</h1>
          <p className="subtitle">
            Apex Hospital is dedicated to providing world-class healthcare services 
            to our patients with compassion, care, and modern technology.
          </p>
          <p style={{ color: '#555', fontSize: '1.2em', marginBottom: '30px' }}>
            We offer services across multiple departments including cardiology, 
            neurology, pediatrics, and more. Our experienced team of doctors and 
            medical staff ensure the best treatment for every patient.
          </p>

          <button 
            className="about-btn" 
            onClick={() => navigate('/')}
            style={{ background: 'linear-gradient(45deg, #6c757d, #5a6268)' }}
          >
            Back
          </button>
        </div>
      </main>
    </div>
  );
};

export default About;