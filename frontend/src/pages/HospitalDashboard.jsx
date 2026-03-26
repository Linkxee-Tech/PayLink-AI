import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Search, User, Activity, CheckCircle, Clock, MapPin, CircleDollarSign, ClipboardCheck } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import EmptyState from '../components/EmptyState';

const HospitalDashboard = () => {
  const { user } = useAuth();
  const [umhn, setUmhn] = useState('');
  const [patient, setPatient] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [claimForm, setClaimForm] = useState({
    amount: '',
    diagnosis: '',
    treatmentDetails: ''
  });

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const res = await api.get('/claims/hospital');
      setClaims(res.data.data);
    } catch {
      toast.error('Failed to fetch claims');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.get(`/citizens/verify/${umhn}`);
      setPatient(res.data.data);
      toast.success('Patient Verified');
    } catch {
      toast.error('Patient not found');
      setPatient(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/claims/submit', {
        citizenId: patient._id,
        ...claimForm
      });
      toast.success('Claim Approved & Paid!');
      setPatient(null);
      setUmhn('');
      setClaimForm({ amount: '', diagnosis: '', treatmentDetails: '' });
      fetchClaims();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Claim failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-black sm:text-4xl">Provider Care Console</h1>
          <div className="flex w-fit items-center gap-2 rounded-full border border-slate-100 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500 shadow-sm">
             <MapPin size={12} className="text-primary-500" />
             {user?.state || 'Registered State'} <span className="text-slate-300 mx-1">•</span> {user?.lga || 'Registered LGA'}
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-2 shadow-sm">
             <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
             <span className="text-sm font-bold text-slate-600 uppercase tracking-tighter">System Online</span>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-2 shadow-sm">
             <CircleDollarSign size={16} className="text-secondary-600" />
             <span className="text-sm font-bold text-slate-600 uppercase tracking-tighter">{claims.length} Claims Logged</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Verification Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="card border-primary-100 bg-white p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-black">
              <Search className="text-primary-500" />
              Patient Verification
            </h2>
            <form onSubmit={handleSearch} className="flex flex-col gap-4 md:flex-row">
              <input 
                type="text" 
                placeholder="Enter UMHN (e.g. NG-MED-12345678)" 
                className="input-field py-4 text-lg font-mono"
                value={umhn}
                onChange={(e) => setUmhn(e.target.value)}
                required
              />
              <button disabled={loading} className="btn-primary px-8 whitespace-nowrap md:w-auto">
                {loading ? 'Searching...' : 'Verify Patient'}
              </button>
            </form>
          </div>

          {patient && (
              <div className="card space-y-8 border-green-100 bg-green-50/30 p-6 md:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex gap-4 md:gap-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-600">
                      <User size={32} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">{patient.fullName}</h3>
                      <p className="break-all font-mono font-bold text-green-600">{patient.umhn}</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-green-100 bg-white/80 px-5 py-4 text-left lg:text-right">
                    <p className="text-sm font-bold text-slate-400 uppercase">Available Insurance</p>
                    <p className="text-3xl font-black text-slate-900 outline-green-500">₦{patient.walletBalance.toLocaleString()}</p>
                  </div>
                </div>

                <form onSubmit={handleClaimSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-green-100">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600">EMERGENCY DIAGNOSIS</label>
                    <input 
                      type="text" required placeholder="e.g. Severe Trauma, Acute Malaria"
                      className="input-field bg-white focus:ring-secondary-500/10"
                      value={claimForm.diagnosis}
                      onChange={(e) => setClaimForm({...claimForm, diagnosis: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600">TREATMENT AMOUNT (₦)</label>
                    <input 
                      type="number" required placeholder="Max 20,000"
                      className="input-field bg-white"
                      value={claimForm.amount}
                      onChange={(e) => setClaimForm({...claimForm, amount: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-bold text-slate-600">TREATMENT DETAILS</label>
                    <textarea 
                      rows="3" placeholder="Briefly describe the emergency procedures..."
                      className="input-field bg-white resize-none"
                      value={claimForm.treatmentDetails}
                      onChange={(e) => setClaimForm({...claimForm, treatmentDetails: e.target.value})}
                    ></textarea>
                  </div>
                  <button 
                    type="submit" disabled={submitting}
                    className="md:col-span-2 py-4 text-xl font-bold bg-secondary-600 hover:bg-secondary-700 text-white rounded-2xl shadow-lg shadow-secondary-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
                  >
                    {submitting ? 'Processing Payment...' : 'Submit Claim & Receive Funds'}
                    {!submitting && <CheckCircle className="group-hover:scale-125 transition-transform" size={24} />}
                  </button>
                </form>
              </div>
            )}
        </div>

        {/* Quick Stats */}
        <div className="space-y-8">
           <div className="card relative overflow-hidden bg-primary-900 p-6 text-white group md:p-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary-500/20 transition-colors"></div>
              <h3 className="text-primary-300 font-bold uppercase text-[10px] tracking-widest mb-4">Total Approved Emergency Claims</h3>
              <p className="text-5xl font-black mb-2 tracking-tighter">₦{claims.reduce((acc, c) => acc + c.amount, 0).toLocaleString()}</p>
              <p className="text-primary-400/60 text-xs font-medium">Verified emergency care disbursements</p>
           </div>
           
           <div className="card p-6 md:p-8">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Clock size={20} className="text-primary-600" />
                Recent Settlements
              </h3>
              <div className="space-y-4">
                {claims.length === 0 ? (
                  <EmptyState
                    icon={ClipboardCheck}
                    title="No settlements recorded yet"
                    description="Verified claims will appear here after a patient is approved and the emergency treatment request is processed."
                  />
                ) : (
                  claims.slice(0, 5).map((claim, i) => (
                    <div key={i} className="flex items-center justify-between gap-4 border-b border-slate-50 py-3 last:border-0">
                      <div>
                        <p className="font-bold text-slate-800">{claim.citizen?.fullName}</p>
                        <p className="text-xs text-slate-500">{new Date(claim.createdAt).toLocaleDateString()}</p>
                      </div>
                      <p className="font-black text-primary-600">₦{claim.amount.toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;
