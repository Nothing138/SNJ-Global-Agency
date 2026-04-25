//visa details
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { visaData } from '../../constants/visaData';

import FloatingButton from './FloatingButton';
import {
  CheckCircle2, ArrowLeft, Clock, FileText,
  Info, Phone, Mail, Send, X,
  Globe, Wallet, Star, Calendar,
  AlertCircle, Shield, MapPin, HelpCircle, Plus, Minus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────
    Reusable Sub-components
───────────────────────────────────────── */
const Badge = ({ children, gold }) => (
  <span
    className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
      gold
        ? 'bg-[#EAB308] text-[#0B1F3A]'
        : 'bg-[#0B1F3A]/10 text-[#0B1F3A]'
    }`}
  >
    {children}
  </span>
);

const SectionHeading = ({ label, accent }) => (
  <h3 className="text-2xl lg:text-3xl font-black text-[#0B1F3A] uppercase tracking-tight mb-6">
    {label} <span className="text-[#EAB308]">{accent}</span>
  </h3>
);

const CheckItem = ({ text }) => (
  <li className="flex gap-3 text-slate-600 font-medium text-sm leading-snug">
    <CheckCircle2 className="text-[#EAB308] shrink-0 mt-0.5" size={16} />
    {text}
  </li>
);

const InfoRow = ({ label, value }) =>
  value ? (
    <div className="flex justify-between items-start border-b border-white/5 pb-4 gap-4">
      <span className="text-white/50 text-[10px] font-black uppercase tracking-widest shrink-0">
        {label}
      </span>
      <span className="font-bold text-white text-sm text-right">{value}</span>
    </div>
  ) : null;

/* ─────────────────────────────────────────
    Main Component — VisitVisaDetail
───────────────────────────────────────── */
const VisitVisaDetail = () => {
  const { countryId } = useParams();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null); // Added for FAQ logic
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    passport: '',
    nationality: '',
    travelDate: '',
  });

  const data = visaData.find((v) => v.id === countryId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [countryId]);

  const faqData = [
    { q: "What is a visit visa?", a: "A visit visa allows you to travel to another country for tourism or visiting family and friends." },
    { q: "How long can I stay on a visit visa?", a: "Stay duration depends on the country, usually between 15 days to 6 months." },
    { q: "Which countries do you offer visit visas for?", a: "We provide visit visa services for Europe, UAE, Malaysia, Thailand, and more." },
    { q: "What documents are required for a visit visa?", a: "Passport, bank statement, travel plan, and sometimes invitation letter are required." },
    { q: "Do I need a bank statement?", a: "Yes, proof of financial stability is required." },
    { q: "How long does processing take?", a: "Usually 7 to 30 days depending on the country." },
    { q: "Do you provide travel itinerary?", a: "Yes, we assist with travel planning and itinerary preparation." },
    { q: "Is hotel booking required?", a: "Yes, proof of accommodation is often required." },
    { q: "Do I need travel insurance?", a: "Yes, many countries require valid travel insurance." },
    { q: "Can I extend my visit visa?", a: "Some countries allow extensions under certain conditions." },
    { q: "Can I convert visit visa to work visa?", a: "In some cases, it may be possible depending on the country." },
    { q: "Do you provide visa interview support?", a: "Yes, we guide you with interview preparation." },
    { q: "What if my visa is rejected?", a: "We help you understand the reason and reapply properly." },
    { q: "Can I travel multiple times with one visa?", a: "It depends on whether your visa is single-entry or multiple-entry." },
    { q: "Why should I apply through your agency?", a: "We ensure a smooth process, proper documentation, and high success rate." }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data) return;
    setIsSending(true);
    try {
      await emailjs.send(
        'service_lyaj90m',
        'template_jcvorut',
        {
          user_name: formData.name,
          user_contact: formData.contact,
          user_passport: formData.passport,
          user_nationality: formData.nationality,
          package_name: data.country,
          request_type: `Visit Visa Application${formData.travelDate ? ` — Travel: ${formData.travelDate}` : ''}`,
        },
        'fBmCBPjkDCPx48ro6'
      );
      alert('Application sent successfully! We will contact you soon.');
      setIsModalOpen(false);
      setFormData({ name: '', contact: '', passport: '', nationality: '', travelDate: '' });
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  if (!data) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white gap-4">
        <p className="text-[#0B1F3A] font-black text-2xl uppercase">Country Not Found</p>
        <p className="text-slate-500 text-sm">No visit visa data found for: <strong>{countryId}</strong></p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-6 py-3 bg-[#EAB308] text-[#0B1F3A] rounded-full font-black text-xs uppercase tracking-widest"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.55 },
  };

  const highlights = data.highlights || [];
  const bestFor = data.bestFor || [];
  const requirements = data.requirements || [];
  const nationalities = Array.isArray(data.eligibleNationalities) ? data.eligibleNationalities : [];
  const heroImageSrc = `/images/visit/${countryId}.jpg`;

  return (
    <div className="min-h-screen bg-white font-['Inter',_sans-serif] overflow-x-hidden">
      <FloatingButton />

      {/* APPLICATION MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#0B1F3A]/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 lg:p-10 relative z-10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={22} className="text-[#0B1F3A]" />
              </button>

              <div className="mb-8">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#EAB308]">
                  Visit Visa — {data.flag} {data.country}
                </span>
                <h3 className="text-2xl font-black text-[#0B1F3A] uppercase tracking-tight mt-1">
                  Start Your Application
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  Fill in your details and our visa team will contact you within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { placeholder: 'Full Name', key: 'name', type: 'text', required: true },
                  { placeholder: 'Contact Number', key: 'contact', type: 'tel', required: true },
                  { placeholder: 'Passport Number', key: 'passport', type: 'text', required: true },
                  { placeholder: 'Nationality', key: 'nationality', type: 'text', required: true },
                  { placeholder: 'Planned Travel Date', key: 'travelDate', type: 'text', required: false },
                ].map(({ placeholder, key, type: inputType, required: req }) => (
                  <div key={key}>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block mb-1">
                      {placeholder}{!req && <span className="text-slate-300 ml-1">(optional)</span>}
                    </label>
                    <input
                      required={req}
                      type={inputType}
                      placeholder={placeholder}
                      value={formData[key]}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-semibold text-[#0B1F3A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#EAB308] transition-all"
                    />
                  </div>
                ))}

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 mt-2">
                  <AlertCircle size={16} className="text-[#EAB308] shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 font-medium leading-relaxed">
                    Do not book non-refundable flights or accommodation until your visit visa approval is fully confirmed.
                  </p>
                </div>

                <button
                  disabled={isSending}
                  type="submit"
                  className="w-full bg-[#EAB308] text-[#0B1F3A] py-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-amber-400 transition-all disabled:opacity-50 mt-2"
                >
                  {isSending ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-[#0B1F3A] border-t-transparent rounded-full"
                      />
                      Sending…
                    </>
                  ) : (
                    <><Send size={14} /> Submit Application</>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <section className="relative pt-36 pb-16 overflow-hidden min-h-[420px]">
        {!imgError ? (
          <>
            <img
              src={heroImageSrc}
              alt={`Visit ${data.country}`}
              onError={() => setImgError(true)}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/90 via-[#0B1F3A]/70 to-[#0B1F3A]/30" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#EAB308]/5 rounded-full translate-x-1/2 -translate-y-1/4 pointer-events-none" />
          </>
        )}

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div {...fadeUp}>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-[#EAB308] font-bold text-[11px] uppercase tracking-[0.3em] mb-10 hover:gap-3 transition-all"
            >
              <ArrowLeft size={15} /> Back
            </button>

            <div className="flex flex-wrap gap-3 mb-6">
              <Badge gold>Visit Visa Program</Badge>
              {data.visaType && <Badge>{data.visaType}</Badge>}
              {data.region && <Badge>{data.region}</Badge>}
            </div>

            <h1 className={`text-5xl lg:text-8xl font-black leading-[0.9] tracking-tighter uppercase ${
              !imgError ? 'text-white' : 'text-[#0B1F3A]'
            }`}>
              {data.flag} {data.country}
              <span className="text-[#EAB308] italic font-light lowercase text-3xl lg:text-5xl block mt-3">
                Discover &amp; Explore
              </span>
            </h1>

            <div className="flex flex-wrap gap-6 mt-10">
              {data.processingTime && (
                <div className="flex items-center gap-2">
                  <Clock size={15} className="text-[#EAB308]" />
                  <span className={`text-xs font-bold uppercase tracking-wide ${!imgError ? 'text-white/80' : 'text-slate-600'}`}>
                    {data.processingTime}
                  </span>
                </div>
              )}
              {data.cost && (
                <div className="flex items-center gap-2">
                  <Wallet size={15} className="text-[#EAB308]" />
                  <span className={`text-xs font-bold uppercase tracking-wide ${!imgError ? 'text-white/80' : 'text-slate-600'}`}>
                    {data.cost}
                  </span>
                </div>
              )}
              {data.duration && (
                <div className="flex items-center gap-2">
                  <Calendar size={15} className="text-[#EAB308]" />
                  <span className={`text-xs font-bold uppercase tracking-wide ${!imgError ? 'text-white/80' : 'text-slate-600'}`}>
                    {data.duration}
                  </span>
                </div>
              )}
              {data.visaName && (
                <div className="flex items-center gap-2">
                  <Globe size={15} className="text-[#EAB308]" />
                  <span className={`text-xs font-bold uppercase tracking-wide ${!imgError ? 'text-white/80' : 'text-slate-600'}`}>
                    {data.visaName}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-14 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-[65%] space-y-16">
              {bestFor.length > 0 && (
                <motion.div {...fadeUp}>
                  <SectionHeading label="Best" accent="For." />
                  <div className="flex flex-wrap gap-3">
                    {bestFor.map((b, i) => (
                      <span key={i} className="flex items-center gap-2 px-4 py-2 bg-[#0B1F3A] text-white text-xs font-bold rounded-full">
                        <MapPin size={11} /> {b}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {highlights.length > 0 && (
                <motion.div {...fadeUp}>
                  <SectionHeading label="Why Visit" accent={`${data.country}?`} />
                  <ul className="space-y-3">
                    {highlights.map((h, i) => <CheckItem key={i} text={h} />)}
                  </ul>
                </motion.div>
              )}

              {requirements.length > 0 && (
                <motion.div {...fadeUp}>
                  <SectionHeading label="Main" accent="Requirements." />
                  <div className="grid sm:grid-cols-2 gap-3">
                    {requirements.map((req, i) => (
                      <div key={i} className="flex items-start gap-3 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-[#EAB308]/40 transition-all">
                        <FileText size={15} className="text-[#EAB308] shrink-0 mt-0.5" />
                        <span className="text-sm font-semibold text-slate-700 leading-snug">{req}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* FAQ SECTION */}
              <section className="py-12 border-t border-slate-100">
                <div className="text-center mb-12">
                  <HelpCircle className="mx-auto text-[#EAB308] mb-4" size={40} />
                  <h2 className="text-4xl font-bold text-[#0B1F3A]">Travel <span className="text-[#EAB308] italic">Intelligence</span></h2>
                </div>
                <div className="space-y-2">
                  {faqData.map((faq, i) => (
                    <div key={i} className="border-b border-slate-100">
                      <button 
                        onClick={() => setActiveFaq(activeFaq === i ? null : i)} 
                        className="w-full py-6 flex items-center justify-between text-left group"
                      >
                        <span className={`text-lg font-bold transition-colors ${activeFaq === i ? 'text-[#EAB308]' : 'text-[#0B1F3A]'}`}>{faq.q}</span>
                        <div className={`p-2 rounded-full ${activeFaq === i ? 'bg-[#EAB308] text-white' : 'bg-slate-50 text-slate-400'}`}>
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
                            <p className="pb-8 text-slate-600 text-[17px] leading-relaxed">{faq.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* SIDEBAR */}
            <aside className="lg:w-[35%]">
              <div className="sticky top-24 space-y-6">
                <div className="bg-[#0B1F3A] rounded-[2rem] p-8 text-white shadow-xl">
                  <h3 className="text-base font-black uppercase mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
                    <Info size={16} className="text-[#EAB308]" /> Quick Overview
                  </h3>
                  <div className="space-y-4 mb-8">
                    <InfoRow label="Visa Type" value={data.visaType} />
                    <InfoRow label="Category" value={data.category} />
                    <InfoRow label="Processing" value={data.processingTime} />
                    <InfoRow label="Duration" value={data.duration} />
                    <InfoRow label="Cost" value={data.cost} />
                    <InfoRow label="Region" value={data.region} />
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-4 bg-[#EAB308] text-[#0B1F3A] rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-amber-400 transition-all shadow-lg"
                  >
                    Start Application
                  </button>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 text-center">
                  <Shield size={24} className="mx-auto text-[#EAB308] mb-3" />
                  <p className="font-black text-sm uppercase text-[#0B1F3A]">100% Legal & Verified</p>
                  <p className="text-xs font-semibold text-slate-500 mt-1">Processed through official government channels.</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-20 px-6 lg:px-8 bg-white">
        <motion.div {...fadeUp} className="max-w-7xl mx-auto bg-[#0B1F3A] rounded-[3.5rem] p-12 lg:p-20 text-center relative overflow-hidden">
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl lg:text-6xl font-black text-white leading-tight uppercase">
              Ready to Visit <span className="text-[#EAB308]">{data.country}?</span>
            </h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#EAB308] text-[#0B1F3A] px-10 py-5 font-black uppercase text-xs tracking-[0.3em] hover:bg-white transition-all shadow-xl rounded-full"
            >
              Apply for Visit Visa →
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default VisitVisaDetail;