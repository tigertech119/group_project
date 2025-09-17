// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import Footer from './components/Footer';             // ✅ added
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        {/* ✅ wrap routes so we can place footer under all pages */}
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

            {/* other pages */}
            <Route path="/departments" element={<Department />} />
            <Route path="/doctors/:department" element={<DoctorsByDepartment />} />
            <Route path="/apply-jobs" element={<ApplyJobs />} />
            <Route path="/view-reports" element={<ViewReports />} />
            <Route path="/about" element={<About />} />
            <Route path="/prescriptions" element={<Prescriptions />} />
            <Route path="/my-records" element={<MyRecords />} />

            {/* 404 fallback */}
            <Route path="*" element={<div style={{ padding: 24 }}>Not Found</div>} />
          </Routes>
        </div>
        <Footer />                                      {/* ✅ added */}
      </div>
    </Router>
  );
}

export default App;

