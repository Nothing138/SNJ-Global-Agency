//traveldetals
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { travelData } from '../../constants/travelData';
import { 
  CheckCircle, ShieldCheck, FileText, Camera, XCircle, 
  CheckCircle2, Globe, Zap, ClipboardList, CreditCard, 
  Ticket, PlaneTakeoff, Users, Calendar, Mail, Phone,
  HelpCircle, Plus, Minus // Added missing icons here
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // Ensure framer-motion is imported
import FloatingButton from './FloatingButton';
import emailjs from '@emailjs/browser'; 

const TravelDetails = () => {
  const { countryName } = useParams();
  const navigate = useNavigate();
  const [guests, setGuests] = useState(1);
  const [isSending, setIsSending] = useState(false); 
  const [activeFaq, setActiveFaq] = useState(null); // Added missing state for FAQ

  const [formData, setFormData] = useState({
    name: '', contact: '', passport: '', nationality: ''
  });

  const data = travelData[countryName?.toLowerCase()];
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!data) return <div className="p-20 text-center font-bold">Package Not Found...</div>;

  const handleBooking = (e) => {
    e.preventDefault();
    setIsSending(true);

    const templateParams = {
      user_name: formData.name,
      user_contact: formData.contact,
      user_passport: formData.passport,
      user_nationality: formData.nationality,
      package_name: data.title,
      total_guests: guests,
      request_type: "Travel Booking" 
    };

    emailjs.send(
      'service_lyaj90m',    
      'template_jcvorut',   
      templateParams,
      'fBmCBPjkDCPx48ro6'     
    )
    .then((response) => {
      alert("Thank you! Your booking request has been received. We will be in touch shortly.");
      setIsSending(false);
    })
    .catch((err) => {
      alert("Sorry, there was a problem. Please try again.");
      setIsSending(false);
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-serif text-[#0B1F3A]">
      <FloatingButton />
      
      {/* HERO SECTION */}
      <div className="h-[60vh] relative">
        <img src={data.images[0]} className="w-full h-full object-cover" alt="Hero" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] to-transparent" />
        <div className="absolute bottom-10 left-10 text-white">
          <h1 className="text-6xl font-black uppercase italic">{data.title}</h1>
          <p className="text-[#D4AF37] font-bold tracking-widest mt-2">{data.duration} | 2026 Exclusive Edition</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT SIDE - CONTENT (70%) */}
          <div className="lg:col-span-2 space-y-16">
            <section>
              <h2 className="text-3xl font-black uppercase italic mb-6 border-b-4 border-[#D4AF37] inline-block">About This Trip</h2>
              <p className="text-xl text-slate-600 leading-relaxed italic">"{data.description}"</p>
            </section>

            <section className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><ShieldCheck className="text-[#D4AF37]" /> Why Choose Us?</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {data.whyChooseUs.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 font-bold text-sm uppercase">
                    <CheckCircle size={16} className="text-[#D4AF37]" /> {item}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-black uppercase italic mb-10 text-center">Day-to-Day Journey</h2>
              <div className="space-y-6">
                {data.itinerary.map((item, i) => (
                  <div key={i} className="flex gap-8 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                    <span className="text-4xl font-black text-[#D4AF37]">D{item.day}</span>
                    <div>
                      <h4 className="text-xl font-bold uppercase italic">{item.title}</h4>
                      <p className="text-slate-500 mt-2">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid md:grid-cols-2 gap-8">
              <div className="bg-green-50 p-8 rounded-[2rem]">
                <h3 className="font-bold text-green-700 uppercase mb-4 flex items-center gap-2"><CheckCircle size={20}/> We Provide</h3>
                <ul className="space-y-2 text-sm font-medium italic">
                  {data.inclusions.map((x, i) => <li key={i}>+ {x}</li>)}
                </ul>
              </div>
              <div className="bg-red-50 p-8 rounded-[2rem]">
                <h3 className="font-bold text-red-700 uppercase mb-4 flex items-center gap-2"><XCircle size={20}/> Not Included</h3>
                <ul className="space-y-2 text-sm font-medium italic">
                  {data.exclusions.map((x, i) => <li key={i}>- {x}</li>)}
                </ul>
              </div>
            </section>

            <section className="p-10 border-2 border-dashed border-slate-200 rounded-[3rem]">
              <h3 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-3"><FileText /> Required Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.requirements.map((doc, i) => (
                  <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 font-bold text-xs uppercase tracking-widest text-slate-500">
                    {doc}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-black uppercase italic mb-10 text-center flex items-center justify-center gap-3">
                <Camera className="text-[#D4AF37]" /> Attractions
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {data.popularPlaces.map((place, i) => (
                  <div key={i} className="relative group overflow-hidden rounded-[2.5rem]">
                    <img src={place.img} className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700" alt={place.name} />
                    <div className="absolute bottom-6 left-6">
                      <span className="bg-[#D4AF37] text-white px-6 py-2 rounded-full font-bold uppercase text-[10px] tracking-widest">{place.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT SIDE - SIDEBAR FORM */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-[#0B1F3A] text-white p-10 rounded-[3rem] shadow-2xl border-b-8 border-[#D4AF37]">
              <h3 className="text-[#D4AF37] font-black uppercase tracking-widest text-center mb-6">Direct Reservation</h3>
              <form className="space-y-4" onSubmit={handleBooking}>
                <input type="text" placeholder="Full Name" required className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#D4AF37]" onChange={(e)=>setFormData({...formData, name: e.target.value})} />
                <input type="text" placeholder="Contact Number" required className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#D4AF37]" onChange={(e)=>setFormData({...formData, contact: e.target.value})} />
                <input type="text" placeholder="Passport Number" required className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#D4AF37]" onChange={(e)=>setFormData({...formData, passport: e.target.value})} />
                <input type="text" placeholder="Nationality" required className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#D4AF37]" onChange={(e)=>setFormData({...formData, nationality: e.target.value})} />
                <div className="py-4 border-t border-white/10 mt-6">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Total Persons</label>
                  <input type="number" min="1" value={guests} className="w-full bg-white/10 p-4 rounded-2xl font-bold text-black outline-none" onChange={(e)=>setGuests(e.target.value)} />
                </div>

                <button type="submit" disabled={isSending} className="w-full bg-[#D4AF37] text-black font-black py-5 rounded-2xl uppercase tracking-[0.2em] text-xs hover:bg-white transition-all disabled:bg-slate-500">
                  {isSending ? "Sending..." : "Confirm Booking"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

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


        {/* --- TRAVEL FAQ SECTION START --- */}
        <section className="py-24 px-8 bg-white relative overflow-hidden">
         <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <HelpCircle className="mx-auto text-[#EAB308] mb-6" size={48} strokeWidth={1.5} />
            <h2 className="text-[40px] font-bold mb-4 text-[#0B1F3A]">
                Travel <span className="text-[#EAB308] italic">Intelligence</span>
            </h2>
          <div className="h-1 w-20 bg-[#EAB308] mx-auto rounded-full"></div>
          </div>

          {/* Questions List */}
          <div className="space-y-2">
            {[
                { 
                    q: "What types of tour packages do you offer?", 
                    a: "We offer customized tour packages including family tours, honeymoon packages, group tours, and luxury travel experiences." 
                },
                { 
                    q: "Which countries are included in your tour packages?", 
                    a: "We provide tour packages for popular destinations such as Europe, Turkey, Dubai, Thailand, Malaysia, and more." 
                },
                { 
                    q: "Can I customize my travel package?", 
                    a: "Yes, all our tour packages can be fully customized based on your budget, preferences, and travel dates." 
                },
                { 
                    q: "What is included in a tour package?", 
                    a: "Tour packages usually include accommodation, transportation, guided tours, and sometimes meals depending on the plan." 
                },
                { 
                    q: "Do you provide hotel booking services?", 
                    a: "Yes, we provide hotel booking options ranging from budget to luxury accommodations." 
                },
                { 
                    q: "Do you arrange airport pickup and drop-off?", 
                    a: "Yes, we can arrange airport transfers for a smooth and comfortable travel experience." 
                },
                { 
                    q: "Are flights included in the tour package?", 
                    a: "Flights can be included upon request or booked separately based on your preference." 
                },
                { 
                    q: "Do I need a visa for tour packages?", 
                    a: "Yes, visa requirements depend on the destination, and we assist you with the full visa process." 
                },
                { 
                    q: "Is travel insurance included in the package?", 
                    a: "Travel insurance can be included upon request and is recommended for international trips." 
                },
                { 
                    q: "What is the payment process for booking a tour?", 
                    a: "You can confirm your booking with an initial deposit, and the remaining amount can be paid before travel." 
                },
                { 
                    q: "Can I cancel or reschedule my tour package?", 
                    a: "Yes, cancellation and rescheduling are possible depending on the terms and conditions of the package." 
                },
                { 
                    q: "Do you offer group discounts?", 
                    a: "Yes, we offer special discounts for group bookings depending on the number of travelers." 
                },
                { 
                    q: "Will there be a tour guide during the trip?", 
                    a: "Yes, guided tours are available for most destinations to enhance your travel experience." 
                },
                { 
                    q: "How early should I book my tour package?", 
                    a: "It is recommended to book at least 2–4 weeks in advance to secure the best deals and availability." 
                },
                { 
                    q: "Why should I choose your travel packages?", 
                    a: "We provide reliable service, customized planning, competitive pricing, and full support throughout your journey." 
                }
            ].map((faq, i) => (
                <div key={i} className="border-b border-slate-100">
                    <button 
                        type="button"
                        onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                        className="w-full py-7 flex items-center justify-between text-left group transition-all"
                    >
                        <span className={`text-[19px] font-bold transition-colors duration-300 ${activeFaq === i ? 'text-[#EAB308]' : 'text-[#0B1F3A] group-hover:text-[#EAB308]'}`}>
                            {faq.q}
                        </span>
                        <div className={`p-2 rounded-full transition-all duration-300 ${activeFaq === i ? 'bg-[#EAB308] text-white rotate-180' : 'bg-slate-50 text-slate-400'}`}>
                            {activeFaq === i ? <Minus size={18} /> : <Plus size={18} />}
                        </div>
                    </button>
                    
                    <AnimatePresence>
                        {activeFaq === i && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }} 
                                animate={{ height: "auto", opacity: 1 }} 
                                exit={{ height: 0, opacity: 0 }} 
                                className="overflow-hidden"
                            >
                                <p className="pb-8 text-slate-600 text-[17px] leading-relaxed max-w-3xl">
                                    {faq.a}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
          </div>
       </div>

        {/* Professional Background Accents */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-[#F8FAFC] rounded-full blur-3xl -z-10"></div>
         <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-[#FFFBEB] rounded-full blur-3xl -z-10"></div>
        </section>
        {/* --- TRAVEL FAQ SECTION END --- */}


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

export default TravelDetails;