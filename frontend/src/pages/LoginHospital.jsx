import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/useAuth';
import toast from 'react-hot-toast';
import { Lock, Mail, Building2, ArrowRight } from 'lucide-react';
import FormField from '../components/FormField';

const LoginHospital = () => {
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
      const res = await api.post('/auth/hospital-login', formData);
      localStorage.setItem('paylink_token', res.data.token);
      login({ ...res.data.hospital, role: 'hospital' });
      toast.success('Login Successful!');
      navigate('/hospital-dashboard');
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
          <div className="bg-primary-50 w-24 h-24 rounded-[2rem] flex items-center justify-center text-primary-600 mx-auto mb-4 border border-primary-100 rotate-6 hover:rotate-0 transition-all duration-500 shadow-lg shadow-primary-500/10">
            <Building2 size={48} />
          </div>
          <h1 className="text-4xl font-black text-black tracking-tighter">Provider Portal</h1>
          <p className="text-slate-500 font-medium tracking-tight">Verify emergency eligibility and manage treatment claims for registered patients</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            type="email"
            name="email"
            label="Official Email"
            labelClassName="text-xs font-black uppercase tracking-widest text-slate-400"
            icon={Mail}
            hint="Use the official facility email submitted during provider onboarding."
            required
            placeholder="admin@hospital.com"
            autoComplete="email"
            onChange={handleChange}
          />

          <FormField
            type="password"
            name="password"
            label="Password"
            labelClassName="text-xs font-black uppercase tracking-widest text-slate-400"
            icon={Lock}
            hint="Use your provider portal password."
            required
            minLength="8"
            placeholder="••••••••"
            autoComplete="current-password"
            onChange={handleChange}
          />

          <button 
            type="submit" disabled={loading}
            className="bg-accent-500 hover:bg-accent-600 text-white w-full py-5 rounded-2xl text-xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-accent-500/20 transition-all active:scale-95 group"
          >
            {loading ? 'Authenticating...' : 'Open Provider Console'}
            {!loading && <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />}
          </button>
        </form>

        <div className="text-center pt-6 border-t border-slate-100">
          <p className="text-slate-500 text-sm">Not registered yet?</p>
          <Link to="/hospital-register" className="text-secondary-600 font-black border-b-2 border-secondary-500/30 hover:text-secondary-700 transition-colors uppercase text-xs tracking-widest mt-1 block">
            Apply for Facility Access
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginHospital;
