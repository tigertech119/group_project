// src/components/Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar">
      <div className="navbar-logo">🏥 Apex Hospital</div>
      <button className="navbar-toggle" onClick={toggleMenu}>
        ☰
      </button>
      <ul className={`navbar-links ${isOpen ? 'active' : ''}`}>
        <li><Link to="/" className="nav-link">Home</Link></li>
        <li><Link to="/patientDashboard" className="nav-link">patientDashboard</Link></li>
        <li><Link to="/about" className="nav-link">About</Link></li>
   <li><Link to="/Apointment" className="nav-link">Apointment</Link></li>

      </ul>
    </nav>
  );
};

export default Navbar;
