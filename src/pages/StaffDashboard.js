import React from "react";
import "./styles.css";

const StaffDashboard = ({ user }) => {
  const schedule = [
    { day: "Monday", shift: "9 AM - 5 PM" },
    { day: "Tuesday", shift: "1 PM - 9 PM" },
    { day: "Wednesday", shift: "OFF" },
  ];

  return (
    <div className="home-container">
      <header className="header">
        <div className="logo">👨‍🔧 Staff Dashboard</div>
        <button className="btn btn-tertiary">Logout</button>
      </header>
      <main className="main-content">
        <div className="content-box">
          <h1 className="title">Welcome, {user.profile?.fullName}</h1>
          <ul>
            {schedule.map((s, idx) => (
              <li key={idx}><b>{s.day}:</b> {s.shift}</li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;
