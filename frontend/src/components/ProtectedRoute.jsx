import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex h-screen items-center justify-center font-bold text-primary-600 animate-pulse">Loading NEMIS...</div>;

  if (!user) {
    return <Navigate to="/hospital-login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
