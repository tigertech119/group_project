import React, { useState } from "react";
import "./styles.css";
import { useNavigate } from "react-router-dom";

const DoctorDashboard = ({ user }) => {
  const [patients] = useState(["Patient A", "Patient B", "Patient C"]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [medicine, setMedicine] = useState("");

  const handleSave = () => {
    alert(
      `Saved for ${selectedPatient}: Diagnosis = ${diagnosis}, Medicine = ${medicine}`
    );
    setDiagnosis("");
    setMedicine("");
  };

  return (
    <div className="home-container">
      <header className="header">
        <div className="logo">👨‍⚕️ Doctor Dashboard</div>
        <button className="btn btn-tertiary">Logout</button>
      </header>

      <main className="main-content">
        <div className="content-box">
          <h1 className="title">
            Welcome, Dr. {user?.profile?.fullName || "Doctor"}
          </h1>

          <div className="form-group">
            <label>Select Patient:</label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
            >
              <option value="">Choose</option>
              {patients.map((p, idx) => (
                <option key={idx} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {selectedPatient && (
            <>
              <div className="form-group">
                <label>Diagnosis:</label>
                <input
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Medicines:</label>
                <input
                  value={medicine}
                  onChange={(e) => setMedicine(e.target.value)}
                />
              </div>
              <button className="btn btn-primary" onClick={handleSave}>
                Save
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
