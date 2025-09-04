import React, { useState } from "react";

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
