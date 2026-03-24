import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Wallet, Activity, ArrowUpRight, Shield, Clock, Download, User, Landmark } from 'lucide-react';
import { motion } from 'framer-motion';

const CitizenDashboard = () => {
  const [citizen, setCitizen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailQuery, setEmailQuery] = useState('');

  const fetchProfile = async (email) => {
    setLoading(true);
    try {
      const res = await api.get(`/citizens/profile/${email}`);
      setCitizen(res.data.data);
    } catch (err) {
      toast.error('Profile not found');
    } finally {
      setLoading(false);
    }
  };

  if (!citizen) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-8">
        <div className="bg-primary-50 w-20 h-20 rounded-full flex items-center justify-center text-primary-600 mx-auto">
          <User size={40} />
        </div>
        <h2 className="text-3xl font-black text-black tracking-tight">Check Your Wallet</h2>
        <p className="text-slate-500">Enter your registered email to view your insurance balance and UMHN.</p>
        <div className="flex gap-2">
          <input 
            type="email" placeholder="your@email.com" className="input-field"
            value={emailQuery} onChange={(e) => setEmailQuery(e.target.value)}
          />
          <button onClick={() => fetchProfile(emailQuery)} className="btn-primary">View</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-black">Welcome, {citizen.fullName.split(' ')[0]}</h1>
          <p className="text-slate-500 font-medium">Your federal health insurance dashboard</p>
        </div>
        <button className="btn-secondary flex items-center gap-2 border-primary-100 text-primary-600">
          <Download size={18} />
          Export History
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Wallet Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-2 bg-gradient-to-br from-primary-700 to-primary-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-primary-500/20"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-primary-100 text-sm font-bold uppercase tracking-widest opacity-80">Emergency Medical Fund</span>
                <p className="text-6xl font-black tracking-tighter">₦{citizen.walletBalance.toLocaleString()}</p>
              </div>
              <Activity size={40} className="text-secondary-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.3)]" />
            </div>
            
            <div className="mt-12 flex justify-between items-end">
              <div className="space-y-1">
                 <span className="text-primary-200 text-xs font-bold uppercase tracking-widest">Unique Medical ID</span>
                 <p className="text-2xl font-mono font-black tracking-wider">{citizen.umhn}</p>
              </div>
              <Shield size={60} className="text-white/20" />
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="space-y-8">
          <div className="card bg-white p-8 space-y-6">
             <h3 className="font-bold text-slate-900 uppercase text-xs tracking-widest flex items-center gap-2">
               <Shield size={16} className="text-primary-600" />
               Quick Actions
             </h3>
             <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                   <span className="font-bold text-slate-700">System Status</span>
                   <span className="text-green-600 font-black text-sm">ACTIVE</span>
                </div>
                
                {/* Repayment Form */}
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-sm font-bold text-slate-500 mb-3 uppercase tracking-tighter">Repay / Top-up Wallet</p>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      placeholder="Amount" 
                      className="input-field py-2 text-sm"
                      id="repayAmount"
                    />
                    <button 
                      onClick={async () => {
                        const amt = document.getElementById('repayAmount').value;
                        if(!amt) return toast.error('Enter amount');
                        try {
                          await api.post('/citizens/repay', { email: citizen.email, amount: amt });
                          toast.success('Repayment Success!');
                          setCitizen({...citizen, walletBalance: citizen.walletBalance + Number(amt)});
                        } catch(e) { toast.error('Failed'); }
                      }}
                      className="btn-primary py-2 px-4 text-sm"
                    >
                      Pay
                    </button>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Usage History */}
      <div className="card bg-white p-8">
         <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
           <Activity className="text-primary-600" />
           Emergency Usage History
         </h3>
         
         <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-4 font-bold text-slate-400 uppercase text-xs tracking-widest">Date</th>
                  <th className="pb-4 font-bold text-slate-400 uppercase text-xs tracking-widest">Hospital</th>
                  <th className="pb-4 font-bold text-slate-400 uppercase text-xs tracking-widest">Amount</th>
                  <th className="pb-4 font-bold text-slate-400 uppercase text-xs tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-slate-300">
                  <td colSpan="4" className="py-20 text-center">No recent emergency claims found.</td>
                </tr>
              </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
