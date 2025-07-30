import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Register from './pages/Register';
import Login from './pages/Login';
import PatientDashboard from './pages/PatientDashboard';
import About from './pages/About';           // ✅ Added
import Apointment from './pages/Apointment'; // ✅ Added
import Navbar from './components/Navbar';    // ✅ Make sure the file exists

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/Apointment" element={<Apointment />} />
      </Routes>
    </Router>
  );
}

export default App;
