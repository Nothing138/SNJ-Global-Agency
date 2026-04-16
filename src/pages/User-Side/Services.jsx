import React from 'react';
import { motion } from 'framer-motion';
import { 
  HardHat, Hotel, Monitor, GraduationCap, 
  Palmtree, Briefcase, HeartPulse, Truck 
} from 'lucide-react';

const serviceList = [
  { icon: <HardHat size={30} />, title: "Construction", desc: "Civil engineers, supervisors & skilled labor for global projects." },
  { icon: <Monitor size={30} />, title: "IT & Tech", desc: "Software developers, data analysts & IT support experts." },
  { icon: <Hotel size={30} />, title: "Hospitality", desc: "5-star hotel staff, chefs & management roles in Europe & UAE." },
  { icon: <GraduationCap size={30} />, title: "Student Visa", desc: "Complete admission & visa processing for top universities." },
  { icon: <Palmtree size={30} />, title: "Luxury Tours", desc: "Premium holiday packages with 5-star accommodation." },
  { icon: <HeartPulse size={30} />, title: "Healthcare", desc: "Nurses, doctors & laboratory technicians for global clinics." },
  { icon: <Truck size={30} />, title: "Logistics", desc: "Heavy vehicle drivers & warehouse management specialists." },
  { icon: <Briefcase size={30} />, title: "Business Visa", desc: "Investor & entrepreneur visa processing for startups." },
];

const Services = () => {
  return (
    <section className="py-24 bg-[#F8FAFC] transition-colors duration-500 font-['Times_New_Roman',_serif]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            {/* Heading (H1/H2) Style: #0B1F3A, Bold, 40-48px */}
            <h2 className="text-4xl md:text-[48px] font-bold text-[#0B1F3A] uppercase tracking-tight leading-tight">
              Specialized <span className="italic text-[#EAB308]">Industries</span>
            </h2>
            {/* Body Text Style: #64748B, 18px, 1.6 Line Spacing */}
            <p className="text-[#64748B] mt-4 text-[18px] leading-[1.6]">
              Expert solutions tailored for the world's most demanding sectors.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceList.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10 }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 rounded-[2.5rem] bg-white border border-[#E5E7EB] hover:border-[#EAB308] hover:shadow-xl transition-all duration-500"
            >
              {/* Icon Container: Navy Background, Gold Icon on Hover */}
              <div className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center bg-[#0B1F3A]/5 text-[#0B1F3A] group-hover:bg-[#0B1F3A] group-hover:text-[#EAB308] transition-all duration-500 shadow-sm">
                {service.icon}
              </div>

              {/* Subheading Style: #0F172A, Bold */}
              <h3 className="text-xl font-bold text-[#0F172A] mb-3 tracking-tight uppercase italic">
                {service.title}
              </h3>

              {/* Body Text Style: #64748B */}
              <p className="text-[#64748B] text-sm leading-[1.6]">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;