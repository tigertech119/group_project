import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function DoctorsByDepartment() {
  const { department } = useParams();
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDoctors() {
      const res = await fetch(`http://localhost:5000/api/doctors/${department}`);
      const data = await res.json();
      setDoctors(data);
    }
    fetchDoctors();
  }, [department]);

  return (
    <div>
      <h1>{department} Doctors</h1>
      <ul>
        {doctors.map((doc) => (
          <li key={doc._id}>
            {doc.profile?.fullName} - {doc.profile?.phone}
            <button onClick={() => navigate(`/book/${doc._id}`, { state: { department } })}>
              Book Appointment
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
