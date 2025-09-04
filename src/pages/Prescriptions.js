import React from "react";

export default function Prescriptions() {
  const prescriptions = [
    {
      id: 1,
      medicine: "Amoxicillin 500mg",
      dosage: "1 capsule, twice daily",
      doctor: "Dr. Smith",
      date: "2025-08-10",
    },
    {
      id: 2,
      medicine: "Paracetamol 650mg",
      dosage: "1 tablet, as needed for fever",
      doctor: "Dr. Johnson",
      date: "2025-08-18",
    },
    {
      id: 3,
      medicine: "Vitamin D3 1000 IU",
      dosage: "1 tablet daily after meals",
      doctor: "Dr. Williams",
      date: "2025-08-25",
    },
  ];

  return (
    <div className="home-container" style={{ padding: "40px" }}>
      <main className="main-content">
        <div className="content-box">
          <h1 className="title">💊 Your Prescriptions</h1>
          <p className="subtitle">Here are your recent prescriptions:</p>

          <table
            style={{
              width: "100%",
              marginTop: "20px",
              borderCollapse: "collapse",
              background: "#fff",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr style={{ background: "#2196F3", color: "white", textAlign: "left" }}>
                <th style={{ padding: "12px" }}>Medicine</th>
                <th style={{ padding: "12px" }}>Dosage</th>
                <th style={{ padding: "12px" }}>Prescribed By</th>
                <th style={{ padding: "12px" }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "12px" }}>{item.medicine}</td>
                  <td style={{ padding: "12px" }}>{item.dosage}</td>
                  <td style={{ padding: "12px" }}>{item.doctor}</td>
                  <td style={{ padding: "12px" }}>{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
