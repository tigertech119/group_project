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
        {/* Public */}
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

        {/* Protected route → handles doctor/patient/staff */}
        <Route path="/dashboard" element={<DashboardRouter />} />
      </Routes>
    </Router>
  );
}

export default App;
