import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import { getMe } from "../api/auth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const res = await getMe();
      if (res.user) {
        setUser(res.user);
      }
    } catch {
      setUser(null);
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  // ✅ Only show links if NOT on home
  const isHome = location.pathname === "/";

  return (
    <nav className="navbar">
      <div className="navbar-logo">🏥 Apex Hospital Management System</div>

      {!isHome && (
        <>
          <button className="navbar-toggle" onClick={toggleMenu}>
            ☰
          </button>

          <ul className={`navbar-links ${isOpen ? "active" : ""}`}>
            <li>
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>

            {user && (
              <li>
                <Link to="/dashboard" className="nav-link">
                  Dashboard
                </Link>
              </li>
            )}
          </ul>
        </>
      )}
    </nav>
  );
};

export default Navbar;



/*
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { getMe, logoutUser } from "../api/auth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuthStatus() {
      const res = await getMe();
      if (res.user) {
        setUser(res.user);
        localStorage.setItem("user", JSON.stringify(res.user));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    }
    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      localStorage.removeItem("user"); // ✅ clear saved user
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar">
      <div className="navbar-logo">🏥 Apex Hospital Management System</div>

      <button className="navbar-toggle" onClick={toggleMenu}>
        ☰
      </button>
      <ul className={`navbar-links ${isOpen ? "active" : ""}`}>
        <li><Link to="/" className="nav-link">Home</Link></li>

        {user ? (
          <>
            <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
            <li>
              <button className="nav-link logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login" className="nav-link">Login</Link></li>
            <li><Link to="/register" className="nav-link">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;

*/

/*
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { getMe, logoutUser } from '../api/auth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const res = await getMe();
      if (res.user) {
        setUser(res.user);
      }
    } catch (err) {
      setUser(null);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar">
      <div className="navbar-logo">🏥 Apex Hospital Management System</div>

      <button className="navbar-toggle" onClick={toggleMenu}>
        ☰
      </button>
      <ul className={`navbar-links ${isOpen ? 'active' : ''}`}>
        <li><Link to="/" className="nav-link">Home</Link></li>
        
        {user ? (
          <>
            <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
            <li>
              <button className="nav-link logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login" className="nav-link">Login</Link></li>
            <li><Link to="/register" className="nav-link">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;

*/