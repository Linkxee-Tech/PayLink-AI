import { Link } from 'react-router-dom';
import { Shield, Activity, Wallet, HeartPulse, ChevronRight, CheckCircle, Building2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const steps = [
    { title: "Register", desc: "Link your NIN & BVN to get verified instantly.", icon: Shield },
    { title: "Get UMHN", desc: "Receive your Unique Medical Health Number.", icon: Activity },
    { title: "Funded", desc: "Instant ₦20,000 emergency healthcare credit.", icon: Wallet },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-10 text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full font-bold border border-primary-100"
        >
          <HeartPulse size={18} className="text-secondary-500" />
          <span className="uppercase tracking-widest text-xs">National Emergency Medical Insurance System</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-7xl font-black text-black leading-tight tracking-tighter"
        >
          Emergency Care <br />
          <span className="text-primary-500">Instant Access</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-slate-600 max-w-2xl mx-auto"
        >
          PayLink-AI ensures no Nigerian is denied emergency treatment due to lack of funds.
          Instant verification. Instant credit. Instant care.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-4"
        >
          <Link to="/register" className="btn-primary py-4 px-8 text-lg flex items-center gap-2 shadow-primary-500/20">
            Get Started Now <ChevronRight size={20} />
          </Link>
          <Link to="/hospital-register" className="btn-secondary py-4 px-8 text-lg hover:bg-primary-50">
            Register as Hospital
          </Link>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 + 0.4 }}
            className="card group hover:-translate-y-2"
          >
            <div className="bg-primary-50 w-14 h-14 rounded-2xl flex items-center justify-center text-primary-600 mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-500">
              <step.icon size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{step.title}</h3>
            <p className="text-slate-500 leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Benefits */}
      <section className="bg-black text-white rounded-[3rem] p-16 overflow-hidden relative border-4 border-primary-500/10">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl font-black mb-8 leading-tight">Why <span className="text-primary-400">PayLink-AI</span> <br /> Matters To Nigeria</h2>
            <div className="space-y-6">
              {[
                "Instant payment to hospitals within 30 seconds.",
                "Zero identity fraud with NIN + BVN integration.",
                "Universal access for all verified citizens.",
                "Direct government transparency in medical funding."
              ].map((benefit, i) => (
                <div key={i} className="flex items-start gap-4">
                  <CheckCircle className="text-secondary-500 mt-1 flex-shrink-0" size={24} />
                  <p className="text-slate-300 text-xl font-medium">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative p-10 flex items-center justify-center">
             <div className="relative group scale-110">
                <Shield size={180} className="text-primary-500/20 group-hover:text-primary-500/40 transition-colors duration-1000" />
                <Plus size={60} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-secondary-500 drop-shadow-[0_0_15px_rgba(46,125,50,0.4)]" />
             </div>
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <span className="text-[12rem] font-black tracking-tighter text-white/5 select-none uppercase">NEMIS</span>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
