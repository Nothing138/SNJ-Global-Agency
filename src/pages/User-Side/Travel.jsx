import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, ArrowRight, Globe, ShieldCheck, Camera, Users, Sparkles, 
  Calendar, Clock, CheckCircle2, Phone, Mail, ChevronRight,
  ClipboardList, CreditCard, Ticket, PlaneTakeoff, Award, Zap, FileText, AlertCircle
} from 'lucide-react';
import FloatingButton from './FloatingButton';

const Travel = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFullPolicy, setShowFullPolicy] = useState(false);

  const countries = [
    { name: "Azerbaijan", code: "AZ", duration: "5D/4N", highlights: "Baku & Gabala Tour" },
    { name: "Cambodia", code: "KH", duration: "5D/4N", highlights: "Angkor Wat Adventure" },
    { name: "China", code: "CN", duration: "8D/7N", highlights: "Beijing & Shanghai Elite" },
    { name: "France", code: "FR", duration: "7D/6N", highlights: "Paris & Riviera Luxury" },
    { name: "Indonesia", code: "ID", duration: "5D/4N", highlights: "Bali Luxury Escape" },
    { name: "Japan", code: "JP", duration: "7D/6N", highlights: "Tokyo, Kyoto & Osaka" },
    { name: "Laos", code: "LA", duration: "4D/3N", highlights: "Luang Prabang Heritage" },
    { name: "Malaysia", code: "MY", duration: "4D/3N", highlights: "Kuala Lumpur & Genting" },
    { name: "Nepal", code: "NP", duration: "4D/3N", highlights: "Kathmandu & Pokhara" },
    { name: "Philippines", code: "PH", duration: "6D/5N", highlights: "Boracay Island Dream" },
    { name: "Singapore", code: "SG", duration: "4D/3N", highlights: "Sentosa & Marina Bay" },
    { name: "Southkorea", code: "KR", duration: "6D/5N", highlights: "Seoul & Nami Island" },
    { name: "Spain", code: "ES", duration: "8D/7N", highlights: "Madrid & Barcelona Art" },
    { name: "Srilanka", code: "LK", duration: "5D/4N", highlights: "Colombo & Kandy Beauty" },
    { name: "Thailand", code: "TH", duration: "5D/4N", highlights: "Bangkok & Pattaya Special" },
    { name: "Turkiye", code: "TR", duration: "7D/6N", highlights: "Istanbul & Cappadocia" }
  ];

  const filteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-['Times_New_Roman',_serif]">
      <FloatingButton />

      {/* --- HERO SECTION --- */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80" 
            className="w-full h-full object-cover scale-105" 
            alt="Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1F3A]/80 via-[#0B1F3A]/40 to-[#FDFDFD]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="relative z-10 text-center px-6"
        >
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-[#0B1F3A]/40 backdrop-blur-xl border border-white/20 rounded-full text-white text-[12px] font-bold uppercase tracking-[0.3em] mb-8">
            <Sparkles size={14} className="text-[#D4AF37]" /> Premium Experiences 2026
          </div>
          
          <h1 className="text-6xl lg:text-[10rem] font-bold text-white uppercase tracking-tighter leading-[0.85] mb-8 italic">
            Beyond <br /> 
            <span className="text-transparent border-t-2 border-b-2 border-[#D4AF37] py-2 px-4 not-italic">
              Horizons
            </span>
          </h1>
        </motion.div>
      </section>

      {/* --- EXCLUSIVE PACKAGES SECTION --- */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-4">
            <h2 className="text-[40px] font-bold text-[#0B1F3A] uppercase leading-none italic">
              Exclusive <br /> <span className="text-[#D4AF37]">Packages</span>
            </h2>
            <div className="h-1.5 w-32 bg-[#D4AF37] rounded-full" />
          </div>
          
          <div className="relative w-full md:w-80">
            <input 
              type="text" 
              placeholder="Search destination..." 
              className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all text-sm shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredCountries.map((country, index) => (
              <motion.div
                key={country.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all relative overflow-hidden flex flex-col justify-between h-[340px]"
              >
                <div className="flex justify-between items-start">
                  <div className="w-20 h-20 rounded-3xl overflow-hidden border-4 border-slate-50 shadow-inner group-hover:scale-110 transition-transform">
                    <img 
                      src={`https://flagcdn.com/w160/${country.code.toLowerCase()}.png`} 
                      alt={country.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1">
                      <Clock size={12} className="text-[#D4AF37]" /> {country.duration}
                    </div>
                    <span className="text-[#0B1F3A] font-black text-[9px] uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-lg">
                      Curated Tour
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center gap-2 text-[#D4AF37] mb-2 font-bold uppercase tracking-[0.2em] text-[10px]">
                    <MapPin size={12} /> Global Destination
                  </div>
                  <h3 className="text-3xl font-black text-[#0B1F3A] uppercase tracking-tighter leading-none group-hover:text-[#D4AF37] transition-colors">
                    {country.name}
                  </h3>
                  <p className="text-slate-500 mt-3 text-sm italic font-medium">
                    {country.highlights}
                  </p>
                </div>

                <button 
                  onClick={() => navigate(`/travel-details/${country.name.toLowerCase()}`)}
                  className="mt-6 flex items-center gap-3 text-[#0B1F3A] font-black uppercase text-[10px] tracking-[0.2em] group/btn"
                >
                  View Itinerary <ArrowRight size={16} className="text-[#D4AF37] group-hover/btn:translate-x-2 transition-transform" />
                </button>

                <div className="absolute -right-6 -bottom-6 opacity-[0.03] pointer-events-none group-hover:rotate-12 transition-transform">
                  <Globe size={180} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* --- WHY CHOOSE US SECTION --- */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-[#0B1F3A] mb-6 uppercase tracking-tight italic">
              Why Choose <span className="text-[#D4AF37]">SNJ GlobalRoutes?</span>
            </h2>
            <p className="text-[#64748B] text-lg italic mb-10 leading-relaxed">
              As a premier luxury travel facilitator, we don't just book trips—we engineer memories. 
              Our 2026 collection represents the pinnacle of global exploration.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-[#D4AF37]" size={20}/>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0B1F3A]">Certified Excellence</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="text-[#D4AF37]" size={20}/>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0B1F3A]">15+ Global Hubs</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-[#D4AF37]" size={20}/>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0B1F3A]">Secure Logistics</span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="text-[#D4AF37]" size={20}/>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0B1F3A]">Rapid Processing</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0B1F3A] p-8 rounded-[2.5rem] text-white flex flex-col justify-center items-center text-center shadow-xl border-b-4 border-[#D4AF37]">
                <p className="text-xl italic font-bold">"99% Client Satisfaction Record"</p>
              </div>
              <img src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80" alt="Resort" className="rounded-[2.5rem] h-48 w-full object-cover shadow-lg" />
              <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80" alt="Travel" className="rounded-[2.5rem] h-48 w-full object-cover shadow-lg" />
              <div className="bg-white p-8 rounded-[2.5rem] border border-[#D4AF37] flex flex-col justify-center items-center text-center shadow-xl">
                <h3 className="text-4xl font-bold text-[#0B1F3A]">10K+</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">Annual Travelers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION --- 
      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-[#0B1F3A] uppercase italic mb-2">Looking for <span className="text-[#D4AF37]">Inspiration?</span></h2>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mb-16">Real stories from our global clients</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center text-center group hover:-translate-y-2 transition-all">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-6 border-4 border-slate-50">
                  <img src={t.img} alt={t.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                </div>
                <h4 className="text-[#D4AF37] font-bold uppercase text-xs mb-3 italic">{t.name}</h4>
                <p className="text-slate-500 text-[13px] leading-relaxed italic">"{t.text}"</p>
              </div>
            ))}
          </div>
          <button className="mt-12 bg-[#D4AF37] text-white px-8 py-3 rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-[#0B1F3A] transition-colors">
            View All Testimonials
          </button>
        </div>
      </section>*/}

      {/* --- BOOKING PROCEDURE SECTION --- */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-[#0B1F3A] uppercase italic">Seamless <span className="text-[#D4AF37]">Procedure</span></h2>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em] mt-2">How we bring your dream to life</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { icon: <ClipboardList />, step: "01", title: "Select Package", desc: "Choose your destination from our curated 2026 fleet." },
              { icon: <CreditCard />, step: "02", title: "Deposit", desc: "Secure your booking with a formal initial deposit." },
              { icon: <Ticket />, step: "03", title: "Documentation", desc: "We process your Visa, Hotel & Flight confirmations." },
              { icon: <PlaneTakeoff />, step: "04", title: "Departure", desc: "Receive your final travel kit and begin the journey." }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                <div className="text-[#D4AF37] mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all">{item.icon}</div>
                <span className="absolute top-8 right-8 text-6xl font-black text-slate-200 group-hover:text-[#D4AF37]/10 transition-colors">{item.step}</span>
                <h4 className="text-xl font-black text-[#0B1F3A] uppercase italic mb-3">{item.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- REFUND POLICY SECTION --- 
      <section className="py-20 bg-[#0B1F3A] text-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-8">
            <FileText className="text-[#D4AF37]" size={32} />
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Refund & Cancellation <span className="text-[#D4AF37]">Policy</span></h2>
          </div>
          
          <div className="space-y-6 text-slate-300 text-sm leading-relaxed font-sans">
            <p className="border-l-4 border-[#D4AF37] pl-4 italic">AtoZ Serwis Plus does not provide refunds for early service withdrawals, regardless of the circumstances.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <h4 className="text-[#D4AF37] font-bold uppercase text-[10px] tracking-widest mb-4 flex items-center gap-2">
                  <AlertCircle size={14}/> Key Terms
                </h4>
                <ul className="space-y-3 text-[12px]">
                  <li>• Refund percentages apply to the entire service fee, not just the amount paid.</li>
                  <li>• 35 working days processing time for valid refund claims.</li>
                  <li>• Zero-tolerance policy for chargebacks (leads to permanent ban).</li>
                </ul>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <h4 className="text-[#D4AF37] font-bold uppercase text-[10px] tracking-widest mb-4 flex items-center gap-2">
                   <ShieldCheck size={14}/> Non-Refundable Items
                </h4>
                <ul className="space-y-3 text-[12px]">
                  <li>• Service charges for third-party delays (couriers, etc).</li>
                  <li>• Fees paid to Assessing Bodies or Immigration Authorities.</li>
                  <li>• Consultation taxes are strictly non-refundable.</li>
                </ul>
              </div>
            </div>

            {showFullPolicy && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pt-6 space-y-4 border-t border-white/10 mt-6"
              >
                <p>9. When paying through net banking or credit card, the applicant agrees not to dispute the charge or request a chargeback.</p>
                <p>10. Service charges are based on company standards, not market prices. Complaints about costs after registration will not be considered.</p>
                <p>13. A refund can only be issued if the visa is accepted for specific documented reasons within 3 months of registration.</p>
              </motion.div>
            )}

            <button 
              onClick={() => setShowFullPolicy(!showFullPolicy)}
              className="mt-4 text-[#D4AF37] font-bold uppercase text-[10px] tracking-[0.3em] flex items-center gap-2 hover:underline"
            >
              {showFullPolicy ? "Show Less" : "Read Full Policy Details"} <ChevronRight size={14} className={showFullPolicy ? "rotate-90" : ""} />
            </button>
          </div>
        </div>
      </section>*/}

      {/* --- PREMIUM FEATURES STRIP --- */}
      <section className="bg-white py-24 relative overflow-hidden border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { icon: <ShieldCheck size={32} />, title: "Secure Trip", desc: "Premium Coverage" },
            { icon: <Users size={32} />, title: "VIP Access", desc: "Skip-the-line" },
            { icon: <Calendar size={32} />, title: "Flexible", desc: "Easy Rescheduling" },
            { icon: <Mail size={32} />, title: "24/7 Support", desc: "Global Concierge" }
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
      <section className="py-20 text-center bg-[#FDFDFD]">
          <h2 className="text-3xl font-black text-[#0B1F3A] uppercase italic mb-10">Start your journey today</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="https://wa.me/8801348992268" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-10 py-5 bg-[#25D366] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
              <Phone size={18} /> WhatsApp Booking
            </a>
            <a href="mailto:supplyinfo365@gmail.com" className="flex items-center gap-3 px-10 py-5 bg-[#0B1F3A] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
              <Mail size={18} /> Email Reservation
            </a>
          </div>
      </section>
    </div>
  );
};

export default Travel;