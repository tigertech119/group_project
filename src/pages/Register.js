// src/pages/Register.js
import React, { useState } from 'react';
import './styles.css';

const Register = () => {
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    sex: '',
    age: '',
    address: '',
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registration Data:", { role, ...formData });
    // You can connect this to your backend/API later
  };

  return (
    <div className="home-container">
      <header className="header">
        <div className="logo">
          <span role="img" aria-label="hospital">🏥</span> Apex Hospital
        </div>
      </header>

      <main className="main-content">
        <div className="content-box">
          <h1 className="title">Register</h1>

          {!role && (
            <div className="button-group">
              {['Doctor', 'Patient', 'Admin', 'Staff'].map((r) => (
                <button
                  key={r}
                  className="btn btn-primary"
                  onClick={() => setRole(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          )}

          {role && (
            <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
              <h2 style={{ color: '#1a73e8' }}>Register as {role}</h2>

              <div className="form-group">
                <label>First Name:</label>
                <input name="firstName" required value={formData.firstName} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Last Name:</label>
                <input name="lastName" required value={formData.lastName} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Phone:</label>
                <input name="phone" required type="tel" value={formData.phone} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input name="email" required type="email" value={formData.email} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Sex:</label>
                <select name="sex" required value={formData.sex} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Age:</label>
                <input name="age" required type="number" value={formData.age} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Address:</label>
                <textarea name="address" required value={formData.address} onChange={handleChange}></textarea>
              </div>

              <button className="btn btn-primary" type="submit">Submit</button>
              <button className="btn btn-tertiary" type="button" onClick={() => setRole('')} style={{ marginLeft: '10px' }}>Back</button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default Register;
