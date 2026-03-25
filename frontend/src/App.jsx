import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RegisterCitizen from './pages/RegisterCitizen';
import LoginHospital from './pages/LoginHospital';
import LoginCitizen from './pages/LoginCitizen';
import RegisterHospital from './pages/RegisterHospital';
import HospitalDashboard from './pages/HospitalDashboard';
import CitizenDashboard from './pages/CitizenDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<RegisterCitizen />} />
            <Route path="/hospital-login" element={<LoginHospital />} />
            <Route path="/login" element={<LoginCitizen />} />
            <Route path="/hospital-register" element={<RegisterHospital />} />
            
            <Route path="/hospital-dashboard" element={
              <ProtectedRoute role="hospital">
                <HospitalDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/citizen-dashboard" element={
              <ProtectedRoute role="citizen">
                <CitizenDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
