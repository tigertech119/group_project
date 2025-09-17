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
import Footer from './components/Footer';  // ✅ already imported

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        {/* ✅ added wrapper so we can place Footer under all routes */}
        <div className="app-main">
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
        {/* ✅ footer renders on every page */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
