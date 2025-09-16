// src/components/Navbar.js
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

  const handleHomeClick = (e) => {
    if (user) {
      e.preventDefault();
      navigate('/home-loggedin'); // Redirect to logged-in home page
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">🏥 Apex Hospital Management System</div>

      <button className="navbar-toggle" onClick={toggleMenu}>
        ☰
      </button>

      <ul className={`navbar-links ${isOpen ? "active" : ""}`}>
        <li>
          <Link to={user ? "/home-loggedin" : "/"} className="nav-link" onClick={handleHomeClick}>
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
    </nav>
  );
};

export default Navbar;

/*
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

*/