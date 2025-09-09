// src/pages/ApplyJobs.js
import React, { useState } from "react";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import { applyJob } from "../api/auth";

const ApplyJobs = () => {
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    gender: "",
    password: "",
    department: "", // ✅ only used for doctors
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password.length < 6) {
    alert("❌ Password must be at least 6 characters long");
    return;
  }

  const payload = {
    email: formData.email,
    password: formData.password,
    role: role.toLowerCase(),
    profile: {
      fullName: formData.fullName,
      phone: formData.phone,
      gender: formData.gender,
      department: role === "Doctor" ? formData.department : null,
    },
  };

  const res = await applyJob(payload);

  if (res.message) {
    alert(`✅ Application submitted. Please check your email for a verification code.`);
    navigate("/verify-email"); // go to verification page
  } else {
    alert(res.error || "Failed ❌");
  }
  if (res.user) {
  alert("✅ Application submitted. Please check your email for a verification code.");
  navigate("/verify-email");
}

};


  return (
    <div className="home-container">
      <main className="main-content">
        <div className="content-box">
          <h1 className="title">Apply For Jobs</h1>

          {!role && (
            <div>
              <div className="button-group">
                {["Doctor", "Nurse", "WardBoy", "IT Worker"].map((r) => (
                  <button
                    key={r}
                    className="btn btn-primary"
                    onClick={() => setRole(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <button
                className="btn btn-tertiary"
                onClick={() => navigate("/")}
                style={{ marginTop: "30px" }}
              >
                Back to Home
              </button>
            </div>
          )}

          {role && (
            <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
              <h2>Apply as {role}</h2>
              <button
                type="button"
                className="btn btn-tertiary"
                onClick={() => setRole("")}
                style={{ marginBottom: "20px" }}
              >
                ← Back to Role Selection
              </button>

              <div className="form-group">
                <label>Full Name:</label>
                <input
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Password:</label>
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Phone:</label>
                <input
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Gender:</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* ✅ Department dropdown only if Doctor */}
              {role === "Doctor" && (
                <div className="form-group">
                  <label>Department:</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Ophthalmology">Ophthalmology</option>
                    <option value="Dentistry">Dentistry</option>
                  </select>
                </div>
              )}

              <button className="btn btn-primary" type="submit">
                Submit Application
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default ApplyJobs;
