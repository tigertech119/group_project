import React, { useState } from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  // 🔎 doctor search state
  const [showDoctorSearch, setShowDoctorSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  async function doSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setSelected(null);
    try {
      // ✅ fixed fetch call
      const res = await fetch(
        `http://localhost:5000/api/doctors/search?name=${encodeURIComponent(query.trim())}`
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Search failed");
      setResults(Array.isArray(data.doctors) ? data.doctors : []);
    } catch (err) {
      setError(err.message || "Network error");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="home-container">
      <main className="main-content">
        <div className="content-box" style={{ position: "relative" }}>
          <h1 className="title">Streamline your hospital operations</h1>
          <p className="subtitle">Efficiently manage patients, staff, and appointments</p>
          
          <div className="button-group">
            <button className="btn btn-primary" onClick={() => navigate('/login')}>Login</button>
            <button className="btn btn-secondary" onClick={() => navigate('/register')}>Register</button>
            <button className="btn btn-primary" onClick={() => navigate('/departments')}>View Departments</button>
          </div>

          <div className="action-buttons">
            <button className="btn btn-primary" onClick={() => navigate('/view-reports')}>📊 View Reports</button>
            <button className="btn btn-secondary" onClick={() => navigate('/apply-jobs')}>💼 Apply for Jobs</button>
            <button className="btn btn-tertiary" onClick={() => navigate('/about')}>ℹ️ About Hospital</button>

            {/* NEW: Find Doctor button */}
            <button
              className="btn btn-primary"
              onClick={() => setShowDoctorSearch((v) => !v)}
              title="Search doctor by name"
            >
              🔎 Find Doctor
            </button>
          </div>

          {/* NEW: Doctor search panel */}
          {showDoctorSearch && (
            <div className="doctor-search-panel fade-in">
              <div className="doctor-search-left">
                <form onSubmit={doSearch} className="form-group" style={{ marginBottom: 12 }}>
                  <label>Search doctor by name:</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      type="text"
                      placeholder="e.g., Dr Ahmed"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <button className="btn btn-primary" type="submit" disabled={loading}>
                      {loading ? "Searching..." : "Search"}
                    </button>
                  </div>
                </form>

                {error && <p style={{ color: "#c0392b", marginTop: 6 }}>{error}</p>}

                {!loading && results.length === 0 && query && !error && (
                  <p style={{ marginTop: 8 }}>No doctors found for “{query}”.</p>
                )}

                <ul className="doctor-result-list">
                  {results.map((d) => (
                    <li
                      key={d.email}
                      className={`doctor-result-item ${selected?.email === d.email ? "active" : ""}`}
                      onClick={() => setSelected(d)}
                      title="Click to view details"
                    >
                      <div className="doctor-result-name">{d.profile?.fullName || "Unnamed"}</div>
                      <div className="doctor-result-dept">{d.profile?.department || "—"}</div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="doctor-info-area">
                {selected ? (
                  <div className="doctor-info-card fade-in">
                    <h3 style={{ margin: "0 0 8px" }}>
                      {selected.profile?.fullName || "Unnamed"}
                    </h3>
                    <p><b>Department:</b> {selected.profile?.department || "—"}</p>
                    <p><b>Specialization:</b> {selected.profile?.specialization || "—"}</p>
                    <p><b>Email:</b> {selected.email}</p>
                    <p><b>Phone:</b> {selected.profile?.phone || "—"}</p>
                    {typeof selected.profile?.experience === "number" && (
                      <p><b>Experience:</b> {selected.profile.experience} yrs</p>
                    )}
                    <p><b>Available:</b> {selected.isAvailable ? "Yes" : "No"}</p>
                  </div>
                ) : (
                  <div className="doctor-info-empty">
                    <p>Select a doctor from the list to view details.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;


/*
import React from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div className="home-container">
      {   }
      <main className="main-content">
        <div className="content-box">
          <h1 className="title">Streamline your hospital operations</h1>
          <p className="subtitle">Efficiently manage patients, staff, and appointments</p>
          
          <div className="button-group">
            <button className="btn btn-primary" onClick={() => navigate('/login')}>Login</button>
            <button className="btn btn-secondary" onClick={() => navigate('/register')}>
              Register
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/departments')}>
              View Departments
            </button>
          </div>

          <div className="action-buttons">
            <button className="btn btn-primary" onClick={() => navigate('/view-reports')}>
              📊 View Reports
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/apply-jobs')}>
              💼 Apply for Jobs
            </button>
            <button className="btn btn-tertiary" onClick={() => navigate('/about')}>
              ℹ️ About Hospital
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;

*/

// src/pages/home.js