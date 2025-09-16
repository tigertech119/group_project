 
import React, { useState } from "react";
 
import "./styles.css";
 


/*
import React, { useEffect, useMemo, useState } from "react";
import API_BASE from "../api/config";
import { useLocation, useNavigate } from "react-router-dom";
const GENDER_OPTIONS = ["Male", "Female", "Other"];

export default function AccountSettings() {
  const navigate = useNavigate();
  const location = useLocation();
  // if we came from a dashboard, we’ll get user via router state
  const userFromState = location.state?.user || null;

  const [user, setUser] = useState(userFromState);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(!userFromState);
  const [saving, setSaving] = useState(false);

  // Helper to prime form from a user object
  const primeForm = (u) => {
    const p = u?.profile || {};
    setForm({
      fullName: p.fullName || "",
      phone: p.phone || "",
      gender: p.gender || "",
      dob: p.dob ? new Date(p.dob).toISOString().slice(0, 10) : "",
      address: p.address || "",
      bloodGroup: p.bloodGroup || p.blood_group || "",
      department: p.department || "",
      specialization: p.specialization || "",
      qualifications: p.qualifications || "",
      experience: typeof p.experience === "number" ? String(p.experience) : "",
    });
  };

  // If no state.user (refresh/direct visit), fetch via cookie session
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        if (userFromState) {
          primeForm(userFromState);
          return;
        }
        const res = await fetch(`${API_BASE}/me`, { credentials: "include" });
        if (!res.ok) throw new Error("Not authenticated");
        const data = await res.json();
        if (cancelled) return;
        setUser(data.user);
        primeForm(data.user);
      } catch (e) {
        console.error(e);
        alert("Please login first.");
        navigate("/");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [navigate, userFromState]);

  const role = useMemo(() => user?.role || "", [user]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const base = { fullName: form.fullName, phone: form.phone, gender: form.gender };
      let profile = { ...base };

      if (role === "patient") {
        profile = { ...base, dob: form.dob || null, address: form.address, bloodGroup: form.bloodGroup || "" };
      }
      if (role === "doctor") {
        profile = {
          ...base,
          department: form.department,
          specialization: form.specialization,
          qualifications: form.qualifications,
          experience: form.experience ? Number(form.experience) : undefined,
        };
      }
      if (role === "nurse") {
        profile = { ...base, qualifications: form.qualifications, experience: form.experience ? Number(form.experience) : undefined };
      }
      if (role === "itworker") {
        profile = { ...base, specialization: form.specialization, qualifications: form.qualifications };
      }

      const res = await fetch(`${API_BASE}/me`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });
      const out = await res.json();
      if (!res.ok) throw new Error(out?.error || "Failed to update profile");

      alert("✅ Profile updated successfully");
      setUser(out.user);
      primeForm(out.user);
    } catch (err) {
      console.error(err);
      alert("❌ " + (err.message || "Error updating profile"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  return (
    <div className="home-container">
      <header className="header">
        <div className="logo">⚙️ Account Settings</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-tertiary" onClick={() => navigate(-1)}>← Back</button>
        </div>
      </header>

      <main className="main-content">
        <div className="content-box">
          <h1 className="title" style={{ marginBottom: 12 }}>Edit Personal Information</h1>

          <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <label className="label">Email (read-only)</label>
              <input className="input" type="text" value={user?.email || ""} disabled readOnly />
            </div>
            <div>
              <label className="label">Role (read-only)</label>
              <input className="input" type="text" value={role} disabled readOnly />
            </div>
          </div>

          <form onSubmit={onSave}>
            <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label className="label">Full Name</label>
                <input className="input" name="fullName" value={form.fullName} onChange={onChange} />
              </div>
              <div>
                <label className="label">Phone</label>
                <input className="input" name="phone" value={form.phone} onChange={onChange} placeholder="+880..." />
              </div>
              <div>
                <label className="label">Gender</label>
                <select className="input" name="gender" value={form.gender} onChange={onChange}>
                  <option value="">Select gender</option>
                  {GENDER_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              {role === "patient" && (
                <>
                  <div>
                    <label className="label">Date of Birth</label>
                    <input className="input" type="date" name="dob" value={form.dob} onChange={onChange} />
                  </div>
                  <div>
                    <label className="label">Address</label>
                    <input className="input" name="address" value={form.address} onChange={onChange} />
                  </div>
                  <div>
                    <label className="label">Blood Group</label>
                    <input className="input" name="bloodGroup" value={form.bloodGroup} onChange={onChange} placeholder="e.g. O+, A-" />
                  </div>
                </>
              )}

              {role === "doctor" && (
                <>
                  <div>
                    <label className="label">Department</label>
                    <input className="input" name="department" value={form.department} onChange={onChange} />
                  </div>
                  <div>
                    <label className="label">Specialization</label>
                    <input className="input" name="specialization" value={form.specialization} onChange={onChange} />
                  </div>
                  <div>
                    <label className="label">Qualifications</label>
                    <input className="input" name="qualifications" value={form.qualifications} onChange={onChange} />
                  </div>
                  <div>
                    <label className="label">Experience (years)</label>
                    <input className="input" type="number" min="0" name="experience" value={form.experience} onChange={onChange} />
                  </div>
                </>
              )}

              {role === "nurse" && (
                <>
                  <div>
                    <label className="label">Qualifications</label>
                    <input className="input" name="qualifications" value={form.qualifications} onChange={onChange} />
                  </div>
                  <div>
                    <label className="label">Experience (years)</label>
                    <input className="input" type="number" min="0" name="experience" value={form.experience} onChange={onChange} />
                  </div>
                </>
              )}

              {role === "itworker" && (
                <>
                  <div>
                    <label className="label">Specialization</label>
                    <input className="input" name="specialization" value={form.specialization} onChange={onChange} />
                  </div>
                  <div>
                    <label className="label">Qualifications</label>
                    <input className="input" name="qualifications" value={form.qualifications} onChange={onChange} />
                  </div>
                </>
              )}
            </div>

            <div className="actions" style={{ marginTop: 16, display: "flex", gap: 8 }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button type="button" className="btn btn-tertiary" onClick={() => navigate(-1)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
   // done 16.09.25 not worked
*/ 


 /*
 
import React, { useEffect, useState } from "react";

export default function AccountSettings() {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setFormData(data.user);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("profile.")) {
      const key = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        profile: { ...prev.profile, [key]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/api/me", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert("❌ " + data.error);
        } else {
          alert("✅ " + data.message);
          setFormData(data.user);
        }
      })
      .catch(() => alert("❌ Failed to update profile"));
  };

  if (loading) return <p>Loading...</p>;
  if (!formData) return <p>Could not load profile.</p>;

  return (
    <div className="content-box">
      <h2>Account Settings</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Email (read-only)
          <input type="text" value={formData.email || ""} disabled />
        </label>
        <label>
          Role (read-only)
          <input type="text" value={formData.role || ""} disabled />
        </label>

        {Object.keys(formData.profile || {}).map((key) => (
          <label key={key}>
            {key.charAt(0).toUpperCase() + key.slice(1)}
            <input
              type="text"
              name={`profile.${key}`}
              value={formData.profile[key] || ""}
              onChange={handleChange}
            />
          </label>
        ))}

        <button type="submit" className="btn">Save Changes</button>
      </form>
    </div>
  );
}

  //------------------------------------------------------------------------
 */






   
export default function AccountSettings() {
  const [settings, setSettings] = useState({
    email: "patient@example.com",
    phone: "+1-555-123-4567",
    notifications: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = () => {
    alert("✅ Settings saved (dummy)!");
    console.log("Saved settings:", settings);
  };

  return (
    <div className="home-container" style={{ padding: "40px" }}>
      <main className="main-content">
        <div className="content-box">
          <h1 className="title">⚙️ Account Settings</h1>
          <p className="subtitle">Update your profile and preferences</p>

          <form style={{ marginTop: "20px", maxWidth: "400px" }}>
            <div style={{ marginBottom: "15px" }}>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  marginTop: "5px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label>Phone:</label>
              <input
                type="text"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  marginTop: "5px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label>
                <input
                  type="checkbox"
                  name="notifications"
                  checked={settings.notifications}
                  onChange={handleChange}
                  style={{ marginRight: "10px" }}
                />
                Enable Email Notifications
              </label>
            </div>

            <button
              type="button"
              onClick={handleSave}
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                background: "#4CAF50",
                color: "white",
                cursor: "pointer",
              }}
            >
              Save Changes
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
   
