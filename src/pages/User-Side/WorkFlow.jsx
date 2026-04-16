import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCheck, FileSearch, PlaneTakeoff, 
  ShieldCheck, Globe, Zap, Ticket, Landmark 
} from 'lucide-react';

const workflowData = {
  Citizenship: [
    { 
      id: '01', 
      title: 'Eligibility Assessment', 
      desc: 'Comprehensive evaluation of your profile for suitable citizenship programs.', 
      icon: <ShieldCheck size={28} />, 
      color: 'from-[#D4AF37] to-[#B8860B]' 
    },
    { 
      id: '02', 
      title: 'Document Preparation', 
      desc: 'Professional guidance in preparing and verifying all required documents.', 
      icon: <FileSearch size={28} />, 
      color: 'from-[#D4AF37] to-[#B8860B]' 
    },
    { 
      id: '03', 
      title: 'Application Submission', 
      desc: 'Accurate filing and submission to the relevant authorities.', 
      icon: <Landmark size={28} />, 
      color: 'from-[#D4AF37] to-[#B8860B]' 
    },
    { 
      id: '04', 
      title: 'Approval & Citizenship Grant', 
      desc: 'Final approval process and issuance of citizenship certification.', 
      icon: <Globe size={28} />, 
      color: 'from-[#D4AF37] to-[#B8860B]' 
    },
  ],

  Visa: [
    { 
      id: '01', 
      title: 'Eligibility Assessment', 
      desc: 'Thorough evaluation of your profile to determine visa suitability.', 
      icon: <ShieldCheck size={28} />, 
      color: 'from-[#D4AF37] to-[#B8860B]' 
    },
    { 
      id: '02', 
      title: 'Document Preparation', 
      desc: 'Accurate preparation and verification of all required documents.', 
      icon: <FileSearch size={28} />, 
      color: 'from-[#D4AF37] to-[#B8860B]' 
    },
    { 
      id: '03', 
      title: 'Application Submission', 
      desc: 'Submission of your application through embassy or authorized centers.', 
      icon: <Landmark size={28} />, 
      color: 'from-[#D4AF37] to-[#B8860B]' 
    },
    { 
      id: '04', 
      title: 'Visa Approval', 
      desc: 'Visa approval, stamping, and final guidance before travel.', 
      icon: <Zap size={28} />, 
      color: 'from-[#D4AF37] to-[#B8860B]' 
    },
  ],

  Travel: [
    { 
      id: '01', 
      title: 'Travel Planning', 
      desc: 'Personalized planning tailored to your destination and preferences.', 
      icon: <Globe size={28} />, 
      color: 'from-[#D4AF37] to-[#B8860B]' 
    },
    { 
      id: '02', 
      title: 'Booking & Reservations', 
      desc: 'Secure booking of flights, hotels, and travel arrangements.', 
      icon: <Ticket size={28} />, 
      color: 'from-[#D4AF37] to-[#B8860B]' 
    },
    { 
      id: '03', 
      title: 'Travel Assistance', 
      desc: 'Ongoing support including itinerary guidance and local assistance.', 
      icon: <UserCheck size={28} />, 
      color: 'from-[#D4AF37] to-[#B8860B]' 
    },
    { 
      id: '04', 
      title: 'Departure & Experience', 
      desc: 'Smooth departure and a seamless travel experience.', 
      icon: <PlaneTakeoff size={28} />, 
      color: 'from-[#D4AF37] to-[#B8860B]' 
    },
  ]
};

const WorkFlow = () => {
  const [activeTab, setActiveTab] = useState('Citizenship');

  return (
    <section className="py-24 bg-white dark:bg-[#060606] transition-colors duration-500 relative overflow-hidden font-['Times_New_Roman',_serif]">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        <div className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[#D4AF37] font-black uppercase tracking-[0.4em] text-xs mb-4 block"
          >
            Execution Excellence
          </motion.span>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-[#0B1F3A] dark:text-white uppercase italic tracking-tight"
          >
            Our <span className="text-[#D4AF37] not-italic">Workflow</span>
          </motion.h2>
          
          <div className="flex justify-center mt-12">
            <div className="flex p-1.5 bg-slate-100 dark:bg-zinc-900 rounded-full border border-slate-200 dark:border-white/5 shadow-xl">
              {Object.keys(workflowData).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-10 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-500 ${
                    activeTab === tab ? 'text-white' : 'text-[#64748B] hover:text-[#0B1F3A]'
                  }`}
                >
                  {activeTab === tab && (
                    <motion.div 
                      layoutId="activeFlowTab"
                      className="absolute inset-0 bg-[#0B1F3A] rounded-full shadow-lg"
                    />
                  )}
                  <span className="relative z-10">{tab}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative">
          
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[1px] bg-slate-200 dark:bg-white/10 -translate-y-1/2">
            <motion.div 
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-full bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.4)]"
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {workflowData[activeTab].map((step, index) => (
                <div key={index} className="relative group">
                  
                  <div className="relative z-10 p-10 rounded-[2rem] bg-white dark:bg-zinc-900 border border-slate-100 dark:border-white/5 shadow-2xl flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-3 group-hover:border-[#D4AF37]/30">
                    
                    <div className="absolute top-6 right-8 text-3xl font-bold text-[#F1F5F9] dark:text-white/5 italic">
                      {step.id}
                    </div>

                    <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-8 shadow-xl transition-all duration-500 group-hover:rotate-6 group-hover:scale-110`}>
                      {step.icon}
                    </div>

                    <h3 className="text-xl font-bold text-[#0B1F3A] dark:text-white uppercase italic mb-4">
                      {step.title}
                    </h3>

                    <p className="text-[#64748B] dark:text-zinc-400 text-sm leading-relaxed font-medium">
                      {step.desc}
                    </p>

                    <div className="hidden lg:block absolute -bottom-[48px] left-1/2 -translate-x-1/2">
                      <div className="w-5 h-5 rounded-full bg-white dark:bg-[#060606] border-4 border-slate-200 dark:border-zinc-800 group-hover:border-[#D4AF37] group-hover:scale-125 transition-all duration-500" />
                    </div>

                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

export default WorkFlow;