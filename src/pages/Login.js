// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, forgotPassword } from "../api/auth"; // ✅ use API helpers

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password }); // ✅ use helper

      if (res.error) {
        alert("❌ " + res.error);
      } else {
        alert("✅ Login successful!");
        navigate("/dashboard"); // ✅ redirect to dashboard
      }
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      return alert("⚠️ Please enter your email first.");
    }

    try {
      const res = await forgotPassword(email);
      if (res.error) {
        alert("❌ " + res.error);
      } else {
        alert("📩 Reset code sent to your email");
        localStorage.setItem("resetEmail", email);
        navigate("/reset-password");
      }
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <div className="home-container">
      <main className="main-content">
        <div className="content-box">
          <h1 className="title">Login</h1>

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

            <p style={{ marginTop: "10px" }}>
              <button
                type="button"
                className="btn btn-tertiary"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </button>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Login;

/*
// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../api/auth"; // ✅ frontend API helper

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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
      navigate("/dashboard"); // redirect to dashboard
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      return alert("⚠️ Please enter your email first.");
    }

    try {
      const res = await forgotPassword(email); // ✅ use frontend helper
      if (res.error) {
        alert("❌ " + res.error);
      } else {
        alert("📩 Reset code sent to your email");

        // ✅ Save email for ResetPassword.js
        localStorage.setItem("resetEmail", email);

        // ✅ Redirect to Reset Password page
        navigate("/reset-password");
      }
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <div className="home-container">
      <main className="main-content">
        <div className="content-box">
          <h1 className="title">Login</h1>

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

            {}
            <p style={{ marginTop: "10px" }}>
              <button
                type="button"
                className="btn btn-tertiary"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </button>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Login;
*/