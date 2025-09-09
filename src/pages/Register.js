// src/pages/Register.js
import React, { useState } from "react";
import { registerUser } from "../api/auth";

const Register = () => {
  const [step, setStep] = useState(1); // 1 = form, 2 = code
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    sex: "",
    age: "",
    address: "",
    blood_group: "",
  });
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Step 1: Register user → backend sends code
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      email: formData.email,
      password: formData.password,
      profile: {
        fullName: formData.fullName,
        phone: formData.phone,
        gender: formData.sex,
        dob: formData.age
          ? new Date().setFullYear(new Date().getFullYear() - formData.age)
          : null,
        address: formData.address,
        blood_group: formData.blood_group, 
      },
    };

    const res = await registerUser(payload);
    if (res.error) {
      alert("❌ " + res.error);
    } else {
      alert("📩 Verification code sent to email");
      setEmail(formData.email);
      setStep(2);
    }
  };

  // Step 2: Verify code
  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) return alert("❌ " + data.error);
      alert("✅ Email verified! You can now log in.");
      window.location.href = "/login";
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <div className="home-container">
      <main className="main-content">
        <div className="content-box">
          <h1 className="title">Patient Registration</h1>

          {step === 1 && (
            <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
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
                  minLength="6"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Sex:</label>
                <select
                  name="sex"
                  required
                  value={formData.sex}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Age:</label>
                <input
                  name="age"
                  type="number"
                  required
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Address:</label>
                <textarea
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Blood Group:</label>
                <select
                  name="blood_group"
                  required
                  value={formData.blood_group}
                  onChange={handleChange}
                >
                  <option value="">--Select--</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>




              <button className="btn btn-primary" type="submit">
                Submit
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerify}>
              <h2>Verify Your Email</h2>
              <p>Enter the code sent to <b>{email}</b></p>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              <button className="btn btn-primary" type="submit">
                Verify
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default Register;
