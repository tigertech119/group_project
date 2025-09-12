// src/components/DashboardRouter.jsx
import React, { useEffect, useState } from "react";
import { getMe } from "../api/auth";
import PatientDashboard from "../pages/PatientDashboard";
import DoctorDashboard from "../pages/DoctorDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import ApplicantDashboard from "../pages/ApplicantDashboard";
import ITWorkerDashboard from "../pages/ITWorkerDashboard";
import NurseDashboard from "../pages/NurseDashboard";
import WardboyDashboard from "../pages/WardboyDashboard";
import { useNavigate } from "react-router-dom";

const DashboardRouter = () => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ re-enabled
  const navigate = useNavigate(); // ✅ re-enabled

  useEffect(() => {
    async function fetchUser() {
      const res = await getMe();
      console.log("🔄 User data from server:", res);

      if (res.user) {
        setUser(res.user);
        setUserType(res.userType); // ✅ Get userType from backend
      } else {
        console.log("❌ No user, redirecting to login");
        navigate("/login");
      }
      setLoading(false);
    }
    fetchUser();
  }, [navigate]);

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  console.log("🎯 Routing user with type:", userType);

  // ROLE-BASED ROUTING
  if (userType === "patient") return <PatientDashboard user={user} />;
  if (userType === "doctor") return <DoctorDashboard user={user} />;
  if (userType === "applicant") return <ApplicantDashboard user={user} />;
  if (userType === "itworker") return <ITWorkerDashboard user={user} />;
  if (userType === "nurse") return <NurseDashboard user={user} />;
  if (userType === "wardboy") return <WardboyDashboard user={user} />;
  if (userType === "admin") return <AdminDashboard user={user} />;

  console.log("❌ Unknown user type:", userType);
  return <p>Unknown user type: {userType}</p>;
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
*/