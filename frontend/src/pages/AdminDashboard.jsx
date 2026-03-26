import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { ShieldAlert, CheckCircle, XCircle, Activity, Building2, CreditCard, ClipboardList } from 'lucide-react';
import EmptyState from '../components/EmptyState';

const AdminDashboard = () => {
  const [pendingHospitals, setPendingHospitals] = useState([]);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ totalClaims: 0, totalPayout: 0, pendingHospitals: 0 });

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
    } catch {
      toast.error('Failed to fetch admin data');
    }
  };

  useEffect(() => {
    const loadAdminData = async () => {
      await fetchAdminData();
    };

    loadAdminData();
  }, []);

  const handleAction = async (id, status) => {
    try {
      await api.put(`/admin/hospitals/${id}`, { status });
      toast.success(`Hospital ${status} successfully`);
      fetchAdminData();
    } catch {
      toast.error('Action failed');
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tighter text-black sm:text-4xl">NEMIS Operations Center</h1>
          <p className="text-sm font-medium text-slate-500">Monitor provider approvals, payouts, and system activity across the emergency care network.</p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-primary-100 bg-primary-50 px-6 py-3 text-xs font-black uppercase tracking-tighter text-primary-600 shadow-sm">
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
      <div className="card bg-white p-6 md:p-8">
        <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-slate-900">
          <Building2 className="text-amber-500" />
          Provider Verification Queue
        </h2>
        
        <div className="space-y-4 md:hidden">
          {pendingHospitals.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="No pending provider reviews"
              description="New facility applications will appear here once they are submitted for approval."
            />
          ) : (
            pendingHospitals.map((hosp) => (
              <div key={hosp._id} className="rounded-[1.75rem] border border-slate-100 bg-slate-50/70 p-5 shadow-sm">
                <div className="space-y-1">
                  <p className="text-lg font-bold text-black">{hosp.name}</p>
                  <p className="text-sm text-slate-500">{hosp.email}</p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location</p>
                    <p className="mt-1 font-semibold text-slate-700">{hosp.state}</p>
                    <p className="text-slate-500">{hosp.lga}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">License</p>
                    <p className="mt-1 break-all font-mono font-semibold text-slate-700">{hosp.licenseNumber}</p>
                  </div>
                </div>
                <div className="mt-5 flex gap-3">
                  <button 
                    onClick={() => handleAction(hosp._id, 'approved')}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-secondary-100 px-4 py-3 font-bold text-secondary-700 transition-all hover:bg-secondary-600 hover:text-white"
                  >
                    <CheckCircle size={18} />
                    Approve
                  </button>
                  <button 
                    onClick={() => handleAction(hosp._id, 'rejected')}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-100 px-4 py-3 font-bold text-red-600 transition-all hover:bg-red-600 hover:text-white"
                  >
                    <XCircle size={18} />
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="hidden overflow-x-auto md:block">
          {pendingHospitals.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="No pending provider reviews"
              description="New facility applications will appear here once they are submitted for approval."
            />
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
      <div className="card border-0 bg-slate-900 p-6 md:p-8">
        <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-white">
          <Activity className="text-primary-400" />
          System-Wide Audit Log
        </h2>
        
        <div className="space-y-4 md:hidden">
          {logs.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="No audit activity yet"
              description="Registration, approval, payment, and claim events will appear here once the network becomes active."
              tone="dark"
            />
          ) : (
            logs.slice(0, 10).map((log) => (
              <div key={log._id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <span className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] font-black uppercase tracking-widest ${
                    log.action === 'claim' ? 'bg-red-500/20 text-red-400' :
                    log.action === 'registration' ? 'bg-green-500/20 text-green-400' :
                    log.action === 'payment' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-primary-500/20 text-primary-400'
                  }`}>
                    {log.action}
                  </span>
                  <ClipboardList size={16} className="text-slate-600" />
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{log.details}</p>
                <p className="mt-3 text-xs font-mono text-slate-500">{new Date(log.createdAt).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>

        <div className="hidden h-[400px] overflow-x-auto overflow-y-auto md:block">
          {logs.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="No audit activity yet"
              description="Registration, approval, payment, and claim events will appear here once the network becomes active."
              tone="dark"
            />
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
