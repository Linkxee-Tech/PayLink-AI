import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const LOGIN_ROUTE_BY_ROLE = {
  admin: '/',
  citizen: '/login',
  hospital: '/hospital-login',
};

const DASHBOARD_ROUTE_BY_ROLE = {
  admin: '/admin',
  citizen: '/citizen-dashboard',
  hospital: '/hospital-dashboard',
};

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="flex h-screen items-center justify-center font-bold text-primary-600 animate-pulse">Loading NEMIS...</div>;

  if (!user) {
    return <Navigate to={LOGIN_ROUTE_BY_ROLE[role] || '/'} replace state={{ from: location }} />;
  }

  if (role && user.role !== role) {
    return <Navigate to={DASHBOARD_ROUTE_BY_ROLE[user.role] || '/'} replace />;
  }

  return children;
};

export default ProtectedRoute;
