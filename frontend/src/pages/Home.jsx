import { Link } from 'react-router-dom';
import { Shield, Activity, HeartPulse, ChevronRight, CheckCircle, Plus } from 'lucide-react';
import Footer from '../components/Footer';

const Home = () => {
  const steps = [
    { title: "Identity Check", desc: "Link your NIN and BVN to confirm eligibility for emergency support.", icon: Shield },
    { title: "UMHN Issued", desc: "Receive a verified Unique Medical Health Number for care access.", icon: Activity },
    { title: "Emergency Cover", desc: "Unlock ₦20,000 in emergency treatment support after verification.", icon: HeartPulse },
  ];

  return (
    <div className="space-y-16 pb-20 md:space-y-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-primary-100 bg-[radial-gradient(circle_at_top,_rgba(216,236,247,0.95),_rgba(255,255,255,0.98)_48%,_rgba(237,248,243,0.92)_100%)] px-6 py-12 text-center sm:px-10 lg:px-14">
        <div className="absolute -top-20 right-0 h-56 w-56 rounded-full bg-primary-200/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-secondary-100/70 blur-3xl" />

        <div className="relative space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white/80 px-4 py-2 font-bold text-primary-700 shadow-sm">
            <HeartPulse size={18} className="text-secondary-500" />
            <span className="text-xs uppercase tracking-widest">National Emergency Medical Insurance System</span>
          </div>

          <h1 className="text-4xl font-black leading-tight tracking-tighter text-slate-950 sm:text-6xl lg:text-7xl">
            Emergency Care,
            <br />
            <span className="text-primary-600">Without Delay</span>
          </h1>

          <p className="mx-auto max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
            PayLink-AI helps hospitals confirm eligibility quickly, issue a verified UMHN, and unlock
            emergency treatment support so patients can be stabilised first and sorted financially without delay.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/register" className="btn-primary flex w-full items-center justify-center gap-2 px-8 py-4 text-lg sm:w-auto">
              Register for UMHN <ChevronRight size={20} />
            </Link>
            <Link to="/login" className="btn-secondary w-full px-8 py-4 text-lg sm:w-auto">
              Citizen Sign In
            </Link>
            <Link to="/hospital-register" className="btn-secondary w-full px-8 py-4 text-lg sm:w-auto">
              For Healthcare Providers
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-3">
            {[
              { value: '30 sec', label: 'verification-to-decision target' },
              { value: 'UMHN', label: 'portable verified health identity' },
              { value: '₦20,000', label: 'emergency support for eligible citizens' },
            ].map((item) => (
              <div key={item.label} className="rounded-[1.75rem] border border-white/80 bg-white/75 px-5 py-5 text-left shadow-sm">
                <p className="text-2xl font-black tracking-tight text-slate-950">{item.value}</p>
                <p className="mt-1 text-sm font-medium text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {steps.map((step, i) => (
          <div key={i} className="card group border-primary-50 bg-white/90 hover:-translate-y-2">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 transition-colors duration-500 group-hover:bg-primary-600 group-hover:text-white">
              <step.icon size={28} />
            </div>
            <h3 className="mb-2 text-xl font-bold uppercase tracking-tight transition-colors group-hover:text-primary-600">{step.title}</h3>
            <p className="text-slate-500 leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </section>

      {/* Benefits */}
      <section className="relative overflow-hidden rounded-[3rem] border border-primary-200/60 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 p-8 text-white sm:p-12 lg:p-16">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-primary-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-secondary-400/10 blur-3xl" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="mb-8 text-4xl font-black leading-tight sm:text-5xl">
              Why <span className="text-primary-300">PayLink-AI</span>
              <br />
              matters in emergency medicine
            </h2>
            <div className="space-y-6">
              {[
                "Helps clinical teams verify care eligibility without delaying treatment.",
                "Reduces identity fraud through NIN and BVN-backed enrolment.",
                "Creates a portable national health identity for verified citizens.",
                "Improves accountability for emergency medical disbursements."
              ].map((benefit, i) => (
                <div key={i} className="flex items-start gap-4">
                  <CheckCircle className="mt-1 shrink-0 text-secondary-400" size={24} />
                  <p className="text-lg font-medium text-primary-100 sm:text-xl">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative p-10 flex items-center justify-center">
             <div className="relative group scale-110">
                <Shield size={180} className="text-primary-300/20 transition-colors duration-1000 group-hover:text-primary-200/30" />
                <Plus size={60} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-secondary-400 drop-shadow-[0_0_15px_rgba(87,178,128,0.35)]" />
             </div>
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <span className="text-[12rem] font-black tracking-tighter text-white/5 select-none uppercase">NEMIS</span>
             </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
