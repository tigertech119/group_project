import React, { useEffect, useState } from "react";
import { getMe } from "../api/auth";
import PatientDashboard from "../pages/PatientDashboard";
import DoctorDashboard from "../pages/DoctorDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import StaffDashboard from "../pages/StaffDashboard";
import ApplicantDashboard from "../pages/ApplicantDashboard";
import ITWorkerDashboard from "../pages/ITWorkerDashboard";
import NurseDashboard from "../pages/NurseDashboard";
import WardboyDashboard from "../pages/WardboyDashboard";
import { useNavigate } from "react-router-dom";

const DashboardRouter = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      const res = await getMe();
      console.log("🔄 User data from server:", res);
      
      if (res.user) {
        setUser(res.user);
      } else {
        console.log("❌ No user, redirecting to login");
        navigate("/login");
      }
      setLoading(false);
    }
    fetchUser();
  }, [navigate]); // ✅ Important: Only navigate in dependency array

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  console.log("🎯 Routing user with role:", user.role);

  // ROLE-BASED ROUTING
  if (user.role === "patient") return <PatientDashboard user={user} />;
  if (user.role === "doctor") return <DoctorDashboard user={user} />;
  if (user.role === "staff") return <StaffDashboard user={user} />;
  if (user.role === "applicant") return <ApplicantDashboard user={user} />;
  if (user.role === "admin") return <AdminDashboard user={user} />;
  if (user.role === "it worker") return <ITWorkerDashboard user={user} />;
  if (user.role === "nurse") return <NurseDashboard user={user} />;
  if (user.role === "wardboy") return <WardboyDashboard user={user} />;

  console.log("❌ Unknown role:", user.role);
  return <p>Unknown role: {user.role}</p>;
};

export default DashboardRouter;

/*
import React, { useEffect, useState } from "react";
import { getMe } from "../api/auth";
import PatientDashboard from "../pages/PatientDashboard";
import DoctorDashboard from "../pages/DoctorDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import StaffDashboard from "../pages/StaffDashboard";
import ApplicantDashboard from "../pages/ApplicantDashboard";
import ITWorkerDashboard from "../pages/ITWorkerDashboard"; // NEW
import NurseDashboard from "../pages/NurseDashboard"; // NEW
import WardboyDashboard from "../pages/WardboyDashboard"; // NEW
import { useNavigate } from "react-router-dom";

const DashboardRouter = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      const res = await getMe();
      if (res.user) {
        setUser(res.user);
      } else {
        navigate("/login");
      }
      setLoading(false);
    }
    fetchUser();
  }, [navigate]);

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  // ROLE-BASED DASHBOARD ROUTING
  if (user.role === "patient") return <PatientDashboard user={user} />;
  if (user.role === "doctor") return <DoctorDashboard user={user} />;
  if (user.role === "staff") return <StaffDashboard user={user} />;
  if (user.role === "applicant") return <ApplicantDashboard user={user} />;
  if (user.role === "admin") return <AdminDashboard user={user} />;
  if (user.role === "it worker") return <ITWorkerDashboard user={user} />; // NEW
  if (user.role === "nurse") return <NurseDashboard user={user} />; // NEW
  if (user.role === "wardboy") return <WardboyDashboard user={user} />; // NEW

  return <p>Unknown role: {user.role}</p>;
};

export default DashboardRouter;

*/

/*
import React, { useEffect, useState } from "react";
import { getMe } from "../api/auth";
import PatientDashboard from "../pages/PatientDashboard";
import DoctorDashboard from "../pages/DoctorDashboard";
import AdminDashboard from "../pages/AdminDashboard"; // ✅ ADD THIS IMPORT
import StaffDashboard from "../pages/StaffDashboard";
import ApplicantDashboard from "../pages/ApplicantDashboard";
import { useNavigate } from "react-router-dom";

const DashboardRouter = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      const res = await getMe();
      if (res.user) {
        setUser(res.user);
      } else {
        navigate("/login");
      }
      setLoading(false);
    }
    fetchUser();
  }, [navigate]);

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  // ✅ ROLE-BASED DASHBOARD ROUTING
  if (user.role === "patient") return <PatientDashboard user={user} />;
  if (user.role === "doctor") return <DoctorDashboard user={user} />;
  if (user.role === "staff") return <StaffDashboard user={user} />;
  if (user.role === "applicant") return <ApplicantDashboard user={user} />;
  if (user.role === "admin") return <AdminDashboard user={user} />; // 👈 NEW LINE ADDED

  return <p>Unknown role: {user.role}</p>;
};

export default DashboardRouter;
*/

/*
import React, { useEffect, useState } from "react";
import { getMe } from "../api/auth";
import PatientDashboard from "../pages/PatientDashboard";
import DoctorDashboard from "../pages/DoctorDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import StaffDashboard from "../pages/StaffDashboard";
import ApplicantDashboard from "../pages/ApplicantDashboard"; // ✅ ADD THIS IMPORT
import { useNavigate } from "react-router-dom";

const DashboardRouter = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      const res = await getMe();
      if (res.user) {
        setUser(res.user);
      } else {
        navigate("/login");
      }
      setLoading(false);
    }
    fetchUser();
  }, [navigate]);

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  // ✅ ADD APPLICANT DASHBOARD ROUTING
  if (user.role === "patient") return <PatientDashboard user={user} />;
  if (user.role === "doctor") return <DoctorDashboard user={user} />;
  if (user.role === "staff") return <StaffDashboard user={user} />;
  if (user.role === "applicant") return <ApplicantDashboard user={user} />; // 👈 NEW LINE

  return <p>Unknown role: {user.role}</p>;
};

export default DashboardRouter;

*/

