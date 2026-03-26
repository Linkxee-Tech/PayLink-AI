import { useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/useAuth';
import toast from 'react-hot-toast';
import { Activity, Shield, Download, CreditCard, HeartPulse, FileClock } from 'lucide-react';
import EmptyState from '../components/EmptyState';

const CitizenDashboard = () => {
  const { user } = useAuth();
  const [citizen, setCitizen] = useState(user);
  const [contributionAmount, setContributionAmount] = useState('');
  const [submittingContribution, setSubmittingContribution] = useState(false);

  if (!citizen) return null;

  const handleContribution = async () => {
    if (!contributionAmount) {
      toast.error('Enter amount');
      return;
    }

    setSubmittingContribution(true);
    try {
      await api.post('/citizens/repay', { email: citizen.email, amount: contributionAmount });
      toast.success('Contribution received');
      setCitizen({ ...citizen, walletBalance: citizen.walletBalance + Number(contributionAmount) });
      setContributionAmount('');
    } catch {
      toast.error('Failed to add contribution');
    } finally {
      setSubmittingContribution(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-black sm:text-4xl">Welcome, {citizen.fullName.split(' ')[0]}</h1>
          <p className="text-slate-500 font-medium">Your emergency care support dashboard</p>
        </div>
        <button className="btn-secondary flex items-center justify-center gap-2 border-primary-100 text-primary-600 md:w-auto">
          <Download size={18} />
          Export History
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Support Card */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary-700 to-primary-900 p-7 text-white shadow-2xl shadow-primary-500/20 md:col-span-2 md:p-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <span className="text-primary-100 text-sm font-bold uppercase tracking-widest opacity-80">Emergency Care Support</span>
                <p className="text-4xl font-black tracking-tighter sm:text-5xl lg:text-6xl">₦{citizen.walletBalance.toLocaleString()}</p>
              </div>
              <Activity size={40} className="text-secondary-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.3)]" />
            </div>
            
            <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-1">
                 <span className="text-primary-200 text-xs font-bold uppercase tracking-widest">Unique Medical ID</span>
                 <p className="break-all text-xl font-mono font-black tracking-wider sm:text-2xl">{citizen.umhn}</p>
              </div>
              <Shield size={60} className="text-white/20" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-8">
          <div className="card bg-white p-6 space-y-6 md:p-8">
             <h3 className="font-bold text-slate-900 uppercase text-xs tracking-widest flex items-center gap-2">
               <Shield size={16} className="text-primary-600" />
               Quick Actions
             </h3>
             <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                   <span className="font-bold text-slate-700">System Status</span>
                   <span className="text-green-600 font-black text-sm">ACTIVE</span>
                </div>

                <div className="rounded-2xl border border-primary-100 bg-primary-50/70 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-white p-3 text-primary-600 shadow-sm">
                      <HeartPulse size={18} />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-slate-900">Emergency support is ready</p>
                      <p className="text-sm leading-6 text-slate-600">
                        Present your UMHN at a registered facility for verification during emergency treatment.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Repayment Form */}
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-sm font-bold text-slate-500 mb-3 uppercase tracking-tighter">Add Personal Contribution</p>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input 
                      type="number" 
                      placeholder="Amount" 
                      className="input-field py-3 text-sm"
                      value={contributionAmount}
                      min="0"
                      onChange={(e) => setContributionAmount(e.target.value)}
                    />
                    <button 
                      onClick={handleContribution}
                      disabled={submittingContribution}
                      className="btn-primary flex items-center justify-center gap-2 px-4 py-3 text-sm sm:w-auto"
                    >
                      <CreditCard size={16} />
                      {submittingContribution ? 'Saving...' : 'Add Funds'}
                    </button>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Usage History */}
      <div className="card bg-white p-6 md:p-8">
         <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
           <Activity className="text-primary-600" />
           Emergency Usage History
         </h3>
         
         <div className="overflow-x-auto">
            <table className="min-w-[640px] w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-4 font-bold text-slate-400 uppercase text-xs tracking-widest">Date</th>
                  <th className="pb-4 font-bold text-slate-400 uppercase text-xs tracking-widest">Hospital</th>
                  <th className="pb-4 font-bold text-slate-400 uppercase text-xs tracking-widest">Amount</th>
                  <th className="pb-4 font-bold text-slate-400 uppercase text-xs tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="4" className="py-10">
                    <EmptyState
                      icon={FileClock}
                      title="No emergency claims yet"
                      description="When a registered provider verifies your UMHN and submits a treatment claim, your care history will appear here."
                    />
                  </td>
                </tr>
              </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
