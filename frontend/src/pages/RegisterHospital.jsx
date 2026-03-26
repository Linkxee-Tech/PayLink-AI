import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Building2, Mail, Lock, FileText, Landmark, ArrowRight, MapPin, Map } from 'lucide-react';
import { nigeriaData } from '../utils/nigeriaData';
import FormField from '../components/FormField';

const RegisterHospital = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    licenseNumber: '',
    address: '',
    state: '',
    lga: '',
    accountNumber: '',
    accountName: '',
    bankName: ''
  });
  const [lgas, setLgas] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const states = Object.keys(nigeriaData);

  useEffect(() => {
    if (formData.state) {
      setLgas(nigeriaData[formData.state] || []);
      setFormData(prev => ({ ...prev, lga: '' }));
    }
  }, [formData.state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register-hospital', formData);
      toast.success('Registration pending admin approval!');
      navigate('/hospital-login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="card shadow-2xl p-10 space-y-10 border-none">
        <div className="text-center space-y-4">
          <div className="bg-primary-50 w-24 h-24 rounded-[2rem] flex items-center justify-center text-primary-600 mx-auto mb-2 rotate-6 hover:rotate-0 transition-transform duration-500 shadow-lg shadow-primary-500/10 border border-primary-100">
            <Building2 size={48} />
          </div>
          <h1 className="text-5xl font-black text-black tracking-tighter">Join the Provider Network</h1>
          <p className="text-slate-500 max-w-lg mx-auto text-lg">Help us save lives by providing instant emergency care to verified Nigerians across all 774 LGAs.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Identity Info */}
            <div className="space-y-6">
               <h3 className="text-xs font-black text-secondary-600 uppercase tracking-widest flex items-center gap-2">
                 <FileText size={16} /> Basic Information
               </h3>
               
               <FormField
                 type="text"
                 name="name"
                 label="Facility Name"
                 labelClassName="text-black uppercase text-[10px] tracking-wider"
                 icon={Building2}
                 hint="Use the official registered name of the hospital or clinic."
                 required
                 placeholder="Lagos General Hospital"
                 autoComplete="organization"
                 onChange={handleChange}
               />

               <FormField
                 type="text"
                 name="licenseNumber"
                 label="License Number (MDCN)"
                 labelClassName="text-black uppercase text-[10px] tracking-wider"
                 icon={FileText}
                 hint="Enter the provider or facility licence exactly as issued."
                 required
                 placeholder="MDCN/HOSP/..."
                 onChange={handleChange}
               />

               <div className="space-y-2">
                 <label className="text-sm font-bold text-black ml-1 uppercase text-[10px] tracking-wider">Email & Security</label>
                 <div className="grid grid-cols-1 gap-4">
                    <FormField
                      type="email"
                      name="email"
                      icon={Mail}
                      hint="This email will receive onboarding and provider access updates."
                      required
                      placeholder="admin@hospital.com"
                      autoComplete="email"
                      onChange={handleChange}
                    />
                    <FormField
                      type="password"
                      name="password"
                      icon={Lock}
                      hint="Use at least 8 characters for the provider portal password."
                      required
                      minLength="8"
                      placeholder="Create Password"
                      autoComplete="new-password"
                      onChange={handleChange}
                    />
                 </div>
               </div>
            </div>

            {/* Location Info */}
            <div className="space-y-6">
               <h3 className="text-xs font-black text-secondary-600 uppercase tracking-widest flex items-center gap-2">
                 <MapPin size={16} /> Location Identification
               </h3>

               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    as="select"
                    name="state"
                    label="State"
                    labelClassName="text-black uppercase text-[10px] tracking-wider"
                    icon={Map}
                    hint="Select the state where the facility is physically located."
                    required
                    onChange={handleChange}
                    value={formData.state}
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </FormField>
                  <FormField
                    as="select"
                    name="lga"
                    label="LGA"
                    labelClassName="text-black uppercase text-[10px] tracking-wider"
                    icon={MapPin}
                    hint="Choose the local government area for faster emergency routing."
                    required
                    onChange={handleChange}
                    value={formData.lga}
                    disabled={!formData.state}
                  >
                    <option value="">Select LGA</option>
                    {lgas.map((lga) => (
                      <option key={lga} value={lga}>
                        {lga}
                      </option>
                    ))}
                  </FormField>
               </div>

               <FormField
                 as="textarea"
                 name="address"
                 label="Full Address"
                 labelClassName="text-black uppercase text-[10px] tracking-wider"
                 hint="Include street, landmark, and any detail that helps emergency responders find the facility."
                 required
                 placeholder="Street address, building name..."
                 onChange={handleChange}
               />
            </div>
          </div>

          <div className="bg-black text-white p-8 rounded-[2.5rem] space-y-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
               <Landmark size={120} />
            </div>
            <h3 className="font-black text-xl flex items-center gap-2">
              <Landmark size={24} className="text-secondary-400" />
              Settlement Verification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
               <div className="space-y-4">
                 <div className="space-y-2">
                   <label className="text-[10px] uppercase font-bold text-slate-400 ml-1 tracking-widest">Bank Name</label>
                   <input type="text" name="bankName" required placeholder="e.g. United Bank for Africa" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" onChange={handleChange} />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] uppercase font-bold text-slate-400 ml-1 tracking-widest">Account Number</label>
                   <input type="text" name="accountNumber" required placeholder="10 Digits" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" onChange={handleChange} />
                 </div>
               </div>
               <div className="space-y-2 flex flex-col justify-end">
                 <label className="text-[10px] uppercase font-bold text-slate-400 ml-1 tracking-widest">Account Name (Settlement Entity)</label>
                 <input type="text" name="accountName" required placeholder="AS REGISTERED WITH BANK" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-bold" onChange={handleChange} />
               </div>
            </div>
            <p className="text-xs text-slate-500 mt-4 italic font-medium leading-relaxed">
              * Settlement data is verified against MDCN records to ensure direct federal payments to the correct facility entity.
            </p>
          </div>

          <button 
            type="submit" disabled={loading}
            className="bg-accent-500 hover:bg-accent-600 text-white w-full py-5 rounded-2xl text-xl font-bold flex items-center justify-center gap-4 group shadow-lg shadow-accent-500/20 transition-all active:scale-95"
          >
            {loading ? 'Processing Application...' : 'Register Healthcare Facility'}
            {!loading && <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />}
          </button>
        </form>

        <p className="text-center text-slate-500 font-medium">
          Already a partner? <Link to="/hospital-login" className="text-black font-black hover:text-primary-600 transition-colors border-b-2 border-primary-500">Access Portal</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterHospital;
