import React, { useState } from "react";
import "./styles.css";
import { applyJob } from "../api/auth";

const ApplyJobs = () => {
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    gender: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      email: formData.email,
      password: formData.password,
      role: role.toLowerCase(),
      profile: {
        fullName: formData.fullName,
        phone: formData.phone,
        gender: formData.gender,
      },
    };

    const res = await applyJob(payload);
    if (res.user) {
      alert(`✅ Registered as ${role}. Next, upload your CV.`);
      // now open Google Form
      window.location.href =
        "https://docs.google.com/forms/d/166EXeFn0y7R4Yunn_7XWc3JmliFTXcZaDOkGUcbDXG4/edit";
    } else {
      alert(res.error || "Failed ❌");
    }
  };

  return (
    <div className="home-container">
      <main className="main-content">
        <div className="content-box">
          <h1 className="title">Apply For Jobs</h1>

          {!role && (
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
          )}

          {role && (
            <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
              <h2>Apply as {role}</h2>
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
              <button className="btn btn-primary" type="submit">
                Submit & Upload CV
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default ApplyJobs;
