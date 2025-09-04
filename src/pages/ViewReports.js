import React, { useState } from "react";

const ViewReports = () => {
  const [reportId, setReportId] = useState("");
  const [message, setMessage] = useState("");
  const [report, setReport] = useState(null);

  const handleSearch = () => {
    // Dummy check – simulate a backend lookup
    if (reportId === "12345") {
      setMessage("✅ Report is ready!");
      setReport({
        patientName: "John Doe",
        age: 45,
        test: "Blood Test",
        result: "Normal",
        doctor: "Dr. Smith",
        date: "2025-09-04"
      });
    } else {
      setMessage("⏳ Report not ready yet.");
      setReport(null);
    }
  };

  return (
    <div className="home-container" style={{ padding: "40px", textAlign: "center" }}>
      <main className="main-content">
        <div className="content-box" style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h1 className="title">Hospital Reports</h1>
          <p>Enter your Report ID to check status</p>

          <input
            type="text"
            placeholder="Enter Report ID"
            value={reportId}
            onChange={(e) => setReportId(e.target.value)}
            style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
          />
          <button
            className="btn btn-primary"
            onClick={handleSearch}
            style={{ padding: "10px 20px", marginTop: "10px" }}
          >
            Search
          </button>

          {message && <p style={{ marginTop: "20px" }}>{message}</p>}

          {report && (
            <div
              style={{
                marginTop: "20px",
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                textAlign: "left",
                background: "#f9f9f9"
              }}
            >
              <h3>📄 Report Details</h3>
              <p><b>Patient:</b> {report.patientName} ({report.age} yrs)</p>
              <p><b>Test:</b> {report.test}</p>
              <p><b>Result:</b> {report.result}</p>
              <p><b>Doctor:</b> {report.doctor}</p>
              <p><b>Date:</b> {report.date}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ViewReports;
