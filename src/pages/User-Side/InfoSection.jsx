//info section
import React, { useState } from 'react';
import { 
  MapPin, 
  ShieldCheck, 
  Users, 
  PlaneTakeoff, 
  ArrowRight,
  Newspaper,
  PhoneCall,
  CheckCircle2
} from 'lucide-react';

const InfoSection = () => {
  const [activeRoute, setActiveRoute] = useState(0);

  const routes = [
    { 
      id: 0,
      icon: <MapPin className="text-[#EAB308]" size={34} />, 
      title: "Step 1: Personalized Planning", 
      label: "PLANNING",
      content: "We evaluate your profile to identify the most suitable pathway, whether for citizenship, visa, or international travel, ensuring a clear and strategic direction." 
    },
    { 
      id: 1,
      icon: <ShieldCheck className="text-[#EAB308]" size={34} />, 
      title: "Step 2: Professional Processing", 
      label: "SECURITY",
      content: "Our experts handle all documentation with precision, covering student visas, work permits, visit visas, and citizenship applications with full compliance." 
    },
    { 
      id: 2,
      icon: <Users className="text-[#EAB308]" size={34} />, 
      title: "Step 3: Application & Approval", 
      label: "SUCCESS",
      content: "We manage your application submission and coordinate with relevant authorities to ensure a smooth and successful approval process." 
    },
    { 
      id: 3,
      icon: <PlaneTakeoff className="text-[#EAB308]" size={34} />, 
      title: "Step 4: Travel & Settlement", 
      label: "ARRIVAL",
      content: "From travel arrangements to post-arrival support, we ensure a seamless transition so you can confidently begin your journey abroad." 
    }
  ];

  return (
    <section className="py-24 bg-[#F8FAFC] font-['Times_New_Roman',_serif]">
      <div className="container mx-auto px-6">
        
        {/* HEADER */}
        <div className="text-center max-w-6xl mx-auto mb-20 px-4">
          
          <div className="inline-block mb-6 px-8 py-2.5 bg-[#0B1F3A] text-[#EAB308] rounded-full text-sm font-bold tracking-[0.3em] uppercase shadow-xl border border-[#EAB308]/30">
            SNJ GLOBALROUTES
          </div>

          {/* 🔥 NEW PREMIUM HEADING */}
          <h2 className="text-[50px] md:text-[74px] font-bold text-[#0B1F3A] leading-[1.1] mb-10">
            Your <span className="text-[#EAB308] italic">Trusted Partner</span> <br className="hidden md:block"/>
            For Global Opportunities.
          </h2>

          {/* 🔥 STRAIGHT LINE STEPS */}
          <div className="flex justify-center items-center gap-6 md:gap-10 mb-12 flex-wrap">
            
            <div className="flex items-center gap-3">
              <span className="w-14 h-14 rounded-full bg-[#EAB308] text-[#0B1F3A] flex items-center justify-center font-black text-xl">1</span>
              <p className="text-[#0B1F3A] font-bold text-xl uppercase">Plan</p>
            </div>

            <span className="text-[#94A3B8] text-2xl">—</span>

            <div className="flex items-center gap-3">
              <span className="w-14 h-14 rounded-full bg-[#EAB308] text-[#0B1F3A] flex items-center justify-center font-black text-xl">2</span>
              <p className="text-[#0B1F3A] font-bold text-xl uppercase">Apply</p>
            </div>

            <span className="text-[#94A3B8] text-2xl">—</span>

            <div className="flex items-center gap-3">
              <span className="w-14 h-14 rounded-full bg-[#EAB308] text-[#0B1F3A] flex items-center justify-center font-black text-xl">3</span>
              <p className="text-[#0B1F3A] font-bold text-xl uppercase">Fly</p>
            </div>

            <span className="text-[#94A3B8] text-2xl">—</span>

            <div className="flex items-center gap-3">
              <span className="w-16 h-16 rounded-full bg-[#0B1F3A] text-[#EAB308] flex items-center justify-center font-black text-xl border-2 border-[#EAB308]">4</span>
              <p className="text-[#0B1F3A] font-bold text-xl uppercase underline decoration-[#EAB308] decoration-4 underline-offset-8">
                Success
              </p>
            </div>

          </div>

          {/* 🔥 NEW CORPORATE DESCRIPTION */}
          <p className="text-[#64748B] text-[20px] md:text-[26px] max-w-4xl mx-auto leading-relaxed font-medium">
            At <strong className="text-[#0B1F3A] border-b-2 border-[#EAB308]">SNJ GlobalRoutes</strong>, we deliver structured and reliable solutions across citizenship, visa, and international travel services—ensuring a seamless, transparent, and professionally managed journey from start to finish.
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {routes.map((route, index) => (
                <div 
                  key={index}
                  onMouseEnter={() => setActiveRoute(index)}
                  className={`p-10 rounded-[2.5rem] border-2 transition-all duration-500 cursor-pointer relative overflow-hidden group ${
                    activeRoute === index 
                    ? 'bg-[#0B1F3A] border-[#0B1F3A] shadow-2xl translate-y-[-8px]' 
                    : 'bg-white border-[#E5E7EB] hover:border-[#EAB308]/50'
                  }`}
                >
                  <span className={`absolute -right-4 -bottom-8 text-[120px] font-black opacity-5 ${
                    activeRoute === index ? 'text-white' : 'text-[#0B1F3A]'
                  }`}>
                    {index + 1}
                  </span>

                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                    activeRoute === index ? 'bg-white/10' : 'bg-[#F8FAFC] border'
                  }`}>
                    {route.icon}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 size={14} className={activeRoute === index ? 'text-[#EAB308]' : 'text-[#64748B]'} />
                    <span className={`text-[13px] font-black tracking-[0.25em] uppercase ${
                      activeRoute === index ? 'text-[#EAB308]' : 'text-[#64748B]'
                    }`}>
                      {route.label}
                    </span>
                  </div>

                  <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${
                    activeRoute === index ? 'text-white' : 'text-[#0B1F3A]'
                  }`}>
                    {route.title}
                  </h3>
                  
                  <p className={`text-[18px] md:text-[20px] leading-relaxed ${
                    activeRoute === index ? 'text-white/80' : 'text-[#64748B]'
                  }`}>
                    {route.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4">
            <div className="bg-white p-10 rounded-[3rem] border border-[#E5E7EB] shadow-sm sticky top-32">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-4 bg-[#0B1F3A] rounded-2xl text-[#EAB308] shadow-lg">
                  <Newspaper size={28} />
                </div>
                <h3 className="text-2xl font-bold text-[#0B1F3A]">Quick Updates</h3>
              </div>

              <div className="space-y-6">
                {[
                  "Citizenship and residency programs now open for multiple destinations.",
                  "Student, work permit, and visit visa processing available with expert support.",
                  "Expanded global opportunities across Europe, the Middle East, and beyond.",
                  "End-to-end travel and relocation services now available."
                ].map((news, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="mt-2 w-2.5 h-2.5 rounded-full bg-[#EAB308]" />
                    <p className="text-[18px] font-semibold text-[#0F172A] leading-snug">
                      {news}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-10 space-y-4">
                <button className="w-full py-5 bg-[#0B1F3A] text-[#EAB308] rounded-2xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:shadow-xl transition-all">
                  Free Consultation <ArrowRight size={18} />
                </button>
                
                <a 
                  href="tel:+1234567890" 
                  className="w-full py-5 border-2 border-[#E5E7EB] text-[#0B1F3A] rounded-2xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3"
                >
                  <PhoneCall size={18} /> Call Now
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default InfoSection;