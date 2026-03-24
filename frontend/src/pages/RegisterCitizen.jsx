import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Shield, ArrowRight, User, IdCard, Phone, Mail, Calendar, Landmark } from 'lucide-react';
import { motion } from 'framer-motion';

const RegisterCitizen = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    nin: '',
    bvn: '',
    phone: '',
    dob: '',
    email: '',
    salary: ''
  });
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [successData, setSuccessData] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register-citizen', formData);
      setShowOtp(true);
      toast.success('OTP sent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-citizen-otp', { email: formData.email, otp });
      const citizenData = res.data.data;
      setSuccessData(citizenData);
      login({ ...citizenData, role: 'citizen' });
      toast.success('Identity Verified!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto py-12"
      >
        <div className="card text-center space-y-8 p-12 bg-gradient-to-b from-white to-primary-50">
          <div className="flex items-center justify-center mx-auto relative group scale-110">
             <Shield size={80} className="text-primary-500 opacity-20 group-hover:opacity-40 transition-opacity" />
             <Plus size={30} className="absolute text-secondary-500 drop-shadow-[0_0_10px_rgba(46,125,50,0.3)]" />
          </div>
          <h2 className="text-4xl font-black text-black">Welcome to PayLink-AI, {successData.fullName}!</h2>
          <p className="text-xl text-slate-600">Your Unique Medical Health Number (UMHN) has been generated.</p>
          
          <div className="bg-white border-2 border-dashed border-primary-100 p-8 rounded-3xl shadow-sm">
            <span className="text-slate-400 font-mono mb-2 block uppercase tracking-widest text-[10px] font-black">Your UMHN</span>
            <span className="text-4xl font-mono font-black text-primary-600 selection:bg-primary-50">{successData.umhn}</span>
          </div>

          <div className="flex items-center justify-center gap-8 py-6 border-y border-slate-100">
             <div className="text-center">
                <span className="block text-sm text-slate-500 uppercase font-bold mb-1">Insurance Credit</span>
                <span className="text-2xl font-black text-primary-900">₦{successData.walletBalance?.toLocaleString()}</span>
             </div>
             <div className="h-10 w-[1px] bg-slate-200"></div>
             <div className="text-center">
                <span className="block text-sm text-slate-500 uppercase font-bold mb-1">Status</span>
                <span className="text-lg font-bold text-secondary-600 bg-secondary-50 px-3 py-1 rounded-full border border-secondary-100">Active</span>
             </div>
          </div>

          <button onClick={() => navigate('/')} className="btn-primary w-full py-4 text-xl">
            Go to Home
          </button>
        </div>
      </motion.div>
    );
  }

  if (showOtp) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-8">
        <div className="bg-primary-50 w-20 h-20 rounded-full flex items-center justify-center text-primary-600 mx-auto animate-bounce">
          <Shield size={40} />
        </div>
        <h2 className="text-3xl font-black text-slate-900">Verify Your Identity</h2>
        <p className="text-slate-500">We sent a 6-digit verification code to <span className="font-bold text-slate-900">{formData.email}</span></p>
        
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <input 
            type="text" 
            maxLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="0 0 0 0 0 0" 
            className="text-center text-4xl font-black tracking-[1rem] py-6 rounded-3xl border-2 border-slate-100 focus:border-primary-500 w-full outline-none transition-all"
          />
          <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-xl">
            {loading ? 'Verifying...' : 'Complete Registration'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 py-10">
      <div className="flex-1 space-y-8">
        <h1 className="text-5xl font-black text-black leading-tight tracking-tighter">
          Join the <span className="text-primary-600 underline decoration-secondary-500/30">Health Safety Net</span> of Nigeria.
        </h1>
        <p className="text-lg text-slate-600">
          By linking your NIN and BVN, you help us ensure that emergency funds reach real citizens instantly. One person, one health fund.
        </p>
        
        <div className="space-y-4">
          {[
            "Instant Identity Verification",
            "Automatic Salary-Based Credit",
            "Universal Portability across approved hospitals",
            "Secure and Private Data Handling"
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-slate-600">
              <div className="w-6 h-6 rounded-full bg-secondary-50 flex items-center justify-center text-secondary-600 border border-secondary-100">
                <ArrowRight size={14} />
              </div>
              <span className="font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1">
        <div className="card shadow-2xl p-8 border-primary-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">FULL NAME (AS ON NIN)</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" name="fullName" required placeholder="John Doe" className="input-field pl-14 py-3" onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">NIN</label>
                <div className="relative">
                  <IdCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" name="nin" required placeholder="11 digits" className="input-field pl-14 py-3" onChange={handleChange} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">BVN</label>
                <div className="relative">
                  <IdCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" name="bvn" required placeholder="11 digits" className="input-field pl-14 py-3" onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">PHONE NUMBER</label>
              <div className="relative">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="tel" name="phone" required placeholder="080 1234 5678" className="input-field pl-14 py-3" onChange={handleChange} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">EMAIL ADDRESS</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" name="email" required placeholder="john@example.com" className="input-field pl-14 py-3" onChange={handleChange} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">DATE OF BIRTH</label>
              <div className="relative">
                <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="date" name="dob" required className="input-field pl-14 py-3 text-slate-500" onChange={handleChange} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">MONTHLY SALARY (₦)</label>
              <div className="relative">
                <Landmark size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="number" name="salary" required placeholder="e.g. 100000" className="input-field pl-14 py-3" onChange={handleChange} />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg mt-4 disabled:opacity-50">
              {loading ? 'Processing...' : 'Register & Claim Fund'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterCitizen;
