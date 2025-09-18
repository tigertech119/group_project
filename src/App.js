// src/App.js
import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';

import Home from './pages/home';
import HomeLoggedIn from './pages/HomeLoggedIn';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardRouter from './components/DashboardRouter';
import Department from './pages/Department';                 // (existing booking page)
import DoctorsByDepartment from './pages/DoctorsByDepartment';// (existing booking page)
import ApplyJobs from './pages/ApplyJobs';
import ViewReports from './pages/ViewReports';
import About from './pages/About';
import Prescriptions from './pages/Prescriptions';
import MyRecords from './pages/MyRecords';
import AccountSettings from './pages/AccountSettings';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';
import Footer from './components/Footer';
import { getMe, logoutUser } from './api/auth';
import './App.css';

/** NEW: informational departments hub (no bg image) */
import DepartmentLayout from './departments/DepartmentLayout';
import DepartmentsInfoIndex from './departments/Index';
import CardiologyPage from './departments/Cardiology';
// If you’ve created the rest, import them too:
import NeurologyPage from './departments/Neurology';
import OrthopedicsPage from './departments/Orthopedics';
import PediatricsPage from './departments/Pediatrics';
import GeneralMedicinePage from './departments/GeneralMedicine';
import OphthalmologyPage from './departments/Ophthalmology';
import DentistryPage from './departments/Dentistry';

/** NEW: doctor article composer */
import ArticleEditor from './departments/ArticleEditor';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check logged-in user on load
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await getMe();
        if (res.user) setUser(res.user);
        else setUser(null);
      } catch {
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  // Logout handler
  async function handleLogout() {
    try {
      await logoutUser();
      setUser(null);
      navigate('/');
    } catch (err) {
      console.error('❌ Logout failed:', err);
    }
  }

  return (
    <div className="App">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="app-main">
        <Routes>
          {/* public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* logged-in views */}
          <Route path="/home-loggedin" element={<HomeLoggedIn />} />
          <Route path="/dashboard" element={<DashboardRouter />} />
          <Route path="/account-settings" element={<AccountSettings />} />

          {/* existing booking flow (unchanged) */}
          <Route path="/departments" element={<Department />} />                 {/* existing list → doctors */} {/* :contentReference[oaicite:3]{index=3} */}
          <Route path="/doctors/:department" element={<DoctorsByDepartment />} />{/* book appointment UI */}     {/* :contentReference[oaicite:4]{index=4} */}

          {/* NEW informational department hub (no bg image, with sidebar & tabs) */}
          <Route path="/departments/info" element={<DepartmentLayout />}>
            <Route index element={<DepartmentsInfoIndex />} />
            <Route path="Cardiology" element={<CardiologyPage />} />
            <Route path="Neurology" element={<NeurologyPage />} />
            <Route path="Orthopedics" element={<OrthopedicsPage />} />
            <Route path="Pediatrics" element={<PediatricsPage />} />
            {/* Space in URL will be encoded automatically */}
            <Route path="General Medicine" element={<GeneralMedicinePage />} />
            <Route path="Ophthalmology" element={<OphthalmologyPage />} />
            <Route path="Dentistry" element={<DentistryPage />} />
          </Route>

          {/* doctor article composer */}
          <Route path="/doctor/articles/new" element={<ArticleEditor />} />

          {/* other pages */}
          <Route path="/apply-jobs" element={<ApplyJobs />} />
          <Route path="/view-reports" element={<ViewReports />} />
          <Route path="/about" element={<About />} />
          <Route path="/prescriptions" element={<Prescriptions />} />
          <Route path="/my-records" element={<MyRecords />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;

/*
// src/App.js
import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';  
import Navbar from './components/Navbar';
import Home from './pages/home';
import HomeLoggedIn from './pages/HomeLoggedIn';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardRouter from './components/DashboardRouter';
import Department from './pages/Department';
import DoctorsByDepartment from './pages/DoctorsByDepartment';
import ApplyJobs from './pages/ApplyJobs';
import ViewReports from './pages/ViewReports';
import About from './pages/About';
import Prescriptions from './pages/Prescriptions';
import MyRecords from './pages/MyRecords';
import AccountSettings from './pages/AccountSettings';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';
import Footer from './components/Footer';
import { getMe, logoutUser } from './api/auth';  
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();  

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await getMe();
        if (res.user) setUser(res.user);
        else setUser(null);
      } catch {
        setUser(null);
      }
    }
    fetchUser();
  }, []);

async function handleLogout() {
  try {
    await logoutUser();
    setUser(null);      
    navigate("/");      
  } catch (err) {
    console.error("❌ Logout failed:", err);
  }
}


  return (
    <div className="App">
      <Navbar user={user} onLogout={handleLogout} />  {}
      <div className="app-main">
        <Routes>
          {}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {}
          <Route path="/home-loggedin" element={<HomeLoggedIn />} />
          <Route path="/dashboard" element={<DashboardRouter />} />
          <Route path="/account-settings" element={<AccountSettings />} />

          {}
          <Route path="/departments" element={<Department />} />
          <Route path="/doctors/:department" element={<DoctorsByDepartment />} />
          <Route path="/apply-jobs" element={<ApplyJobs />} />
          <Route path="/view-reports" element={<ViewReports />} />
          <Route path="/about" element={<About />} />
          <Route path="/prescriptions" element={<Prescriptions />} />
          <Route path="/my-records" element={<MyRecords />} />

          {}
          <Route path="*" element={<div style={{ padding: 24 }}>Not Found</div>} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
*/