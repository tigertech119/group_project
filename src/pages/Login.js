// src/pages/Login.js
import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotMode, setForgotMode] = useState(false);
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return alert("❌ " + data.error);
      alert("✅ Login successful!");
      window.location.href = "/dashboard";
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  // Step 1: Request reset code
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) return alert("❌ " + data.error);
      alert("📩 Reset code sent to your email");
      setForgotMode(true);
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  // Step 2: Reset password with code
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: resetCode, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) return alert("❌ " + data.error);
      alert("✅ Password reset successful. Please log in.");
      setForgotMode(false);
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <div className="home-container">
      <main className="main-content">
        <div className="content-box">
          <h1 className="title">Login</h1>

          {!forgotMode ? (
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button className="btn btn-primary" type="submit">
                Login
              </button>
              <p>
                <button
                  type="button"
                  className="btn btn-tertiary"
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <h2>Reset Password</h2>
              <p>Enter the code sent to your email and your new password</p>
              <input
                type="text"
                placeholder="Reset Code"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button className="btn btn-primary" type="submit">
                Reset Password
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default Login;
