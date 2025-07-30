import React from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <span role="img" aria-label="hospital">🏥</span> Apex Hospital
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-box">
          <h1 className="title">Login</h1>
          <p className="subtitle">Access your account securely</p>
          
          <form style={{ textAlign: 'left' }}>
            <div className="form-group">
              <label>Email:</label>
              <input type="email" placeholder="Enter your email" />
            </div>

            <div className="form-group">
              <label>Password:</label>
              <input type="password" placeholder="Enter your password" />
            </div>

            <button 
              className="btn btn-primary" 
              type="button"
              onClick={() => navigate('/patient-dashboard')} // Navigates directly to Patient Dashboard
            >
              Login
            </button>

            <button 
              className="about-btn" 
              style={{ marginLeft: '15px', background: 'linear-gradient(45deg, #6c757d, #5a6268)' }}
              type="button"
              onClick={() => navigate('/')}
            >
              Back
            </button>
          </form>

          <p style={{ marginTop: '15px', color: '#555' }}>
            Don't have an account? <a href="/register" style={{ color: '#1a73e8', textDecoration: 'none' }}>Register here</a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;


/*
import React, { useState } from 'react';
import './styles.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login Data:', { email, password });
    // Connect to backend authentication API later
  };

  return (
    <div className="home-container">
      {}
      <header className="header">
        <div className="logo">
          <span role="img" aria-label="hospital">🏥</span> Apex Hospital
        </div>
      </header>

      {}
      <main className="main-content">
        <div className="content-box">
          <h1 className="title">Login</h1>
          <p className="subtitle">Access your account securely</p>
          
          <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
            <div className="form-group">
              <label>Email:</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Password:</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>

            <button className="btn btn-primary" type="submit">Login</button>
          </form>

          <p style={{ marginTop: '15px', color: '#555' }}>
            Don't have an account? <a href="/register" style={{ color: '#1a73e8', textDecoration: 'none' }}>Register here</a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
*/