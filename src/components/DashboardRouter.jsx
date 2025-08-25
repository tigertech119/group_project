import React, { useEffect, useState } from "react";
import { getMe } from "../api/auth"; // fetches current logged in user
import PatientDashboard from "../pages/PatientDashboard";
import DoctorDashboard from "../pages/DoctorDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import StaffDashboard from "../pages/StaffDashboard";

export default function DashboardRouter() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await getMe();
      setUser(res.user || null);
      setLoading(false);
    })();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (!user) return <p>❌ Not logged in. Please log in again.</p>;

  // Role-based dashboards
  if (user.role === "patient") return <PatientDashboard user={user} />;
  if (user.role === "doctor") return <DoctorDashboard user={user} />;
  if (user.role === "admin") return <AdminDashboard user={user} />;
  if (user.role === "staff") return <StaffDashboard user={user} />;

  return <p>⚠️ Unknown role: {user.role}</p>;
}
