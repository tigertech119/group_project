import React, { useState } from "react";
import "./styles.css";
import { useNavigate } from "react-router-dom"; // ✅ import navigate hook

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // ✅ create navigate function

  // 🔹 Call backend API for login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // include cookies (JWT)
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Login failed ❌");
        return;
      }

      alert("✅ Login successful!");
      console.log("User:", data.user);

      // ✅ Redirect to dashboard (based on role or default patient dashboard)
      if (data.user.role === "patient") {
        navigate("/patient-dashboard");
      } else if (data.user.role === "doctor") {
        navigate("/doctor-dashboard");
      } else if (data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/"); // fallback (homepage)
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong 😢");
    }
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <span role="img" aria-label="hospital">🏥</span> Apex Hospital
        </div>
      </header>

      {/* Main */}
      <main className="main-content">
        <div className="content-box">
          <h1 className="title">Login</h1>
          <p className="subtitle">Access your account securely</p>

          <form onSubmit={handleLogin} style={{ textAlign: "left" }}>
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

            <button className="btn btn-primary" type="submit">
              Login
            </button>
          </form>

          <p style={{ marginTop: "15px", color: "#555" }}>
            Don’t have an account?{" "}
            <a href="/register" style={{ color: "#1a73e8", textDecoration: "none" }}>
              Register here
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
