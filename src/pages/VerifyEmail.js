// src/pages/VerifyEmail.js - FIXED VERSION
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyEmail } from "../api/auth";
import "./styles.css";

export default function VerifyEmail() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !code) {
      alert("⚠️ Please enter both email and verification code");
      return;
    }
    
    setLoading(true);

    try {
      const result = await verifyEmail({ email, code });
      
      if (result.error) {
        alert("❌ " + result.error);
      } else if (result.success || result.verified) { // ✅ Check for BOTH possible responses
        alert("✅ " + (result.message || "Email verified successfully!"));
        navigate("/login");
      } else {
        alert("❌ Unexpected response from server");
      }
    } catch (err) {
      alert("❌ Verification failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <main className="main-content">
        <div className="content-box">
          <h1 className="title">Verify Your Email</h1>
          <p>Enter the verification code sent to your email.</p>

          <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter the email you registered with"
              />
            </div>

            <div className="form-group">
              <label>Verification Code:</label>
              <input
                type="text"
                value={code}
                required
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength="6"
              />
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}