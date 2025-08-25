import React, { useState } from "react";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";

const Register = () => {
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    sex: "",
    age: "",
    address: "",
    password: "",
  });
  const navigate = useNavigate();

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
        gender: formData.sex,
        dob: formData.age ? new Date().setFullYear(new Date().getFullYear() - formData.age) : null,
        address: formData.address,
      },
    };

    const res = await registerUser(payload);
    if (res.user) {
      alert("Registration successful ✅");
      navigate("/login");
    } else {
      alert(res.error || "Registration failed ❌");
    }
  };

  return (
    <div className="home-container">
      <main className="main-content">
        <div className="content-box">
          <h1 className="title">Register</h1>

          {!role && (
            <div className="button-group">
              {["Doctor", "Patient", "Admin", "Staff"].map((r) => (
                <button key={r} className="btn btn-primary" onClick={() => setRole(r)}>
                  {r}
                </button>
              ))}
            </div>
          )}

          {role && (
            <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
              <h2 style={{ color: "#1a73e8" }}>Register as {role}</h2>

              <div className="form-group">
                <label>Full Name:</label>
                <input name="fullName" required value={formData.fullName} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Phone:</label>
                <input name="phone" type="tel" required value={formData.phone} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input name="email" type="email" required value={formData.email} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Password:</label>
                <input name="password" type="password" required value={formData.password} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Sex:</label>
                <select name="sex" required value={formData.sex} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Age:</label>
                <input name="age" type="number" required value={formData.age} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Address:</label>
                <textarea name="address" required value={formData.address} onChange={handleChange}></textarea>
              </div>

              <button className="btn btn-primary" type="submit">Submit</button>
              <button className="btn btn-tertiary" type="button" onClick={() => setRole("")} style={{ marginLeft: "10px" }}>Back</button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default Register;
