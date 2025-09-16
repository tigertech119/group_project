

// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/home';
import HomeLoggedIn from './pages/HomeLoggedIn'; // Import the new component
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
import './App.css';
import AccountSettings from './pages/AccountSettings';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home-loggedin" element={<HomeLoggedIn />} /> {/* New route */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<DashboardRouter />} />
          <Route path="/departments" element={<Department />} />
          <Route path="/doctors/:department" element={<DoctorsByDepartment />} />
          <Route path="/apply-jobs" element={<ApplyJobs />} />
          <Route path="/view-reports" element={<ViewReports />} />
          <Route path="/about" element={<About />} />
          <Route path="/prescriptions" element={<Prescriptions />} />
          <Route path="/my-records" element={<MyRecords />} />
          <Route path="/account-settings" element={<AccountSettings />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;

/*

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Register from './pages/Register';
import Login from './pages/Login';
import About from './pages/About';
import Navbar from './components/Navbar';
import DashboardRouter from "./components/DashboardRouter";  // ✅ correct file
import Department from "./pages/Department";
import ApplyJobs from "./pages/ApplyJobs";
import ViewReports from './pages/ViewReports';
import Prescriptions from './pages/Prescriptions';
import AccountSettings from './pages/AccountSettings';
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmail from "./pages/VerifyEmail";
import DoctorsByDepartment from "./pages/DoctorsByDepartment";
import MyRecords from "./pages/MyRecords";


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        { }
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/departments" element={<Department />} />
        <Route path="/apply-jobs" element={<ApplyJobs />} />
        <Route path="/my-records" element={<MyRecords />} />
        <Route path="/view-reports" element={<ViewReports />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/account-settings" element={<AccountSettings />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/doctors/:department" element={<DoctorsByDepartment />} />

        { }
        <Route path="/dashboard" element={<DashboardRouter />} />
      </Routes>
    </Router>
  );
}

export default App;
*/
