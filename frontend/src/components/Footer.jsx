import { Link } from 'react-router-dom';
import { HeartPulse } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-primary-100 py-12 px-4">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white">
            <HeartPulse size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            PayLink-AI
          </span>
        </div>
        
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-slate-500">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <Link to="/register" className="hover:text-primary-600 transition-colors">Register</Link>
          <Link to="/login" className="hover:text-primary-600 transition-colors">Citizen Sign In</Link>
          <Link to="/hospital-register" className="hover:text-primary-600 transition-colors">Providers</Link>
        </nav>

        <p className="text-sm text-slate-400">
          &copy; {new Date().getFullYear()} PayLink-AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
