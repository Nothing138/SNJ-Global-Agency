import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowUpRight, Globe2, Sparkles, Phone, Mail, ShieldAlert,
  MessageSquare, ChevronRight, Play, GraduationCap, ShieldCheck, BellRing
} from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();
  const [showSupport, setShowSupport] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) setIsLoggedIn(true);
  }, []);

  const services = [
    { label: 'Visa',        icon: <GraduationCap size={36} />, variant: 'gold',  path: '/visa' },
    { label: 'Citizenship', icon: <ShieldCheck size={36} />,   variant: 'navy',  path: '/citizenship' },
    { label: 'Travel',      icon: <Globe2 size={36} />,        variant: 'navy',  path: '/travel' },
    { label: 'Flight',      icon: <Sparkles size={36} />,      variant: 'gold',  path: '/flight' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveService((prev) => (prev + 1) % services.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [services.length]);

  const supportLinks = [
    { icon: <MessageSquare size={18} />, label: 'WhatsApp',   color: 'bg-[#25D366]',  link: 'https://wa.me/48728356666' },
    { icon: <Mail size={18} />,          label: 'Email Us',   color: 'bg-[#0B1F3A]',  link: 'mailto:directorsnj932@gmail.com' },
    { icon: <Phone size={18} />,         label: 'Direct Call',color: 'bg-[#D4AF37]',  link: 'tel:+48222085497' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white pt-30 sm:pt-32 pb-12 font-['Times_New_Roman',_serif]">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-[#D4AF37]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#0B1F3A]/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* LEFT CONTENT */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 px-4 sm:px-5 py-2 rounded-full bg-slate-50 border border-slate-200 mb-6 sm:mb-8">
              <span className="flex h-2 w-2 rounded-full bg-[#D4AF37] animate-ping" />
              <span className="text-[10px] sm:text-[12px] font-black text-[#0B1F3A] uppercase tracking-[0.2em] sm:tracking-[0.3em]">
                Your Global HR Solutions Partner
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-[#0B1F3A] leading-[1.1] mb-4 sm:mb-6 uppercase">
              ONE PLATFORM, <br /> 
              <span className="text-[#D4AF37] italic font-black">ENDLESS</span> <br />
              <span className="text-3xl sm:text-4xl md:text-6xl opacity-90">Opportunities.</span>
            </h1>

            <p className="max-w-xl text-slate-500 text-base sm:text-lg mb-8 sm:mb-10 leading-relaxed font-medium">
              Turning dreams into reality, connecting people to careers, students to education, and businesses to the right talent, while sourcing skilled workers for companies, industries, and factories worldwide.
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
              {!isLoggedIn ? (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate('/register')}
                  className="px-8 sm:px-10 py-4 sm:py-5 bg-[#D4AF37] text-white font-black uppercase text-xs tracking-widest rounded-2xl flex items-center gap-4 shadow-xl shadow-[#D4AF37]/20"
                >
                  Explore Now <ArrowUpRight size={20} />
                </motion.button>
              ) : (
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="px-10 sm:px-12 py-4 sm:py-5 bg-[#0B1F3A] text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-2xl"
                >
                  Go to Dashboard
                </button>
              )}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-lg bg-indigo-50 dark:bg-indigo-950/30 border-2 border-indigo-100 dark:border-indigo-800 p-4 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] flex items-start gap-4 sm:gap-5 shadow-sm"
            >
              <div className="relative shrink-0">
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-indigo-400 rounded-full"
                />
                <motion.div 
                  animate={{ rotate: [-10, 10, -10, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="relative bg-indigo-600 p-2.5 sm:p-3 rounded-full text-white shadow-lg z-10"
                >
                  <BellRing size={20} className="animate-pulse" />
                </motion.div>
              </div>
              <div>
                <h4 className="text-indigo-600 dark:text-indigo-400 font-black uppercase text-[9px] sm:text-[10px] tracking-[0.2em] mb-1.5 flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full animate-ping"></span>
                  Official Disclaimer
                </h4>
                <p className="text-indigo-900 dark:text-indigo-100 text-xs sm:text-sm md:text-base font-bold leading-relaxed italic">
                  "We provide professional consultancy and application support services only and operate as a private agency with no affiliation to any government body."
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT CONTENT - DYNAMIC SERVICES */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative mt-8 lg:mt-0"
          >
            <div className="bg-white p-4 sm:p-6 md:p-10 rounded-[3rem] sm:rounded-[4rem] shadow-[0_40px_80px_-20px_rgba(11,31,58,0.12)] border border-slate-50">
              <div className="grid grid-cols-2 gap-3 sm:gap-6">
                {services.map((service, i) => {
                  const isActive = activeService === i;
                  const isGold = service.variant === 'gold';
                  return (
                    <motion.div 
                      key={i}
                      onClick={() => navigate(service.path)}
                      animate={{ 
                        scale: isActive ? 1.04 : 1,
                        y: isActive ? -8 : 0,
                      }}
                      className={`
                        p-3 sm:p-5 lg:p-8 xl:p-10
                        rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[3rem]
                        transition-all duration-500
                        h-36 sm:h-48 md:h-56 lg:h-64
                        flex flex-col justify-between
                        relative overflow-hidden group cursor-pointer
                        ${isGold ? 'bg-[#D4AF37]' : 'bg-[#0B1F3A]'} 
                        ${isActive ? 'shadow-2xl ring-2 sm:ring-4 ring-white' : 'opacity-90 grayscale-[30%]'}
                      `}
                    >
                      <div className={`transition-transform duration-500 group-hover:scale-110 ${isGold ? 'text-white' : 'text-[#D4AF37]'}`}>
                        {service.icon}
                      </div>
                      <div className="relative z-10 flex justify-between items-end">
                        <span className="font-black uppercase text-base sm:text-xl lg:text-2xl tracking-tighter text-white leading-[0.9]">
                          {service.label}
                        </span>
                        <div className={`p-1.5 sm:p-2.5 rounded-full bg-white/20 text-white ${isActive ? 'bg-white text-[#0B1F3A]' : ''}`}>
                          <ChevronRight size={16} />
                        </div>
                      </div>
                      <div className="absolute -right-4 -top-4 sm:-right-6 sm:-top-6 opacity-10 text-white pointer-events-none">
                        {React.cloneElement(service.icon, { size: 80 })}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-6 sm:mt-10 pt-5 sm:pt-8 border-t border-slate-100 flex justify-between items-center px-2 sm:px-4">
                <div>
                  <p className="text-2xl sm:text-4xl font-black text-[#0B1F3A] italic">12k+</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Successful Placements</p>
                </div>
                <div className="h-10 sm:h-12 w-[1px] bg-slate-100" />
                <div className="text-right">
                  <p className="text-2xl sm:text-4xl font-black text-[#D4AF37] italic">99%</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Client Satisfaction</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 sm:-bottom-6 left-0 sm:-left-4 md:-left-8">
              <motion.button 
                onClick={() => setShowSupport(!showSupport)}
                whileHover={{ scale: 1.05 }}
                className="bg-[#D4AF37] text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl sm:rounded-2xl shadow-xl flex items-center gap-3 sm:gap-4 group"
              >
                <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg">
                  <Phone className={`${showSupport ? 'rotate-90' : 'animate-bounce'} text-white transition-transform`} size={16} />
                </div>
                <p className="text-xs sm:text-sm font-black uppercase tracking-widest">Talk To Us</p>
              </motion.button>
              
              <AnimatePresence>
                {showSupport && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-14 sm:bottom-16 left-0 flex flex-col gap-2"
                  >
                    {supportLinks.map((s, i) => (
                      <a key={i} href={s.link} className={`${s.color} text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl shadow-lg flex items-center gap-3 hover:scale-105 transition-transform min-w-[140px] sm:min-w-[150px]`}>
                        {s.icon} <span className="text-[10px] font-black uppercase tracking-widest">{s.label}</span>
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;