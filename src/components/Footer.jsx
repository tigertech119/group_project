// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-col">
          <h4>About</h4>
          <p>
            Apex Hospital provides 24/7 emergency care, specialist departments,
            and online appointment scheduling for patients and staff.
          </p>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/departments">Departments</Link></li>
            <li><Link to="/view-reports">View Reports</Link></li>
            <li><Link to="/apply-jobs">Careers</Link></li>
            <li><Link to="/about">About Hospital</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <ul>
            <li>📍 123 Health Ave, Dhaka</li>
            <li>📞 +880 1XXX-XXXXXX</li>
            <li>✉️ support@apex-hospital.example</li>
            <li>🕒 Emergency: 24/7</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {year} Apex Hospital Management System</span>
        <div className="footer-legal">
          <Link to="/about">About</Link>
          <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy</a>
          <a href="#terms" onClick={(e) => e.preventDefault()}>Terms</a>
        </div>
      </div>
    </footer>
  );
}
