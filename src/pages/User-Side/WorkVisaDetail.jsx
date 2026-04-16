import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { workVisaData } from '../../constants/workVisaData';

import FloatingButton from './FloatingButton';
import {
  CheckCircle2, ArrowLeft, Clock, Briefcase,
  FileText, Info, Phone, Mail, Send, X,
  Globe, ListChecks, Wallet, Star,
  AlertCircle, Shield, Calendar, Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────
   Reusable Sub-components
───────────────────────────────────────── */

//const [imgError, setImgError] = useState(false);
//const heroImageSrc = `/images/work/${countryId}.jpg`;

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
   Main Component — WorkVisaDetail
───────────────────────────────────────── */
const WorkVisaDetail = () => {
  const { countryId } = useParams();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    passport: '',
    nationality: '',
  });

  // ✅ FIX: Find data directly from workVisaData using countryId param
  const data = workVisaData.find((v) => v.id === countryId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [countryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data) return;
    setIsSending(true);
    try {
      await emailjs.send(
        'service_lyaj90m',
        'template_jcvorut',
        {
          user_name:        formData.name,
          user_contact:     formData.contact,
          user_passport:    formData.passport,
          user_nationality: formData.nationality,
          package_name:     data.country,
          request_type:     'Work Visa Application',
        },
        'fBmCBPjkDCPx48ro6'
      );
      alert('Application sent successfully! We will contact you soon.');
      setIsModalOpen(false);
      setFormData({ name: '', contact: '', passport: '', nationality: '' });
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  // ✅ FIX: If data not found, show proper not-found message (not infinite spinner)
  if (!data) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white gap-4">
        <p className="text-[#0B1F3A] font-black text-2xl uppercase">Country Not Found</p>
        <p className="text-slate-500 text-sm">No work visa data found for: <strong>{countryId}</strong></p>
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

  // Normalised data fields
  const whyList        = data.whyChoose || [];
  const benefitsList   = Array.isArray(data.benefits) ? data.benefits : [];
  const jobs           = data.inDemandJobs || [];
  const permits        = (data.permitTypes || []).map((p) =>
    typeof p === 'string' ? { type: p, for: '' } : p
  );
  const requirements   = data.requirements || [];
  const nationalities  = Array.isArray(data.eligibleNationalities) ? data.eligibleNationalities : [];
  const eligibleRegions = data.eligibleRegions || [];
  const trainingSteps  = data.trainingProcess || [];
  const workSteps      = data.workProcess || [];
  const salaryTable    = data.salaryTable || [];

  return (
    <div className="min-h-screen bg-white font-['Inter',_sans-serif] overflow-x-hidden">
      <FloatingButton />

      {/* ══════════════════════════════════════
          APPLICATION MODAL
      ══════════════════════════════════════ */}
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
                  Work Visa — {data.flag} {data.country}
                </span>
                <h3 className="text-2xl font-black text-[#0B1F3A] uppercase tracking-tight mt-1">
                  Start Your Application
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  Fill in your details and our team will contact you within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { placeholder: 'Full Name',       key: 'name',        type: 'text' },
                  { placeholder: 'Contact Number',  key: 'contact',     type: 'tel'  },
                  { placeholder: 'Passport Number', key: 'passport',    type: 'text' },
                  { placeholder: 'Nationality',     key: 'nationality', type: 'text' },
                ].map(({ placeholder, key, type: inputType }) => (
                  <div key={key}>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block mb-1">
                      {placeholder}
                    </label>
                    <input
                      required
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
                    Do not quit your current job until you receive final confirmation from our team.
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

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-slate-50 to-white overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#EAB308]/5 rounded-full translate-x-1/2 -translate-y-1/4 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div {...fadeUp}>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-[#EAB308] font-bold text-[11px] uppercase tracking-[0.3em] mb-10 hover:gap-3 transition-all"
            >
              <ArrowLeft size={15} /> Back
            </button>

            <div className="flex flex-wrap gap-3 mb-6">
              <Badge gold>Work Permit Program</Badge>
              {data.visaType && <Badge>{data.visaType}</Badge>}
              {data.region   && <Badge>{data.region}</Badge>}
            </div>

            <h1 className="text-5xl lg:text-8xl font-black text-[#0B1F3A] leading-[0.9] tracking-tighter uppercase">
              {data.flag} {data.country}
              <span className="text-[#EAB308] italic font-light lowercase text-3xl lg:text-5xl block mt-3">
                Professional Employment
              </span>
            </h1>

            <div className="flex flex-wrap gap-6 mt-10">
              {data.processingTime && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock size={15} className="text-[#EAB308]" />
                  <span className="text-xs font-bold uppercase tracking-wide">{data.processingTime}</span>
                </div>
              )}
              {data.workHours && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Briefcase size={15} className="text-[#EAB308]" />
                  <span className="text-xs font-bold uppercase tracking-wide">{data.workHours}</span>
                </div>
              )}
              {data.salary && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Wallet size={15} className="text-[#EAB308]" />
                  <span className="text-xs font-bold uppercase tracking-wide">{data.salary}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
      {/*<section className="relative pt-36 pb-16 overflow-hidden min-h-[420px]">
              {!imgError ? (
                <>
                  <img
                    src={heroImageSrc}
                    alt={`Work ${data.country}`}
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
                    {data.region   && <Badge>{data.region}</Badge>}
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
            </section>*/}
      

      {/* ══════════════════════════════════════
          MAIN CONTENT + SIDEBAR
      ══════════════════════════════════════ */}
      <section className="py-14 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">

            {/* ── LEFT COLUMN ── */}
            <div className="lg:w-[65%] space-y-16">

              {/* Why Work Here */}
              {whyList.length > 0 && (
                <motion.div {...fadeUp}>
                  <SectionHeading label="Why Work in" accent={`${data.country}?`} />
                  <ul className="space-y-3">
                    {whyList.map((item, i) => <CheckItem key={i} text={item} />)}
                  </ul>
                </motion.div>
              )}

              {/* Key Benefits */}
              {benefitsList.length > 0 && (
                <motion.div {...fadeUp}>
                  <SectionHeading label="Key" accent="Benefits." />
                  <div className="grid sm:grid-cols-2 gap-4">
                    {benefitsList.map((b, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-[#EAB308]/40 transition-all"
                      >
                        <Star size={15} className="text-[#EAB308] shrink-0 mt-0.5" />
                        <span className="text-sm font-semibold text-slate-700">{b}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Available Vacancies */}
              {jobs.length > 0 && (
                <motion.div {...fadeUp}>
                  <SectionHeading label="Available" accent="Vacancies." />
                  <div className="grid sm:grid-cols-2 gap-5">
                    {jobs.map((job, i) => (
                      <div
                        key={i}
                        className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-[#EAB308]/50 transition-all"
                      >
                        <div className="flex justify-between items-start mb-3 gap-2">
                          <h4 className="font-black text-[#0B1F3A] text-base leading-snug">{job.title}</h4>
                          <span className="bg-amber-50 text-[#EAB308] text-[9px] font-black uppercase px-2 py-1 rounded-full shrink-0 border border-amber-200">
                            {job.gender}
                          </span>
                        </div>
                        {job.age && (
                          <p className="text-xs text-slate-400 font-semibold mb-2">Age: {job.age}</p>
                        )}
                        {job.note && (
                          <p className="text-xs text-slate-500 mb-4 leading-relaxed">{job.note}</p>
                        )}
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Salary</span>
                          <span className="font-black text-[#0B1F3A] text-sm text-right">{job.salary}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Salary Table */}
              {salaryTable.length > 0 && (
                <motion.div {...fadeUp}>
                  <SectionHeading label="Salary" accent="Overview." />
                  <div className="overflow-x-auto rounded-2xl border border-slate-100">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#0B1F3A] text-white">
                          <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest">Hours</th>
                          <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest">Monthly</th>
                          <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest">Annual</th>
                        </tr>
                      </thead>
                      <tbody>
                        {salaryTable.map((row, i) => (
                          <tr key={i} className={i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                            <td className="p-4 font-semibold text-slate-700">{row.hours}</td>
                            <td className="p-4 font-bold text-[#0B1F3A]">{row.monthly}</td>
                            <td className="p-4 font-bold text-[#EAB308]">{row.annual}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* Training Process */}
              {trainingSteps.length > 0 && (
                <motion.div {...fadeUp}>
                  <SectionHeading label="Training" accent="Process." />
                  <ol className="space-y-4">
                    {trainingSteps.map((step, i) => (
                      <li key={i} className="flex gap-4">
                        <span className="w-7 h-7 bg-[#EAB308] text-[#0B1F3A] rounded-full flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">{step}</p>
                      </li>
                    ))}
                  </ol>
                </motion.div>
              )}

              {/* Application Process */}
              {workSteps.length > 0 && (
                <motion.div {...fadeUp}>
                  <SectionHeading label="Application" accent="Process." />
                  <ol className="space-y-4">
                    {workSteps.map((step, i) => (
                      <li key={i} className="flex gap-4">
                        <span className="w-7 h-7 bg-[#0B1F3A] text-[#EAB308] rounded-full flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">{step}</p>
                      </li>
                    ))}
                  </ol>
                </motion.div>
              )}

              {/* Accommodation */}
              {data.accommodation && (
                <motion.div {...fadeUp}>
                  <SectionHeading label="Accommodation" accent="Info." />
                  <div className="bg-slate-50 border-l-4 border-[#EAB308] rounded-r-2xl p-6 flex gap-4">
                    <Building2 size={20} className="text-[#EAB308] shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">{data.accommodation}</p>
                  </div>
                </motion.div>
              )}

              {/* Permit Categories */}
              {permits.length > 0 && (
                <motion.div {...fadeUp}>
                  <div className="bg-[#0B1F3A] p-8 lg:p-10 rounded-[2.5rem] text-white">
                    <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-3">
                      <ListChecks className="text-[#EAB308]" size={20} />
                      Permit <span className="text-[#EAB308] ml-1">Categories.</span>
                    </h3>
                    <div className="space-y-3">
                      {permits.map((p, i) => (
                        <div
                          key={i}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors gap-2"
                        >
                          <span className="font-black text-[#EAB308] text-sm">{p.type}</span>
                          {p.for && <span className="text-white/50 text-xs italic">{p.for}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Requirements */}
              {requirements.length > 0 && (
                <motion.div {...fadeUp}>
                  <SectionHeading label="Main" accent="Requirements." />
                  <div className="grid sm:grid-cols-2 gap-3">
                    {requirements.map((req, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-[#EAB308]/40 transition-all"
                      >
                        <FileText size={15} className="text-[#EAB308] shrink-0 mt-0.5" />
                        <span className="text-sm font-semibold text-slate-700 leading-snug">{req}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Eligible Nationalities */}
              {nationalities.length > 0 && (
                <motion.div {...fadeUp}>
                  <SectionHeading label="Eligible" accent="Nationalities." />
                  <div className="flex flex-wrap gap-2">
                    {nationalities.map((n, i) => (
                      <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                        {n}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Eligible Regions */}
              {eligibleRegions.length > 0 && (
                <motion.div {...fadeUp}>
                  <SectionHeading label="Eligible" accent="Regions." />
                  <div className="space-y-3">
                    {eligibleRegions.map((r, i) => (
                      <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-xs font-black uppercase tracking-widest text-[#EAB308] mb-1">{r.region}</p>
                        <p className="text-sm text-slate-600 font-medium">{r.countries}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Important Notice */}
              {data.important && (
                <motion.div {...fadeUp}>
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex gap-4">
                    <AlertCircle size={20} className="text-[#EAB308] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-amber-700 mb-1">Important Notice</p>
                      <p className="text-sm text-amber-800 font-medium leading-relaxed">{data.important}</p>
                    </div>
                  </div>
                </motion.div>
              )}

            </div>

            {/* ── RIGHT SIDEBAR ── */}
            <aside className="lg:w-[35%]">
              <div className="sticky top-24 space-y-6">

                <div className="bg-[#0B1F3A] rounded-[2rem] p-8 text-white shadow-xl">
                  <h3 className="text-base font-black uppercase mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
                    <Info size={16} className="text-[#EAB308]" /> Quick Overview
                  </h3>
                  <div className="space-y-4 mb-8">
                    <InfoRow label="Visa Type"   value={data.visaType} />
                    <InfoRow label="Category"    value={data.category} />
                    <InfoRow label="Processing"  value={data.processingTime} />
                    <InfoRow label="Work Hours"  value={data.workHours} />
                    <InfoRow label="Salary"      value={data.salary} />
                    <InfoRow label="Region"      value={data.region} />
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-4 bg-[#EAB308] text-[#0B1F3A] rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-amber-400 transition-all shadow-lg"
                  >
                    Start Application
                  </button>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Need Expert Advice?</p>
                  <div className="space-y-4">
                    <a
                      href="tel:+8801348992268"
                      className="flex items-center gap-3 text-[#0B1F3A] hover:text-[#EAB308] transition-colors group"
                    >
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 group-hover:border-[#EAB308] transition-all">
                        <Phone size={15} />
                      </div>
                      <span className="font-bold text-sm">+880 1348 992268</span>
                    </a>
                    <div className="flex items-center gap-3 text-[#0B1F3A]">
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <Mail size={15} />
                      </div>
                      <span className="font-bold text-sm">info@snjglobal.com</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#EAB308] rounded-[2rem] p-6 text-[#0B1F3A]">
                  <Shield size={20} className="mb-3" />
                  <p className="font-black text-sm uppercase tracking-tight">100% Legal & Verified Process</p>
                  <p className="text-xs font-semibold mt-1 text-[#0B1F3A]/70 leading-relaxed">
                    All applications are processed through official government channels with full documentation support.
                  </p>
                </div>

              </div>
            </aside>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BOTTOM CTA
      ══════════════════════════════════════ */}
      <section className="py-20 px-6 lg:px-8 bg-white">
        <motion.div
          {...fadeUp}
          className="max-w-7xl mx-auto bg-[#0B1F3A] rounded-[3.5rem] p-12 lg:p-20 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-72 h-72 bg-[#EAB308]/10 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#EAB308]/5 rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl lg:text-6xl font-black text-white leading-tight uppercase">
              Ready to Work in{' '}
              <span className="text-[#EAB308]">{data.country}?</span>
            </h2>
            <p className="text-white/60 font-medium text-sm max-w-md mx-auto leading-relaxed">
              Our team handles every step — from document preparation to visa approval. Let's get started today.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#EAB308] text-[#0B1F3A] px-10 py-5 font-black uppercase text-xs tracking-[0.3em] hover:bg-white transition-all shadow-xl rounded-full"
            >
              Apply for Work Visa →
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default WorkVisaDetail;