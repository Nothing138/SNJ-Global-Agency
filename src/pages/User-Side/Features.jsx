//feature
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, Globe2, PlaneTakeoff, ShieldCheck, 
  Zap, ArrowUpRight, BarChart3, 
  Fingerprint, Scale 
} from 'lucide-react';

const featureData = [
  {
    icon: <Briefcase size={28} />,
    title: "Global Jobs",
    desc: "Direct placement with top-tier employers across Europe, UAE & Asia.",
    tag: "Work",
    color: "from-[#0B1F3A] to-[#0F172A]", // Deep Navy Gradient
    grid: "md:col-span-2",
    delay: 0.1
  },
  {
    icon: <Globe2 size={28} />,
    title: "Visa Expert",
    desc: "99% Success rate in documentation.",
    tag: "Legal",
    color: "from-[#EAB308] to-[#D9A306]", // Gold Gradient
    grid: "md:col-span-1",
    delay: 0.2
  },
  {
    icon: <Fingerprint size={28} />,
    title: "Real-time Tracking",
    desc: "Live updates on your application status.",
    tag: "Tech",
    color: "from-[#0B1F3A] to-[#0F172A]",
    grid: "md:col-span-1",
    delay: 0.3
  },
  {
    icon: <PlaneTakeoff size={28} />,
    title: "Elite Travel",
    desc: "Bespoke itineraries for the modern explorer.",
    tag: "Leisure",
    color: "from-[#0B1F3A] to-[#0F172A]",
    grid: "md:col-span-2",
    delay: 0.4
  },
  {
    icon: <Scale size={28} />,
    title: "Legal Assurance",
    desc: "Every contract is vetted by legal experts.",
    tag: "Safety",
    color: "from-[#EAB308] to-[#D9A306]",
    grid: "md:col-span-1",
    delay: 0.5
  },
  {
    icon: <BarChart3 size={28} />,
    title: "Price Control",
    desc: "No hidden fees. Full transparency always.",
    tag: "Finance",
    color: "from-[#0B1F3A] to-[#0F172A]",
    grid: "md:col-span-2",
    delay: 0.6
  }
];

const Features = () => {
  return (
    <section className="py-24 bg-[#F8FAFC] transition-colors duration-500 relative overflow-hidden font-['Times_New_Roman',_serif]">
      
      {/* Subtle Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#0B1F3A]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#EAB308]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Animated Header */}
        <div className="max-w-3xl mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-[48px] font-bold text-[#0B1F3A] uppercase leading-tight tracking-tight"
          >
            Our <br /> 
            <span className="italic text-[#EAB308]">Capabilities</span>
          </motion.h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featureData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: item.delay, duration: 0.5 }}
              className={`${item.grid} group relative overflow-hidden rounded-[2.5rem] border border-[#E5E7EB] bg-white p-8 hover:shadow-2xl transition-all duration-500`}
            >
              {/* Subtle Pattern on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />
              
              <div className="relative z-10 h-full flex flex-col">
                <div className="flex justify-between items-start mb-10">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-xl`}>
                    {item.icon}
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.1, rotate: 45 }}
                    className="p-3 rounded-full bg-[#F8FAFC] border border-[#E5E7EB] text-[#0B1F3A] group-hover:text-[#EAB308] transition-colors"
                  >
                    <ArrowUpRight size={20} />
                  </motion.button>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[3px] text-[#EAB308] mb-3 block">
                    {item.tag}
                  </span>
                  {/* Subheading Style: #0F172A, Bold */}
                  <h3 className="text-2xl font-bold uppercase text-[#0F172A] mb-4 tracking-tight">
                    {item.title}
                  </h3>
                  {/* Body Text Style: #64748B, 1.6 Line Spacing */}
                  <p className="text-[#64748B] text-[16px] leading-[1.6]">
                    {item.desc}
                  </p>
                </div>

                {/* Status elements for larger cards */}
                {item.grid.includes('col-span-2') && (
                    <div className="mt-8 pt-8 border-t border-[#E5E7EB] flex gap-6">
                       <div className="flex items-center gap-2">
                         <ShieldCheck size={14} className="text-[#0B1F3A]" />
                         <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-widest">Verified</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <Zap size={14} className="text-[#EAB308]" />
                         <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-widest">Instant</span>
                       </div>
                    </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;