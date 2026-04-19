//visa
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, Globe, Plane, Search, GraduationCap,
  ShieldCheck, Zap, Phone, Mail, Users, Calendar,
  CheckCircle2, ClipboardList, CreditCard, Ticket, 
  PlaneTakeoff, CheckCircle
} from 'lucide-react';
import FloatingButton from './FloatingButton';

const Visa = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('work');
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Each country has an `id` that matches the id in the data files
  // Work visa IDs must match workVisaData.js id fields
  const workPermitCountries = [
    { name: "Albania",        code: "AL", id: "albania" },
    { name: "Armenia",        code: "AM", id: "armenia" },
    { name: "Azerbaijan",     code: "AZ", id: "azerbaijan-work" },
    { name: "Belarus",        code: "BY", id: "belarus" },
    { name: "Belgium",        code: "BE", id: "belgium" },
    { name: "Bulgaria",       code: "BG", id: "bulgaria" },
    { name: "Cambodia",       code: "KH", id: "cambodia-work" },
    { name: "Croatia",        code: "HR", id: "croatia" },
    { name: "Cyprus",         code: "CY", id: "cyprus" },
    { name: "Czech Republic", code: "CZ", id: "czech-republic" },
    { name: "Denmark",        code: "DK", id: "denmark" },
    { name: "Estonia",        code: "EE", id: "estonia" },
    { name: "Fiji",           code: "FJ", id: "fiji" },
    { name: "Finland",        code: "FI", id: "finland" },
    { name: "France",         code: "FR", id: "france" },
    { name: "Germany",        code: "DE", id: "germany" },
    { name: "Greece",         code: "GR", id: "greece" },
    { name: "Hungary",        code: "HU", id: "hungary" },
    { name: "Ireland",        code: "IE", id: "ireland" },
    { name: "Italy",          code: "IT", id: "italy" },
    { name: "Laos",           code: "LA", id: "laos-work" },
    { name: "Latvia",         code: "LV", id: "latvia" },
    { name: "Lithuania",      code: "LT", id: "lithuania" },
    { name: "Luxembourg",     code: "LU", id: "luxembourg" },
    { name: "Malaysia",       code: "MY", id: "malaysia-work" },
    { name: "Malta",          code: "MT", id: "malta" },
    { name: "Moldova",        code: "MD", id: "moldova" },
    { name: "Montenegro",     code: "ME", id: "montenegro" },
    { name: "Netherlands",    code: "NL", id: "netherlands" },
    { name: "New Zealand",    code: "NZ", id: "new-zealand" },
    { name: "North Macedonia",code: "MK", id: "north-macedonia" },
    { name: "Norway",         code: "NO", id: "norway" },
    { name: "Poland",         code: "PL", id: "poland" },
    { name: "Portugal",       code: "PT", id: "portugal" },
    { name: "Romania",        code: "RO", id: "romania" },
    { name: "Russia",         code: "RU", id: "russia" },
    { name: "Serbia",         code: "RS", id: "serbia" },
    { name: "Slovakia",       code: "SK", id: "slovakia" },
    { name: "Slovenia",       code: "SI", id: "slovenia" },
    { name: "Spain",          code: "ES", id: "spain" },
    { name: "Sweden",         code: "SE", id: "sweden" },
    { name: "Thailand",       code: "TH", id: "thailand-work" },
    { name: "Türkiye",        code: "TR", id: "turkiye" },
    { name: "United Kingdom", code: "GB", id: "united-kingdom" },
  ].sort((a, b) => a.name.localeCompare(b.name));

  // ✅ Visit visa IDs must match visaData.js id fields
  const visitVisaCountries = [
    { name: "Albania",      code: "AL", id: "albania-visit" },
    { name: "Australia",    code: "AU", id: "australia-visit" },
    { name: "Azerbaijan",   code: "AZ", id: "azerbaijan-visit" },
    { name: "Cambodia",     code: "KH", id: "cambodia-visit" },
    { name: "China",        code: "CN", id: "china-visit" },
    { name: "Cyprus",       code: "CY", id: "cyprus-visit" },
    { name: "France",       code: "FR", id: "france-visit" },
    { name: "Iceland",      code: "IS", id: "iceland-visit" },
    { name: "Italy",        code: "IT", id: "italy-visit" },
    { name: "Japan",        code: "JP", id: "japan-visit" },
    { name: "Laos",         code: "LA", id: "laos-visit" },
    { name: "Malaysia",     code: "MY", id: "malaysia-visit" },
    { name: "Nepal",        code: "NP", id: "nepal-visit" },
    { name: "Philippines",  code: "PH", id: "philippines-visit" },
    { name: "Russia",       code: "RU", id: "russia-visit" },
    { name: "Singapore",    code: "SG", id: "singapore-visit" },
    { name: "South Korea",  code: "KR", id: "south-korea-visit" },
    { name: "Spain",        code: "ES", id: "spain-visit" },
    { name: "Sri Lanka",    code: "LK", id: "sri-lanka-visit" },
    { name: "Sweden",       code: "SE", id: "sweden-visit" },
    { name: "Switzerland",  code: "CH", id: "switzerland-visit" },
    { name: "Thailand",     code: "TH", id: "thailand-visit" },
    { name: "Türkiye",      code: "TR", id: "turkey-visit" },
  ].sort((a, b) => a.name.localeCompare(b.name));

  // ✅ Student visa IDs must match studentVisaData.js id fields
  const studentVisaCountries = [
    { name: "Australia",      code: "AU", id: "australia-student",      type: "Higher Ed" },
    { name: "Austria",        code: "AT", id: "austria-student",        type: "University" },
    { name: "Belgium",        code: "BE", id: "belgium-student",        type: "University" },
    { name: "Czech Republic", code: "CZ", id: "czech-republic-student", type: "Higher Ed" },
    { name: "Denmark",        code: "DK", id: "denmark-student",        type: "University" },
    { name: "Finland",        code: "FI", id: "finland-student",        type: "Higher Ed" },
    { name: "France",         code: "FR", id: "france-student",         type: "University" },
    { name: "Germany",        code: "DE", id: "germany-student",        type: "Higher Ed" },
    { name: "Hungary",        code: "HU", id: "hungary-student",        type: "University" },
    { name: "Italy",          code: "IT", id: "italy-student",          type: "Higher Ed" },
    { name: "United Kingdom", code: "GB", id: "uk-student",             type: "University" },
  ].sort((a, b) => a.name.localeCompare(b.name));

  const getActiveList = () => {
    switch (activeTab) {
      case 'work':    return workPermitCountries;
      case 'visit':   return visitVisaCountries;
      case 'student': return studentVisaCountries;
      default:        return workPermitCountries;
    }
  };

  const filteredList = getActiveList().filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ CORRECT navigation — uses the country's explicit `id` field
  const handleCountryClick = (country) => {
    navigate(`/visa/${activeTab}/${country.id}`);
  };

  return (
    <>
      <FloatingButton />
      <div className="min-h-screen bg-[#FDFDFD] font-sans pt-20 relative selection:bg-[#D4AF37] selection:text-white">

        {/* --- HERO SECTION --- */}
        <section className="relative h-[70vh] flex items-center bg-[#0B1F3A] overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="/src/assets/VISA PART.jpg"
              className="w-full h-full object-cover opacity-40"
              alt="Visa Authorization Hub"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A] via-[#0B1F3A]/80 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl space-y-6"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white uppercase tracking-tight leading-[1.1]">
                International <br />
                <span className="text-[#D4AF37]">Visa & Immigration</span> <br />
                Solutions.
              </h1>
              <p className="max-w-xl text-lg text-white/70 leading-relaxed font-light italic border-l-2 border-[#D4AF37] pl-6">
                Professional-grade vetting for <span className="text-white font-semibold">Work Permit</span>,{' '}
                <span className="text-white font-semibold">Student Visa</span> and{' '}
                <span className="text-white font-semibold">Visit Visa</span> across 40+ sovereign jurisdictions.
              </p>
            </motion.div>
          </div>
        </section>

        {/* --- VISA DETAILS / CONTROL BAR --- */}
        <section id="visa-details" className="max-w-7xl mx-auto px-6 mb-12 -mt-12 relative z-20">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-[#0B1F3A] uppercase tracking-tighter">Destination Registry</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Select your target territory for 2026 intake</p>
              </div>

              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => { setActiveTab('work'); setSearchTerm(""); }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold uppercase text-[10px] tracking-widest transition-all whitespace-nowrap ${activeTab === 'work' ? 'bg-[#0B1F3A] text-white shadow-md' : 'text-slate-500 hover:bg-white'}`}
                  >
                    <Briefcase size={14} /> Work Permit
                  </button>
                  <button
                    onClick={() => { setActiveTab('student'); setSearchTerm(""); }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold uppercase text-[10px] tracking-widest transition-all whitespace-nowrap ${activeTab === 'student' ? 'bg-[#0B1F3A] text-white shadow-md' : 'text-slate-500 hover:bg-white'}`}
                  >
                    <GraduationCap size={14} /> Student Visa
                  </button>
                  <button
                    onClick={() => { setActiveTab('visit'); setSearchTerm(""); }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold uppercase text-[10px] tracking-widest transition-all whitespace-nowrap ${activeTab === 'visit' ? 'bg-[#0B1F3A] text-white shadow-md' : 'text-slate-500 hover:bg-white'}`}
                  >
                    <Plane size={14} /> Visit Visa
                  </button>
                </div>

                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Filter by country name..."
                    className="w-full md:w-64 pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm italic"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                  />
                </div>
              </div>
            </div>

            {/* --- COUNTRY GRID --- */}
            <div className="mt-10">
              <motion.div layout className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredList.map((country) => (
                    <motion.div
                      key={`${activeTab}-${country.id}`}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ y: -8, transition: { duration: 0.2 } }}
                      // ✅ Uses country.id directly — matches data file ids exactly
                      onClick={() => handleCountryClick(country)}
                      className="group bg-slate-50 border border-slate-100 p-6 rounded-2xl hover:bg-white hover:shadow-2xl hover:border-[#D4AF37] transition-all cursor-pointer text-center relative overflow-hidden"
                    >
                      <div className="absolute -right-2 -top-2 w-12 h-12 bg-[#D4AF37]/5 rounded-full group-hover:scale-[3] transition-transform duration-500" />
                      <img
                        src={`https://flagcdn.com/w80/${country.code.toLowerCase()}.png`}
                        alt={country.name}
                        className="w-10 h-7 object-cover mx-auto mb-4 rounded shadow-sm grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                      <h3 className="text-[11px] font-black text-[#0B1F3A] uppercase tracking-wider group-hover:text-[#D4AF37] transition-colors">
                        {country.name}
                      </h3>
                      <div className="flex items-center justify-center gap-1 mt-2">
                        <span className="w-1 h-1 bg-[#D4AF37] rounded-full"></span>
                        <p className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">
                          {country.type || "Open Access"}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {filteredList.length === 0 && (
                <div className="py-20 text-center">
                  <p className="text-slate-400 italic text-sm">No jurisdictions found matching your search criteria.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* --- PROFESSIONAL FEATURES --- */}
        <section className="py-20 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-12">
              {[
                { icon: <ShieldCheck size={28} />, title: "Verified Compliance", desc: "Full alignment with 2026 immigration legal frameworks." },
                { icon: <Zap size={28} />,         title: "Express Vetting",     desc: "Priority processing for executive and urgent categories." },
                { icon: <Globe size={28} />,       title: "Global Network",      desc: "Direct embassy liaison across multiple continents." },
                { icon: <CheckCircle size={28} />, title: "99% Success",         desc: "Document accuracy that ensures high approval rates." },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-3">
                  <div className="w-14 h-14 bg-[#0B1F3A] rounded-2xl flex items-center justify-center text-[#D4AF37] shadow-lg">
                    {item.icon}
                  </div>
                  <h4 className="font-bold text-[#0B1F3A] uppercase text-sm italic">{item.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- BOOKING PROCEDURE --- */}
        <section className="py-24 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-[#0B1F3A] uppercase italic">Seamless <span className="text-[#D4AF37]">Procedure</span></h2>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em] mt-2">The Path to Authorization</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { icon: <ClipboardList />, step: "01", title: "Consultation", desc: "Evaluate your eligibility for your target destination." },
                { icon: <CreditCard />,   step: "02", title: "Initiation",   desc: "Secure your file with a formal initial service deposit." },
                { icon: <Ticket />,       step: "03", title: "Vetting",      desc: "We handle biometric scheduling and document vetting." },
                { icon: <PlaneTakeoff />, step: "04", title: "Approval",     desc: "Receive your final travel documents and depart." },
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                  <div className="text-[#D4AF37] mb-6 transform group-hover:scale-110 transition-all">{item.icon}</div>
                  <span className="absolute top-8 right-8 text-6xl font-black text-slate-200 group-hover:text-[#D4AF37]/10">{item.step}</span>
                  <h4 className="text-xl font-black text-[#0B1F3A] uppercase italic mb-3">{item.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- WHY CHOOSE US --- */}
        <section className="py-24 max-w-7xl mx-auto px-6 bg-white rounded-[3rem] shadow-sm mb-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[#0B1F3A] mb-6 uppercase tracking-tight italic">
                Why Choose <span className="text-[#D4AF37]">SNJ GlobalRoutes?</span>
              </h2>
              <p className="text-[#64748B] text-lg italic mb-10 leading-relaxed">
                As a premier mobility facilitator, we don't just process applications—we engineer global futures. Our 2026 protocols represent the pinnacle of visa vetting.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div className="flex items-center gap-3"><CheckCircle2 className="text-[#D4AF37]" size={20} /><span className="text-[10px] font-bold uppercase tracking-widest text-[#0B1F3A]">Certified Excellence</span></div>
                <div className="flex items-center gap-3"><Globe className="text-[#D4AF37]" size={20} /><span className="text-[10px] font-bold uppercase tracking-widest text-[#0B1F3A]">15+ Global Hubs</span></div>
                <div className="flex items-center gap-3"><ShieldCheck className="text-[#D4AF37]" size={20} /><span className="text-[10px] font-bold uppercase tracking-widest text-[#0B1F3A]">Secure Logistics</span></div>
                <div className="flex items-center gap-3"><Zap className="text-[#D4AF37]" size={20} /><span className="text-[10px] font-bold uppercase tracking-widest text-[#0B1F3A]">Rapid Processing</span></div>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0B1F3A] p-8 rounded-[2.5rem] text-white flex flex-col justify-center items-center text-center shadow-xl border-b-4 border-[#D4AF37]">
                  <p className="text-xl italic font-bold">"99% Client Success Record"</p>
                </div>
                <img src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80" alt="Resort" className="rounded-[2.5rem] h-48 w-full object-cover shadow-lg" />
                <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80" alt="Travel" className="rounded-[2.5rem] h-48 w-full object-cover shadow-lg" />
                <div className="bg-white p-8 rounded-[2.5rem] border border-[#D4AF37] flex flex-col justify-center items-center text-center shadow-xl">
                  <h3 className="text-4xl font-bold text-[#0B1F3A]">10K+</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">Annual Applicants</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- PREMIUM FEATURES STRIP --- */}
        <section className="bg-white py-24 relative overflow-hidden border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: <ShieldCheck size={32} />, title: "Secure Path",    desc: "Premium Vetting" },
              { icon: <Users size={32} />,       title: "Direct Dispatch", desc: "Embassy Liaison" },
              { icon: <Calendar size={32} />,    title: "Intake Control", desc: "2026 Ready" },
              { icon: <Mail size={32} />,        title: "24/7 Support",   desc: "Global Concierge" },
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="text-[#D4AF37] flex justify-center mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h4 className="text-[#0B1F3A] font-bold uppercase italic text-sm mb-2">{item.title}</h4>
                <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- CONTACT CTA --- */}
        <section className="py-24 text-center bg-[#FDFDFD]">
          <h2 className="text-3xl font-black text-[#0B1F3A] uppercase italic mb-4">Ready to Begin?</h2>
          <p className="text-slate-400 text-sm mb-12 uppercase tracking-widest">Connect with a Senior Consultant Today</p>
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="https://wa.me/8801348992268"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-10 py-5 bg-[#25D366] text-white rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-xl hover:-translate-y-1 transition-all"
            >
              <Phone size={18} /> WhatsApp Booking
            </a>
            <a
              href="mailto:supplyinfo365@gmail.com"
              className="flex items-center gap-3 px-10 py-5 bg-[#0B1F3A] text-white rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-xl hover:-translate-y-1 transition-all"
            >
              <Mail size={18} /> Email Reservation
            </a>
          </div>
        </section>

      </div>
    </>
  );
};

export default Visa;