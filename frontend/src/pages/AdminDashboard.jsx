import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { ShieldAlert, CheckCircle, XCircle, Activity, Building2, Users, CreditCard } from 'lucide-react';

const AdminDashboard = () => {
  const [pendingHospitals, setPendingHospitals] = useState([]);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ totalClaims: 0, totalPayout: 0, pendingHospitals: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, hospitalsRes, logsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/pending-hospitals'),
        api.get('/admin/logs')
      ]);
      setStats(statsRes.data.data);
      setPendingHospitals(hospitalsRes.data.data);
      setLogs(logsRes.data.data);
    } catch (err) {
      toast.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    try {
      await api.put(`/admin/hospitals/${id}`, { status });
      toast.success(`Hospital ${status} successfully`);
      fetchAdminData();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black text-black tracking-tighter">Admin Command Center</h1>
        <div className="bg-primary-50 text-primary-600 px-6 py-3 rounded-2xl border border-primary-100 font-black flex items-center gap-2 shadow-sm uppercase text-xs tracking-tighter">
          <ShieldAlert size={20} />
          Federal Oversight Access
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card bg-white p-8 space-y-2 border-l-8 border-primary-600">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-black uppercase tracking-widest">Total Valid Claims</span>
            <Activity size={24} className="text-primary-500" />
          </div>
          <p className="text-5xl font-black text-black tracking-tighter">{stats.totalClaims}</p>
        </div>
        <div className="card bg-white p-8 space-y-2 border-l-8 border-secondary-600">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-black uppercase tracking-widest">Emergency Disbursements</span>
            <CreditCard size={24} className="text-secondary-500" />
          </div>
          <p className="text-5xl font-black text-black tracking-tighter">₦{stats.totalPayout.toLocaleString()}</p>
        </div>
        <div className="card bg-white p-8 space-y-2 border-l-4 border-amber-600">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-black uppercase tracking-widest">Pending Verification</span>
            <Building2 size={20} />
          </div>
          <p className="text-4xl font-black text-slate-900">{stats.pendingHospitals}</p>
        </div>
      </div>

      {/* Verification Queue */}
      <div className="card bg-white p-8">
        <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-slate-900">
          <Building2 className="text-amber-500" />
          Provider Verification Queue
        </h2>
        
        <div className="overflow-x-auto">
          {pendingHospitals.length === 0 ? (
            <div className="py-12 text-center text-slate-400 font-medium">No pending verification requests.</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-4 font-bold text-slate-400 uppercase text-xs tracking-widest">Hospital Name</th>
                  <th className="pb-4 font-bold text-slate-400 uppercase text-xs tracking-widest">Location</th>
                  <th className="pb-4 font-bold text-slate-400 uppercase text-xs tracking-widest">License</th>
                  <th className="pb-4 font-bold text-slate-400 uppercase text-xs tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingHospitals.map((hosp) => (
                  <tr key={hosp._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="py-6 pr-4">
                      <p className="font-bold text-black text-lg">{hosp.name}</p>
                      <p className="text-sm text-slate-500">{hosp.email}</p>
                    </td>
                    <td className="py-6 px-4">
                      <p className="font-bold text-black">{hosp.state}</p>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{hosp.lga}</p>
                    </td>
                    <td className="py-6 px-4 font-mono font-bold text-slate-600">{hosp.licenseNumber}</td>
                    <td className="py-6 pl-4">
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleAction(hosp._id, 'approved')}
                          className="p-3 bg-secondary-100 text-secondary-600 rounded-xl hover:bg-secondary-600 hover:text-white transition-all shadow-sm"
                        >
                          <CheckCircle size={24} />
                        </button>
                        <button 
                          onClick={() => handleAction(hosp._id, 'rejected')}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                        >
                          <XCircle size={24} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Audit Logs Section */}
      <div className="card bg-slate-900 border-0 p-8">
        <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-white">
          <Activity className="text-primary-400" />
          System-Wide Audit Log
        </h2>
        
        <div className="overflow-x-auto h-[400px] overflow-y-auto">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-900 z-10">
              <tr className="border-b border-white/10">
                <th className="pb-4 font-bold text-slate-500 uppercase text-xs tracking-widest">Action</th>
                <th className="pb-4 font-bold text-slate-500 uppercase text-xs tracking-widest">Details</th>
                <th className="pb-4 font-bold text-slate-500 uppercase text-xs tracking-widest">Timestamp</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {logs.map((log) => (
                <tr key={log._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 pr-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                      log.action === 'claim' ? 'bg-red-500/20 text-red-400' :
                      log.action === 'registration' ? 'bg-green-500/20 text-green-400' :
                      log.action === 'payment' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-primary-500/20 text-primary-400'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-300">{log.details}</td>
                  <td className="py-4 pl-4 text-slate-500 font-mono text-xs whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
