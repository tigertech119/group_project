import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Register from './pages/Register';
import Login from './pages/Login';
import PatientDashboard from './pages/PatientDashboard';
import About from './pages/About';           // ✅ Added
import Apointment from './pages/Apointment'; // ✅ Added
import Navbar from './components/Navbar';    // ✅ Make sure the file exists
import DashboardRouter from "./components/DashboardRouter";


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
  <Route path="/apointment" element={<Apointment />} />

  {/* Protected route → single entry point for all roles */}
  <Route path="/dashboard" element={<DashboardRouter />} />
</Routes>
    </Router>
  );
}

export default App;
