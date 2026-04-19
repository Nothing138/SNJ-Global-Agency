//citizenship details
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { citizenshipData } from '../../constants/citizenshipData';
import FloatingButton from './FloatingButton';
import emailjs from '@emailjs/browser';
import { 
    ArrowLeft, Clock, Landmark, Globe2, Award, 
    HelpCircle, Plus, Minus, ShieldCheck, Phone, 
    CheckCircle2, Globe, Zap, Mail 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CitizenshipDetail = () => {
    const { countryId } = useParams();
    const navigate = useNavigate();
    const data = citizenshipData[countryId];
    
    const [activeFaq, setActiveFaq] = useState(null);
    const [loading, setLoading] = useState(false); 
    const [formData, setFormData] = useState({
        name: '', contact: '', passport: '', nationality: ''
    });

    const handleBooking = (e) => {
        e.preventDefault();
        setLoading(true);

        const templateParams = {
            user_name: formData.name,
            user_contact: formData.contact,
            user_passport: formData.passport,
            user_nationality: formData.nationality,
            package_name: data.name,
            request_type: "Citizenship/Travel Inquiry" 
        };

        emailjs.send(
            'service_lyaj90m',    
            'template_jcvorut',   
            templateParams,
            'fBmCBPjkDCPx48ro6'    
        )
        .then((result) => {
            alert("Thank you! Your application has been submitted successfully. Our team will contact you shortly.");
            setFormData({ name: '', contact: '', passport: '', nationality: '' });
        })
        .catch((error) => {
            alert("Failed to send message. Please check your connection.");
            console.error(error);
        })
        .finally(() => setLoading(false));
    };

    if (!data) return (
        <div className="h-screen flex items-center justify-center bg-[#0B1F3A]">
            <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-t-2 border-[#EAB308] rounded-full"
            />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-['Times_New_Roman',_serif]">
            
            <FloatingButton />

            {/* --- HERO SECTION --- */}
            <section className="relative min-h-[70vh] flex items-center pt-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src={data.heroImage} className="w-full h-full object-cover opacity-10 scale-105" alt="Background" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC] via-transparent to-[#F8FAFC]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-8 relative z-10 grid lg:grid-cols-12 gap-16 items-center">
                    <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-7 space-y-8">
                        <button onClick={() => navigate('/citizenship')} className="group flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.3em] text-[#EAB308] hover:text-[#0B1F3A] transition-all">
                            <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Global Portfolio
                        </button>
                        
                        <div className="space-y-4">
                            <motion.div initial={{ width: 0 }} animate={{ width: "80px" }} className="h-1 bg-[#EAB308]"></motion.div>
                            <h1 className="text-[48px] font-bold text-[#0B1F3A] leading-[1.1] tracking-tight">
                                {data.name} <br />
                                <span className="text-[#EAB308] italic">Program.</span>
                            </h1>
                        </div>

                        <p className="text-[20px] text-[#64748B] font-light leading-[1.6] max-w-xl border-l-4 border-[#EAB308] pl-8 italic">
                            {data.tagline || data.overview.substring(0, 100) + "..."}
                        </p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="lg:col-span-5 relative">
                        <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-[12px] border-white relative group">
                            <img src={data.heroImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt={data.name} />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/60 to-transparent"></div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- MAIN CONTENT & SIDEBAR --- */}
            <section className="py-20 px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-12 gap-16">
                        
                        {/* LEFT CONTENT */}
                        <div className="lg:col-span-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#E5E7EB] rounded-2xl overflow-hidden border mb-20 shadow-lg">
                                {[
                                    { label: 'Visa-Free', value: data.investmentSummary.visaFree, icon: Globe2 },
                                    { label: 'Process', value: data.investmentSummary.timeframe, icon: Clock },
                                    { label: 'Tier', value: data.tier, icon: Award },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white p-8 flex flex-col items-center text-center group hover:bg-[#F8FAFC]">
                                        <stat.icon className="text-[#EAB308] mb-4" size={24} />
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-[#64748B] mb-1">{stat.label}</span>
                                        <span className="text-[16px] font-bold text-[#0B1F3A]">{stat.value}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-12">
                                <div>
                                    <span className="text-[#EAB308] font-bold text-[12px] uppercase tracking-[0.4em]">Strategic Advantages</span>
                                    <h2 className="text-[34px] font-bold text-[#0B1F3A] mt-4 leading-tight">Elite Privileges</h2>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {data.benefits.map((benefit, i) => (
                                        <motion.div key={i} whileHover={{ y: -5 }} className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm flex gap-4">
                                            <ShieldCheck className="text-[#EAB308] shrink-0" />
                                            <p className="text-[#64748B] text-[16px] italic">{benefit}</p>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="bg-[#0B1F3A] rounded-3xl p-10 text-white mt-16">
                                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                        <Landmark className="text-[#EAB308]" /> Statutory Criteria
                                    </h2>
                                    <ul className="grid md:grid-cols-2 gap-6">
                                        {data.requirements.map((req, i) => (
                                            <li key={i} className="flex gap-4 text-white/70 text-[15px]">
                                                <div className="h-2 w-2 bg-[#EAB308] rounded-full mt-2"></div>
                                                {req}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDEBAR (BOOKING FORM) */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-24 bg-white border-2 border-[#0B1F3A] p-8 rounded-3xl shadow-2xl">
                                <div className="text-center mb-8">
                                    <span className="bg-[#0B1F3A] text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Direct Inquiry</span>
                                    <h3 className="text-2xl font-bold mt-4 text-[#0B1F3A]">Get Consultation</h3>
                                    <p className="text-slate-500 text-xs mt-2 italic">Official {data.name} Application Portal</p>
                                </div>

                                <form className="space-y-4" onSubmit={handleBooking}>
                                    <input 
                                        type="text" 
                                        placeholder="Full Name" 
                                        required 
                                        value={formData.name} 
                                        className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:border-[#EAB308]" 
                                        onChange={(e)=>setFormData({...formData, name: e.target.value})} 
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Contact Number" 
                                        required 
                                        value={formData.contact} 
                                        className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:border-[#EAB308]" 
                                        onChange={(e)=>setFormData({...formData, contact: e.target.value})} 
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Passport Number" 
                                        required 
                                        value={formData.passport} 
                                        className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:border-[#EAB308]" 
                                        onChange={(e)=>setFormData({...formData, passport: e.target.value})} 
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Nationality" 
                                        required 
                                        value={formData.nationality} 
                                        className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:border-[#EAB308]" 
                                        onChange={(e)=>setFormData({...formData, nationality: e.target.value})} 
                                    />
                                    
                                    <button 
                                        type="submit" 
                                        disabled={loading} 
                                        className="w-full bg-[#0B1F3A] text-white font-bold py-5 rounded-2xl uppercase tracking-[0.2em] text-xs hover:bg-[#EAB308] hover:text-[#0B1F3A] transition-all disabled:bg-slate-500 shadow-lg mt-4"
                                    >
                                        {loading ? "Sending..." : "Confirm Booking"} 
                                    </button>
                                </form>
                                
                                <p className="text-[9px] text-center text-slate-400 mt-6 leading-relaxed uppercase tracking-wider">
                                    *Confidential portal for {data.name} residency & citizenship inquiries.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- WHY CHOOSE US SECTION --- */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl font-bold text-[#0B1F3A] mb-6 uppercase tracking-tight italic">
                            Why Choose <span className="text-[#EAB308]">SNJ GlobalRoutes?</span>
                        </h2>
                        <p className="text-[#64748B] text-lg italic mb-10 leading-relaxed">
                            As a premier consultancy, we don't just process applications—we engineer global futures. Our 2026 methodology represents the pinnacle of investment migration.
                        </p>
                        <div className="grid grid-cols-2 gap-8">
                            {[
                                { icon: <CheckCircle2 size={20}/>, label: "Certified Excellence" },
                                { icon: <Globe size={20}/>, label: "15+ Global Hubs" },
                                { icon: <ShieldCheck size={20}/>, label: "Secure Logistics" },
                                { icon: <Zap size={20}/>, label: "Rapid Processing" }
                            ].map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <span className="text-[#EAB308]">{feature.icon}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#0B1F3A]">{feature.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#0B1F3A] p-8 rounded-[2.5rem] text-white flex flex-col justify-center items-center text-center shadow-xl border-b-4 border-[#EAB308]">
                                <p className="text-xl italic font-bold">"99% Client Satisfaction Record"</p>
                            </div>
                            <img src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80" alt="Consultancy" className="rounded-[2.5rem] h-48 w-full object-cover shadow-lg" />
                            <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80" alt="Global" className="rounded-[2.5rem] h-48 w-full object-cover shadow-lg" />
                            <div className="bg-white p-8 rounded-[2.5rem] border border-[#EAB308] flex flex-col justify-center items-center text-center shadow-xl">
                                <h3 className="text-4xl font-bold text-[#0B1F3A]">10K+</h3>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">Successful Applications</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FAQ SECTION --- */}
            <section className="py-24 px-8 bg-white relative overflow-hidden">
    <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
            <HelpCircle className="mx-auto text-[#EAB308] mb-6" size={48} strokeWidth={1.5} />
            <h2 className="text-[40px] font-bold mb-4 text-[#0B1F3A]">
                Expert <span className="text-[#EAB308] italic">Intelligence</span>
            </h2>
            <div className="h-1 w-20 bg-[#EAB308] mx-auto rounded-full"></div>
        </div>

        {/* Questions List */}
        <div className="space-y-2">
            {[
                { 
                    q: "What is Citizenship by Investment (CBI)?", 
                    a: "Citizenship by Investment (CBI) is a legal program that allows individuals to obtain a second citizenship by making a qualified investment in a country’s economy, such as a government fund or real estate." 
                },
                { 
                    q: "Which countries offer Citizenship by Investment programs?", 
                    a: "Several countries offer CBI programs, including Dominica, St. Kitts & Nevis, Grenada, Antigua & Barbuda, and others. Each country has its own requirements and benefits." 
                },
                { 
                    q: "Who is eligible to apply for this program?", 
                    a: "Any individual who meets the financial requirements, has a clean criminal record, and passes due diligence checks is generally eligible to apply." 
                },
                { 
                    q: "How long does the citizenship process take?", 
                    a: "The process usually takes between 3 to 6 months, depending on the country and the completeness of your documents." 
                },
                { 
                    q: "Can I live and work in the country after getting citizenship?", 
                    a: "Yes, you have full rights to live, work, and do business in the country." 
                },
                { 
                    q: "Which countries can I travel to visa-free?", 
                    a: "Depending on the passport, you can travel visa-free or with visa-on-arrival to 120+ countries, including Schengen areas, the UK, and more." 
                },
                { 
                    q: "Will I get a passport immediately after approval?", 
                    a: "Yes, once your citizenship is approved, your passport is issued within a few weeks." 
                },
                { 
                    q: "Can I keep my current citizenship?", 
                    a: "Yes, most CBI countries allow dual citizenship, so you can keep your original nationality." 
                }
            ].map((faq, i) => (
                <div key={i} className="border-b border-slate-100">
                    <button 
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

export default CitizenshipDetail;