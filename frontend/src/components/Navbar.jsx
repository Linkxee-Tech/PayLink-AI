import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Plus, LayoutDashboard, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glass sticky top-0 z-50 px-8 py-4 flex items-center justify-between shadow-sm border-b border-slate-100">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="relative">
          <Shield className="text-primary-500 w-10 h-10" />
          <Plus size={16} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-black bg-secondary-500 rounded-full p-0.5" />
        </div>
        <span className="text-2xl font-black text-black tracking-tighter uppercase">
          PayLink<span className="text-secondary-500">-AI</span>
        </span>
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/" className="text-slate-600 hover:text-primary-600 font-medium">Home</Link>
        
        {!user ? (
          <>
            <Link to="/login" className="text-slate-600 hover:text-primary-600 font-bold uppercase text-xs tracking-widest">Login</Link>
            <Link to="/register" className="btn-secondary">Get UMHN</Link>
            <Link to="/hospital-login" className="btn-primary">Hospital Portal</Link>
          </>
        ) : (
          <>
            {user.role === 'hospital' ? (
              <Link to="/hospital-dashboard" className="flex items-center gap-2 text-slate-600 hover:text-primary-600 font-medium">
                <LayoutDashboard size={20} />
                Dashboard
              </Link>
            ) : (
              <Link to="/citizen-dashboard" className="flex items-center gap-2 text-slate-600 hover:text-primary-600 font-medium">
                <User size={20} />
                My Wallet
              </Link>
            )}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium"
            >
              <LogOut size={20} />
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
