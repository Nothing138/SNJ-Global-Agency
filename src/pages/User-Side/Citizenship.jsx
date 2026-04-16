import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import FloatingButton from './FloatingButton';
import { 
  Globe, ChevronRight, Phone, MessageCircle, 
  CheckCircle2, ShieldCheck, Zap, ClipboardList, 
  CreditCard, Ticket, PlaneTakeoff, FileText, 
  AlertCircle, Users, Calendar, Mail, Lock 
} from 'lucide-react';

const Citizenship = () => {
    const navigate = useNavigate();

    const programs = [
        { id: "antigua", name: "Antigua and Barbuda",desc: "One of the most competitive citizenship programs in the Caribbean." },
        { id: "argentina", name: "Argentina",  desc: "Currently under development and will launch in the second half of 2026." },
        { id: "austria", name: "Austria",  desc: "Prospective citizens can demonstrate extraordinary achievements that benefit Austria." },
        { id: "dominica", name: "Dominica",  desc: "Offers an attractive citizenship program with a real estate investment option." },
        { id: "egypt", name: "Egypt",  desc: "Benefit from the country's transcontinental position between Africa and Asia." },
        { id: "grenada", name: "Grenada",  desc: "Holds an E-2 treaty with the USA, allowing citizens to apply for a non-immigrant visa." },
        { id: "jordan", name: "Jordan",  desc: "Grants investors access to a business-friendly location and peaceful Arab country." },
        { id: "malta", name: "Malta",  desc: "Provides a legal framework for citizenship by merit for exceptional service." },
        { id: "montenegro", name: "Montenegro", desc: "Program was concluded on 31 December 2022. Contact us for alternatives." },
        { id: "nauru", name: "Nauru", desc: "Offers a secure second citizenship and an opportunity to support climate resilience." },
        { id: "macedonia", name: "North Macedonia", desc: "Offers foreign nationals the opportunity to acquire citizenship in SE Europe." },
        { id: "sao-tome", name: "São Tomé and Príncipe", desc: "Grants citizenship to investors and their families for a donation to the National Fund." },
        { id: "st-kitts", name: "St. Kitts and Nevis",  desc: "Has one of the strongest passports among all the Caribbean citizenship programs." },
        { id: "st-lucia", name: "St. Lucia", desc: "Offers a real estate development option and visa-free access to over 140 destinations." },
        { id: "turkiye", name: "Türkiye",  desc: "Provides links to both Asia and Europe with access to markets in both regions." },
    ];

    return (
        <div className="min-h-screen bg-[#FDFDFD] font-['Times_New_Roman',_serif] selection:bg-[#EAB308]/30 overflow-x-hidden">
            <FloatingButton />
            
            {/* --- HERO SECTION --- */}
            <section className="pt-44 pb-24 px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="flex-1">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-[1px] bg-[#EAB308]"></div>
                        <span className="text-[#EAB308] font-bold uppercase tracking-[0.5em] text-[11px] block italic">Premium Citizenship Services</span>
                    </div>
                    <h1 className="text-[30px] lg:text-[40px] font-black text-[#0B1F3A] leading-[1.1] mb-8 tracking-tight">
                        Unlock Global <span className="italic font-light text-[#EAB308]">Citizenship</span> <br /> 
                        <span className="text-[#0B1F3A]/90">Through Trusted Investment Pathways.</span>
                    </h1>
                    <p className="text-[#64748B] text-[19px] leading-[1.7] mb-12 max-w-xl font-light">
                        Alternative <span className="text-[#0B1F3A] font-medium border-b border-[#EAB308]/30">citizenship</span> opens global mobility, enabling seamless travel and residence in world-class destinations.
                    </p>
                    <button onClick={() => navigate('/contact')} className="relative overflow-hidden group border-2 border-[#0B1F3A] text-[#0B1F3A] px-12 py-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500">
                        <span className="relative z-10 group-hover:text-white transition-colors">Private Client Enquiry</span>
                        <div className="absolute inset-0 bg-[#0B1F3A] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500"></div>
                    </button>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }} className="flex-1 w-full relative">
                    <div className="absolute -top-4 -right-4 w-full h-full border border-[#EAB308]/20 -z-10 rounded-sm"></div>
                    <div className="relative aspect-[4/3] lg:h-[550px] w-full bg-white rounded-sm overflow-hidden shadow-2xl group border border-[#E5E7EB]">
                        <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80" alt="Global Citizens" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" />
                    </div>
                </motion.div>
            </section>

            {/* --- COUNTRIES GRID --- */}
            <section className="py-32 px-8 max-w-7xl mx-auto border-t border-[#F1F5F9]">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
                    <div>
                        <span className="text-[#EAB308] font-bold text-[10px] uppercase tracking-[0.4em] mb-3 block">Curated Selection</span>
                        <h2 className="text-[38px] font-bold text-[#0B1F3A]">Investment Options</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
                    {programs.map((p, i) => (
                        <motion.div 
                            key={i} 
                            whileHover={{ y: -10 }} 
                            onClick={() => navigate(`/citizenship/${p.id}`)} 
                            className="group cursor-pointer border-b border-[#E5E7EB] pb-10 hover:border-[#0B1F3A] transition-all"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="p-3 bg-[#F8FAFC] group-hover:bg-[#0B1F3A] transition-colors rounded-sm">
                                    <Globe className="text-[#EAB308]" size={24} />
                                </div>
                                <span className="text-[10px] font-black text-[#64748B] uppercase tracking-[0.2em]">Details <ChevronRight size={12} className="inline ml-1" /></span>
                            </div>
                            <h3 className="text-[24px] font-bold text-[#0B1F3A] mb-4">{p.name}</h3>
                            <p className="text-[#64748B] text-[15px] leading-[1.8] mb-8 font-light line-clamp-2">{p.desc}</p>
                            
                            {/* Displaying Price Directly */}
                            <div className="h-8 flex items-center">
                                <span className="text-[13px] font-black text-[#0B1F3A] uppercase tracking-widest bg-[#EAB308]/10 px-3 py-1 rounded">
                                    {p.cost}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>


            {/* --- BOOKING PROCEDURE SECTION --- */}
            <section className="py-24 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-[#0B1F3A] uppercase italic">Seamless <span className="text-[#EAB308]">Procedure</span></h2>
                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em] mt-2">How we bring your dream to life</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[
                            { icon: <ClipboardList />, step: "01", title: "Consultation", desc: "Expert assessment of your eligibility and objectives." },
                            { icon: <CreditCard />, step: "02", title: "Retainer", desc: "Initiate your case with a formal service agreement." },
                            { icon: <Ticket />, step: "03", title: "Submission", desc: "Comprehensive handling of all government filings." },
                            { icon: <PlaneTakeoff />, step: "04", title: "Approval", desc: "Secure your new citizenship and global freedom." }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                                <div className="text-[#EAB308] mb-6 transform group-hover:scale-110 transition-all">{item.icon}</div>
                                <span className="absolute top-8 right-8 text-6xl font-black text-slate-200 group-hover:text-[#EAB308]/10 transition-colors">{item.step}</span>
                                <h4 className="text-xl font-black text-[#0B1F3A] uppercase italic mb-3">{item.title}</h4>
                                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
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


            {/* --- PREMIUM FEATURES STRIP --- */}
            <section className="bg-white py-24 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12">
                    {[
                        { icon: <ShieldCheck size={32} />, title: "Secure Case", desc: "Confidential Handling" },
                        { icon: <Users size={32} />, title: "VIP Concierge", desc: "Private Handling" },
                        { icon: <Calendar size={32} />, title: "Flexible", desc: "Strategy Updates" },
                        { icon: <Mail size={32} />, title: "24/7 Support", desc: "Global Response" }
                    ].map((item, i) => (
                        <div key={i} className="text-center group">
                            <div className="text-[#EAB308] flex justify-center mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                            <h4 className="text-[#0B1F3A] font-bold uppercase italic text-sm mb-2">{item.title}</h4>
                            <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- FINAL CONTACT CTA --- */}
            <section className="py-20 text-center bg-[#FDFDFD]">
                <h2 className="text-3xl font-black text-[#0B1F3A] uppercase italic mb-10">Start your journey today</h2>
                <div className="flex flex-wrap justify-center gap-6">
                    <a href="https://wa.me/+880 1348-992268" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-10 py-5 bg-[#25D366] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:-translate-y-1 transition-all">
                        <Phone size={18} /> WhatsApp Booking
                    </a>
                    <a href="mailto:directorsnj932@gmail.com" className="flex items-center gap-3 px-10 py-5 bg-[#0B1F3A] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:-translate-y-1 transition-all">
                        <Mail size={18} /> Email Reservation
                    </a>
                </div>
            </section>
        </div>
    );
};

export default Citizenship;