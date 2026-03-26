import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Shield, Plus, LayoutDashboard, LogOut, User, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  const navLinkClassName = 'font-medium text-slate-600 hover:text-primary-600';
  const dashboardLinkClassName = 'flex items-center gap-2 font-medium text-slate-600 hover:text-primary-600';

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/80">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" onClick={closeMenu} className="flex items-center gap-3 group">
            <div className="relative">
              <Shield className="h-10 w-10 text-primary-500" />
              <Plus size={16} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary-500 p-0.5 text-white" />
            </div>
            <div className="space-y-0.5">
              <span className="block text-2xl font-black tracking-tighter text-slate-950 uppercase">
                PayLink<span className="text-secondary-500">-AI</span>
              </span>
              <span className="block text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                Emergency Care Access
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-primary-100 bg-white/90 text-primary-700 shadow-sm lg:hidden"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className={`${menuOpen ? 'mt-4 flex' : 'hidden'} flex-col gap-3 rounded-[1.75rem] border border-white/80 bg-white/90 p-4 shadow-sm lg:mt-0 lg:flex lg:flex-row lg:items-center lg:justify-end lg:gap-4 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}>
          <Link to="/" onClick={closeMenu} className={navLinkClassName}>Home</Link>

          {!user ? (
            <>
              <Link to="/login" onClick={closeMenu} className="font-bold uppercase tracking-widest text-xs text-slate-600 hover:text-primary-600">Citizen Sign In</Link>
              <Link to="/register" onClick={closeMenu} className="btn-secondary text-center">Get UMHN</Link>
              <Link to="/hospital-login" onClick={closeMenu} className="btn-primary text-center">Provider Portal</Link>
            </>
          ) : (
            <>
              {user.role === 'hospital' ? (
                <Link to="/hospital-dashboard" onClick={closeMenu} className={dashboardLinkClassName}>
                  <LayoutDashboard size={20} />
                  Provider Dashboard
                </Link>
              ) : user.role === 'admin' ? (
                <Link to="/admin" onClick={closeMenu} className={dashboardLinkClassName}>
                  <LayoutDashboard size={20} />
                  Admin
                </Link>
              ) : (
                <Link to="/citizen-dashboard" onClick={closeMenu} className={dashboardLinkClassName}>
                  <User size={20} />
                  Health Dashboard
                </Link>
              )}
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 font-medium text-red-500 hover:text-red-600"
              >
                <LogOut size={20} />
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
