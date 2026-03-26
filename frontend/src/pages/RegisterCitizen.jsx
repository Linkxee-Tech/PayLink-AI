import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/useAuth';
import { Shield, ArrowRight, User, IdCard, Phone, Mail, Calendar, Landmark, Plus, Lock } from 'lucide-react';
import FormField from '../components/FormField';

const RegisterCitizen = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    nin: '',
    bvn: '',
    phone: '',
    dob: '',
    email: '',
    password: '',
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
    if (otp.length !== 6) {
      toast.error('Enter the full 6-digit verification code');
      return;
    }
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
      <div className="max-w-2xl mx-auto py-12">
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
      </div>
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
        <p className="mx-auto max-w-md text-sm leading-6 text-slate-500">
          Enter the code exactly as received. If the email does not arrive, confirm the address above before trying again.
        </p>
        
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <input 
            type="text" 
            maxLength="6"
            inputMode="numeric"
            pattern="\d{6}"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="0 0 0 0 0 0" 
            className="text-center text-4xl font-black tracking-[1rem] py-6 rounded-3xl border-2 border-slate-100 focus:border-primary-500 w-full outline-none transition-all"
          />
          <button type="submit" disabled={loading || otp.length !== 6} className="btn-primary w-full py-4 text-xl disabled:opacity-60">
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
            <FormField
              type="text"
              name="fullName"
              label="FULL NAME (AS ON NIN)"
              icon={User}
              hint="Enter your name exactly as it appears on your NIN record."
              required
              placeholder="John Doe"
              autoComplete="name"
              onChange={handleChange}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                type="text"
                name="nin"
                label="NIN"
                icon={IdCard}
                hint="NIN must contain exactly 11 digits."
                required
                placeholder="11 digits"
                inputMode="numeric"
                maxLength="11"
                minLength="11"
                pattern="[0-9]{11}"
                title="NIN must contain exactly 11 digits"
                onChange={handleChange}
              />
              <FormField
                type="text"
                name="bvn"
                label="BVN"
                icon={IdCard}
                hint="BVN must contain exactly 11 digits."
                required
                placeholder="11 digits"
                inputMode="numeric"
                maxLength="11"
                minLength="11"
                pattern="[0-9]{11}"
                title="BVN must contain exactly 11 digits"
                onChange={handleChange}
              />
            </div>

            <FormField
              type="tel"
              name="phone"
              label="PHONE NUMBER"
              icon={Phone}
              hint="Use an active Nigerian number so hospitals can reach you during emergencies."
              required
              placeholder="080 1234 5678"
              autoComplete="tel"
              inputMode="tel"
              minLength="11"
              onChange={handleChange}
            />

            <FormField
              type="email"
              name="email"
              label="EMAIL ADDRESS"
              icon={Mail}
              hint="We will send your one-time verification code to this email."
              required
              placeholder="john@example.com"
              autoComplete="email"
              onChange={handleChange}
            />

            <FormField
              type="password"
              name="password"
              label="SET ACCOUNT PASSWORD"
              icon={Lock}
              hint="Use at least 8 characters with a password you can remember easily."
              required
              minLength="8"
              placeholder="••••••••"
              autoComplete="new-password"
              onChange={handleChange}
            />

            <FormField
              type="date"
              name="dob"
              label="DATE OF BIRTH"
              icon={Calendar}
              hint="This helps us validate your identity against official records."
              required
              className="text-slate-500"
              onChange={handleChange}
            />

            <FormField
              type="number"
              name="salary"
              label="MONTHLY SALARY (₦)"
              icon={Landmark}
              hint="Used only to estimate your emergency support eligibility tier."
              required
              placeholder="e.g. 100000"
              inputMode="numeric"
              min="0"
              onChange={handleChange}
            />
            
            <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg mt-4 disabled:opacity-50">
              {loading ? 'Processing...' : 'Register & Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterCitizen;
