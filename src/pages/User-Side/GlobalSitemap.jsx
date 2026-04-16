import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // Corrected import source
import { 
  Globe, ChevronRight, LayoutGrid, 
  ShieldCheck, Briefcase, Plane, Award 
} from 'lucide-react';

const GlobalSitemap = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sitemapData = [
    {
      category: "Main Navigation",
      icon: <LayoutGrid className="text-[#D4AF37]" />,
      links: [
        { name: "Home Dashboard", path: "/" },
        { name: "About SNJ Global", path: "/aboutus" },
        { name: "Contact Concierge", path: "/contact" },
        { name: "Success Stories", path: "/success-stories" },
      ]
    },
    {
      category: "Global Mobility",
      icon: <Plane className="text-[#D4AF37]" />,
      links: [
        { name: "Visa Solutions", path: "/visa" },
        { name: "Citizenship by Investment", path: "/citizenship" },
        { name: "Travel Expeditions", path: "/travel" },
      ]
    },
    {
      category: "Legal & Compliance",
      icon: <ShieldCheck className="text-[#D4AF37]" />,
      links: [
        { name: "Terms & Conditions", path: "/terms-engagement" },
        { name: "Global Disclaimer", path: "/global-disclaimer" },
        { name: "Privacy Protocol", path: "#" },
      ]
    },
    {
      category: "Corporate Hub",
      icon: <Briefcase className="text-[#D4AF37]" />,
      links: [
        { name: "Employer Portal", path: "#" },
        { name: "Recruitment Hub", path: "#" },
        { name: "Institutional Partners", path: "#" },
      ]
    }
  ];

  return (
    <div className="bg-white min-h-screen font-['Times_New_Roman',_serif]">
      
      {/* 🔱 Hero Header */}
      <section className="bg-[#0B1F3A] pt-40 pb-20 text-center relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-6 z-10 relative"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white uppercase tracking-tighter">
            Global <span className="text-[#D4AF37]">Sitemap</span>
          </h1>
          <div className="flex justify-center items-center gap-2 mt-4">
             <Award size={16} className="text-[#D4AF37]" />
             <p className="text-[#D4AF37]/80 text-xs font-black uppercase tracking-[0.4em]">
               Digital Architecture & Directory
             </p>
          </div>
        </motion.div>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none text-white text-[25rem] font-bold flex items-center justify-center">
          MAP
        </div>
      </section>

      {/* 🗺️ Sitemap Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {sitemapData.map((section, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                {section.icon}
                <h3 className="text-xl font-bold text-[#0B1F3A] uppercase tracking-tight">
                  {section.category}
                </h3>
              </div>
              <ul className="space-y-4">
                {section.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link 
                      to={link.path} 
                      className="group flex items-center gap-2 text-slate-500 hover:text-[#0B1F3A] transition-all"
                    >
                      <ChevronRight size={14} className="text-[#D4AF37] opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                      <span className="text-lg group-hover:font-bold transition-all">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🛠️ Technical Footer */}
      <footer className="bg-slate-50 py-16 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full border border-slate-200 shadow-sm mb-6">
            <Globe size={16} className="text-[#D4AF37]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Index Status: Verified 2026</span>
          </div>
          <p className="text-[#0B1F3A] font-bold uppercase tracking-[0.3em]">SNJ GLOBALROUTES</p>
          <p className="text-xs text-slate-400 mt-2 italic">Official Navigation Protocol</p>
        </div>
      </footer>
    </div>
  );
};

export default GlobalSitemap;