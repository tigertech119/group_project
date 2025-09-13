import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, verifyEmail } from "../api/auth";

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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Step 1: Register user → backend sends code
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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

    try {
      const res = await registerUser(payload);
      if (res.error) {
        alert("❌ " + res.error);
      } else {
        alert("📩 Verification code sent to email");
        setEmail(formData.email);
        setStep(2);
      }
    } catch (err) {
      alert("❌ Registration failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify code - ENHANCED VERSION
  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!code || code.length !== 6) {
      alert("❌ Please enter a valid 6-digit verification code");
      return;
    }
    
    setLoading(true);

    try {
      const result = await verifyEmail({ email, code });
      
      if (result.error) {
        alert("❌ " + result.error);
      } else if (result.success || result.verified) {
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

  // Resend verification code
  const handleResendCode = async () => {
    if (!email) {
      alert("❌ Email not found. Please complete registration again.");
      return;
    }

    setLoading(true);
    try {
      // Re-use registration to resend code
      const payload = {
        email: email,
        password: "temporary", // Required field but won't be used for resend
        profile: { fullName: "User" } // Minimal profile data
      };

      const res = await registerUser(payload);
      if (res.error) {
        alert("❌ " + res.error);
      } else {
        alert("📩 New verification code sent to your email");
      }
    } catch (err) {
      alert("❌ Failed to resend code: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <main className="main-content">
        <div className="content-box">
          <h1 className="title">Patient Registration</h1>

          {step === 1 && (
            <>
              <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
                <div className="form-group">
                  <label>Full Name:</label>
                  <input
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>Sex:</label>
                  <select
                    name="sex"
                    required
                    value={formData.sex}
                    onChange={handleChange}
                    disabled={loading}
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
                    min="1"
                    max="120"
                    value={formData.age}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>Address:</label>
                  <textarea
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>Blood Group:</label>
                  <select
                    name="blood_group"
                    required
                    value={formData.blood_group}
                    onChange={handleChange}
                    disabled={loading}
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

                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <button 
                    className="btn btn-primary" 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Submit"}
                  </button>
                </div>
              </form>

              <button
                className="about-btn"
                onClick={() => navigate("/")}
                style={{
                  background: "linear-gradient(45deg, #6c757d, #5a6268)",
                  marginTop: "20px",
                }}
                disabled={loading}
              >
                Back
              </button>
            </>
          )}

          {step === 2 && (
            <form onSubmit={handleVerify}>
              <h2>Verify Your Email</h2>
              <p>
                Enter the code sent to <b>{email}</b>
              </p>
              
              <div className="form-group">
                <label>Verification Code:</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  maxLength="6"
                  placeholder="Enter 6-digit code"
                  disabled={loading}
                />
              </div>
              
              <button 
                className="btn btn-primary" 
                type="submit"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify"}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleResendCode}
                disabled={loading}
                style={{ marginLeft: "10px" }}
              >
                Resend Code
              </button>

              <button
                className="about-btn"
                onClick={() => setStep(1)}
                style={{
                  background: "linear-gradient(45deg, #6c757d, #5a6268)",
                  marginTop: "20px",
                  marginLeft: "10px",
                }}
                disabled={loading}
              >
                ← Back to Form
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default Register;