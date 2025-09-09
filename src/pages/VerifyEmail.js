import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyEmail } from "../api/auth"; // we’ll add this function in api/auth.js
import "./styles.css";

export default function VerifyEmail() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await verifyEmail({ email, code });
    setLoading(false);

    if (res.error) {
      alert("❌ " + res.error);
    } else {
      alert("✅ Email verified successfully! You can now login.");
      navigate("/login");
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
              />
            </div>

            <div className="form-group">
              <label>Verification Code:</label>
              <input
                type="text"
                value={code}
                required
                onChange={(e) => setCode(e.target.value)}
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
