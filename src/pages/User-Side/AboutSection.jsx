import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Headphones, Star, Building2, ArrowRight, ShieldCheck, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutSection = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [activeStat, setActiveStat] = useState(0);

  // High-impact data derived from Resume and Memorandum
  const aboutData = [
    {
      role: "Director & Operations Lead",
      name: "Nessathul Jannath",
      title: "Global Recruitment & Success Specialist",
      description: "A results-driven leader with extensive experience in digital recruitment and customer success. Expertise in managing global staffing operations and ensuring seamless candidate journeys.",
      contact: "directorsnj932@gmail.com | +880 1348-992268",
      badge: "Director",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" // Replace with actual photo
    },
    {
      role: "Managing Shareholder",
      name: "MD Salah Uddin",
      title: "Strategic Trade & Global Partnerships",
      description: "Driving the vision of SNJ Global Trading with a focus on international trade compliance and B2B growth. Leading the company toward becoming a premier global logistics and trading hub.",
      contact: "supplyinfo365@gmail.com | +60 11-7026 9778",
      badge: "Shareholder",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800" // Replace with actual photo
    }
  ];

  const stats = [
    { icon: <Users />, label: "Client Base", value: "20,000+", sub: "Successful Solutions" },
    { icon: <ShieldCheck />, label: "Compliance", value: "100%", sub: "Lawful Processes" },
    { icon: <Star />, label: "Experience", value: "16+ Yrs", sub: "Industry Experts" },
    { icon: <Globe />, label: "Presence", value: "Global", sub: "Baku · Poland · Germany" }
  ];

  useEffect(() => {
    const mainInterval = setInterval(() => {
      setIndex((prev) => (prev + 1) % aboutData.length);
    }, 8000);

    const statInterval = setInterval(() => {
      setActiveStat((prev) => (prev + 1) % stats.length);
    }, 2000);

    return () => {
      clearInterval(mainInterval);
      clearInterval(statInterval);
    };
  }, [aboutData.length, stats.length]);

  return (
    <section className="py-12 md:py-24 bg-white dark:bg-[#080808] overflow-hidden font-['Times_New_Roman',_serif]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          
          {/* 🖼️ LEFT: LEADERSHIP IMAGE */}
          <div className="relative w-full lg:w-1/2 h-[450px] md:h-[650px]">
            <AnimatePresence mode="wait">
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="absolute inset-0 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl z-10 border-4 md:border-8 border-slate-100 dark:border-white/5"
              >
                <img src={aboutData[index].image} alt={aboutData[index].name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/90 via-transparent to-transparent" />
                
                <div className="absolute bottom-8 left-8 text-white">
                  <p className="text-[#D4AF37] font-black uppercase tracking-widest text-xs mb-1">{aboutData[index].role}</p>
                  <h3 className="text-3xl font-black italic uppercase">{aboutData[index].name}</h3>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Floating Experience/Role Badge */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 5 }}
              className="absolute -top-4 -right-2 md:-top-8 md:-right-8 bg-[#D4AF37] text-[#0B1F3A] px-6 py-4 md:px-10 md:py-8 rounded-2xl md:rounded-3xl shadow-2xl z-20 text-center"
            >
              <p className="text-2xl md:text-4xl font-black italic leading-none uppercase">{aboutData[index].badge}</p>
              <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Executive Leadership</p>
            </motion.div>
          </div>

          {/* 📝 RIGHT: CONTENT & STATS */}
          <div className="w-full lg:w-1/2 text-left">
            <div className="mb-8 md:mb-12">
              <span className="text-[#D4AF37] font-black uppercase tracking-[0.4em] text-[10px] md:text-xs">GlobalRoutes Leadership</span>
              
              <div className="min-h-[250px] md:min-h-[300px] mt-4 md:mt-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.6 }}
                  >
                    <h2 className="text-3xl md:text-5xl font-black text-[#0B1F3A] dark:text-white leading-tight uppercase italic mb-4 md:mb-6">
                      {aboutData[index].title}
                    </h2>
                    <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium mb-6">
                      {aboutData[index].description}
                    </p>
                    <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border-l-4 border-[#D4AF37]">
                      <p className="text-[10px] font-black uppercase text-[#D4AF37] mb-1">Direct Contact</p>
                      <p className="text-xs md:text-sm font-bold text-[#0B1F3A] dark:text-white tracking-wide">
                        {aboutData[index].contact}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/aboutus')}
                className="mt-8 w-full md:w-auto flex items-center justify-center gap-4 px-10 py-5 bg-[#0B1F3A] dark:bg-[#D4AF37] text-white dark:text-[#0B1F3A] font-black uppercase tracking-widest rounded-xl md:rounded-2xl transition-all hover:shadow-xl hover:-translate-y-1"
              >
                The Executive Team <ArrowRight size={20} />
              </motion.button>
            </div>

            {/* 📊 STATS BENTO GRID */}
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {stats.map((stat, i) => {
                const isActive = activeStat === i;
                return (
                  <motion.div 
                    key={i}
                    animate={{ 
                      scale: isActive ? 1.05 : 1,
                      borderColor: isActive ? '#D4AF37' : 'rgba(11, 31, 58, 0.1)',
                    }}
                    className={`p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border-2 bg-white dark:bg-white/5 transition-all relative overflow-hidden`}
                  >
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4 transition-colors z-10 relative ${isActive ? 'bg-[#D4AF37] text-[#0B1F3A]' : 'bg-slate-100 dark:bg-slate-800 text-[#D4AF37]'}`}>
                      {stat.icon}
                    </div>
                    
                    <div className="relative z-10">
                      <h4 className="text-xl md:text-2xl font-black text-[#0B1F3A] dark:text-white tracking-tighter">{stat.value}</h4>
                      <p className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-colors ${isActive ? 'text-[#D4AF37]' : 'text-slate-400'}`}>
                        {stat.label}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;