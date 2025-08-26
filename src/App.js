import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Register from './pages/Register';
import Login from './pages/Login';
import About from './pages/About';
import Navbar from './components/Navbar';
import DashboardRouter from "./components/DashboardRouter";  // ✅ correct file
import Department from "./pages/Department";
import ApplyJobs from "./pages/ApplyJobs";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/departments" element={<Department />} />
        <Route path="/apply-jobs" element={<ApplyJobs />} />

        {/* Protected route → handles doctor/patient/staff */}
        <Route path="/dashboard" element={<DashboardRouter />} />
      </Routes>
    </Router>
  );
}

export default App;
