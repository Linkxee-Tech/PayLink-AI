import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Lock, Mail, User, ArrowRight } from 'lucide-react';

const LoginCitizen = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/citizen-login', formData);
      localStorage.setItem('paylink_token', res.data.token);
      login({ ...res.data.citizen, role: 'citizen' });
      toast.success('Access Granted!');
      navigate('/citizen-dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-20">
      <div className="card shadow-2xl p-10 space-y-8 border-primary-50">
        <div className="text-center space-y-3">
          <div className="bg-primary-50 w-24 h-24 rounded-[2rem] flex items-center justify-center text-primary-600 mx-auto mb-4 border border-primary-100 -rotate-3 hover:rotate-0 transition-all duration-500 shadow-lg shadow-primary-500/10">
            <User size={48} />
          </div>
          <h1 className="text-4xl font-black text-black tracking-tighter">Citizen Access</h1>
          <p className="text-slate-500 font-medium tracking-tight">Access your emergency health credit & UMHN</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="email" name="email" required placeholder="your@email.com" 
                className="input-field pl-14 py-3" onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="password" name="password" required placeholder="••••••••" 
                className="input-field pl-14 py-3" onChange={handleChange}
              />
            </div>
          </div>

          <button 
            type="submit" disabled={loading}
            className="bg-primary-600 hover:bg-primary-700 text-white w-full py-5 rounded-2xl text-xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-primary-500/20 transition-all active:scale-95 group"
          >
            {loading ? 'Verifying...' : 'Access My Wallet'}
            {!loading && <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />}
          </button>
        </form>

        <div className="text-center pt-6 border-t border-slate-100">
          <p className="text-slate-500 text-sm">New to PayLink-AI?</p>
          <Link to="/register" className="text-secondary-600 font-black border-b-2 border-secondary-500/30 hover:text-secondary-700 transition-colors uppercase text-xs tracking-widest mt-1 block">
            Apply for Social Funding
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginCitizen;
