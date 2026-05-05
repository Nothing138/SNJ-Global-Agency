// StudentVisaDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { studentVisaData } from '../../constants/studentVisaData';

import FloatingButton from './FloatingButton';
import {
  CheckCircle2, ArrowLeft, Clock, FileText,
  Info, Phone, Mail, Send, X,
  Globe, Wallet, Star, Calendar,
  AlertCircle, Shield, BookOpen, GraduationCap,
  ChevronDown, HelpCircle, Building2, DollarSign
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

/* ─── Accordion for FAQ ─── */
const AccordionItem = ({ question, answer, isOpen, onClick }) => (
  <div className="border-b border-slate-100 last:border-0">
    <button
      onClick={onClick}
      className="w-full py-5 flex items-center justify-between gap-4 text-left group"
    >
      <span
        className={`text-sm font-bold uppercase tracking-tight transition-colors ${
          isOpen ? 'text-[#EAB308]' : 'text-[#0B1F3A] group-hover:text-[#EAB308]'
        }`}
      >
        {question}
      </span>
      <ChevronDown
        size={18}
        className={`text-[#EAB308] transition-transform duration-300 shrink-0 ${
          isOpen ? 'rotate-180' : ''
        }`}
      />
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <p className="text-slate-500 text-sm pb-6 leading-relaxed font-medium">
            {answer}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

/* ─────────────────────────────────────────
   Main Component — StudentVisaDetail
───────────────────────────────────────── */
const StudentVisaDetail = () => {
  const { countryId } = useParams();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [isSending, setIsSending]       = useState(false);
  const [imgError, setImgError]         = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    passport: '',
    nationality: '',
    course: '',
  });

  /* General FAQ shown on every page */
  const generalFaqs = [
    { question: "What is a student visa?",                    answer: "A student visa allows you to study in a foreign country at an approved educational institution." },
    { question: "Which countries do you offer student visa services for?", answer: "We provide student visa services for Australia, Hungary, United Kingdom, Malta, and Canada." },
    { question: "Do you help with university admission?",      answer: "Yes, we assist with selecting universities and completing the entire admission process." },
    { question: "What documents are required for a student visa?", answer: "Documents include passport, academic certificates, offer letter, bank statement, and other supporting papers depending on the country." },
    { question: "Do I need IELTS or an English test?",         answer: "Many countries require IELTS or similar tests, but some institutions offer alternatives or exemptions." },
    { question: "How long does student visa processing take?", answer: "Processing time usually takes 3 to 16 weeks depending on the country and stream." },
    { question: "Can I work while studying?",                  answer: "Yes, most countries allow students to work part-time during studies." },
    { question: "What is proof of funds?",                     answer: "Proof of funds shows you can financially support your education and living expenses abroad." },
    { question: "Can I bring my family on a student visa?",    answer: "Some countries allow dependents such as a spouse and children — eligibility varies by country and programme." },
    { question: "Do you provide interview preparation?",       answer: "Yes, we provide complete interview guidance and mock sessions." },
    { question: "Can I stay after completing my studies?",     answer: "Yes, many countries offer post-study work opportunities and PR pathways after graduation." },
    { question: "Is health insurance required?",               answer: "Yes, most countries require valid health insurance for the duration of your stay." },
    { question: "What if my visa gets rejected?",              answer: "We analyse the reason and help you reapply with a stronger, more complete application." },
    { question: "Can I change my course or university later?", answer: "Yes, but it depends on the immigration rules of the specific country." },
    { question: "Why should I apply through your agency?",     answer: "We provide expert guidance, admission support, high visa success rates, and full end-to-end assistance." }
  ];

  const data = studentVisaData.find((v) => v.id === countryId);

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
          request_type:     `Student Visa Application${formData.course ? ` — ${formData.course}` : ''}`,
        },
        'fBmCBPjkDCPx48ro6'
      );
      alert('Application sent successfully! We will contact you soon.');
      setIsModalOpen(false);
      setFormData({ name: '', contact: '', passport: '', nationality: '', course: '' });
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
        <p className="text-slate-500 text-sm">
          No student visa data found for: <strong>{countryId}</strong>
        </p>
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
    initial:     { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport:    { once: true },
    transition:  { duration: 0.55 },
  };

  const whyList        = data.whyStudyHere || data.whyChoose || [];
  const benefitsList   = Array.isArray(data.benefits) ? data.benefits : [];
  const requirements   = data.requirements || [];
  const courses        = data.popularCourses || [];
  const intakes        = data.intakeMonths || [];
  const universities   = data.topUniversities || [];
  const scholarships   = data.scholarships || [];
  const visaSteps      = data.visaProcess || [];
  const countryFaqs    = Array.isArray(data.faq) ? data.faq : [];
  const costDetails    = data.costDetails || null;

  /* Merge: country-specific FAQs first, then general */
  const allFaqs = [...countryFaqs, ...generalFaqs];

  const heroImageSrc = `/images/student/${countryId}.jpg`;

  return (
    <div className="min-h-screen bg-white font-['Inter',_sans-serif] overflow-x-hidden">
      <FloatingButton />

      {/* ── APPLICATION MODAL ── */}
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
                  Student Visa — {data.flag} {data.country}
                </span>
                <h3 className="text-2xl font-black text-[#0B1F3A] uppercase tracking-tight mt-1">
                  Start Your Application
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  Fill in your details and our academic team will contact you within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { placeholder: 'Full Name',       key: 'name',        type: 'text', required: true  },
                  { placeholder: 'Contact Number',  key: 'contact',     type: 'tel',  required: true  },
                  { placeholder: 'Passport Number', key: 'passport',    type: 'text', required: true  },
                  { placeholder: 'Nationality',     key: 'nationality', type: 'text', required: true  },
                  { placeholder: 'Intended Course', key: 'course',      type: 'text', required: false },
                ].map(({ placeholder, key, type: inputType, required: req }) => (
                  <div key={key}>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block mb-1">
                      {placeholder}
                      {!req && <span className="text-slate-300 ml-1">(optional)</span>}
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
                    Do not defer or cancel your current academic commitments until your student visa is fully confirmed.
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

      {/* ── HERO ── */}
      <section className="relative pt-36 pb-16 overflow-hidden min-h-[420px]">
        {!imgError ? (
          <>
            <img
              src={heroImageSrc}
              alt={`${data.country} student life`}
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
              <Badge gold>Student Visa Program</Badge>
              {data.visaName && <Badge>{data.visaName}</Badge>}
              {data.region   && <Badge>{data.region}</Badge>}
            </div>

            <h1 className={`text-5xl lg:text-8xl font-black leading-[0.9] tracking-tighter uppercase ${
              !imgError ? 'text-white' : 'text-[#0B1F3A]'
            }`}>
              {data.flag} {data.country}
              <span className="text-[#EAB308] italic font-light lowercase text-3xl lg:text-5xl block mt-3">
                World-Class Education
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
              {data.duration && (
                <div className="flex items-center gap-2">
                  <Calendar size={15} className="text-[#EAB308]" />
                  <span className={`text-xs font-bold uppercase tracking-wide ${!imgError ? 'text-white/80' : 'text-slate-600'}`}>
                    {data.duration}
                  </span>
                </div>
              )}
              {data.region && (
                <div className="flex items-center gap-2">
                  <Globe size={15} className="text-[#EAB308]" />
                  <span className={`text-xs font-bold uppercase tracking-wide ${!imgError ? 'text-white/80' : 'text-slate-600'}`}>
                    {data.region}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── MAIN CONTENT + SIDEBAR ── */}
      <section className="py-14 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">

            {/* LEFT COLUMN */}
            <div className="lg:w-[65%] space-y-16">

              {/* Why Study Here */}
              {whyList.length > 0 && (
                <motion.div {...fadeUp}>
                  <SectionHeading label="Why Study in" accent={`${data.country}?`} />
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

              {/* Top Universities */}
              {universities.length > 0 && (
                <motion.div {...fadeUp}>
                  <SectionHeading label="Top" accent="Universities." />
                  <div className="grid sm:grid-cols-2 gap-3">
                    {universities.map((u, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-[#EAB308]/40 transition-all"
                      >
                        <Building2 size={15} className="text-[#EAB308] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-black text-[#0B1F3A]">{u.name}</p>
                          {u.note && <p className="text-xs text-slate-500 mt-0.5 font-medium">{u.note}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Popular Courses */}
              {courses.length > 0 && (
                <motion.div {...fadeUp}>
                  <SectionHeading label="Popular" accent="Courses." />
                  <div className="flex flex-wrap gap-3">
                    {courses.map((c, i) => (
                      <span key={i} className="flex items-center gap-2 px-4 py-2 bg-[#0B1F3A] text-white text-xs font-bold rounded-full">
                        <BookOpen size={11} /> {c}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Intake Dates */}
              {intakes.length > 0 && (
                <motion.div {...fadeUp}>
                  <SectionHeading label="Intake" accent="Dates." />
                  <div className="flex flex-wrap gap-4">
                    {intakes.map((d, i) => (
                      <div key={i} className="flex items-center gap-2 px-5 py-3 bg-amber-50 border border-amber-200 rounded-2xl">
                        <Calendar size={14} className="text-[#EAB308]" />
                        <span className="text-sm font-bold text-[#0B1F3A]">{d}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Requirements */}
              {requirements.length > 0 && (
                <motion.div {...fadeUp}>
                  <SectionHeading label="Admission" accent="Requirements." />
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

              {/* Scholarships */}
              {scholarships.length > 0 && (
                <motion.div {...fadeUp}>
                  <SectionHeading label="Scholarships &amp;" accent="Financial Aid." />
                  <ul className="space-y-3">
                    {scholarships.map((s, i) => <CheckItem key={i} text={s} />)}
                  </ul>
                </motion.div>
              )}

              {/* Work Opportunities */}
              {data.workOpportunities && (
                <motion.div {...fadeUp}>
                  <SectionHeading label="Work" accent="Opportunities." />
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-sm font-semibold text-slate-600 leading-relaxed">
                      {data.workOpportunities}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Visa Process */}
              {visaSteps.length > 0 && (
                <motion.div {...fadeUp}>
                  <SectionHeading label="Visa" accent="Process." />
                  <ol className="space-y-4">
                    {visaSteps.map((step, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <span className="w-7 h-7 rounded-full bg-[#EAB308] text-[#0B1F3A] text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-sm font-semibold text-slate-700 leading-snug pt-1">{step}</span>
                      </li>
                    ))}
                  </ol>
                </motion.div>
              )}

              {/* Cost Details */}
              {costDetails && (
                <motion.div {...fadeUp}>
                  <SectionHeading label="Cost" accent="Details." />
                  <div className="grid sm:grid-cols-3 gap-4">
                    {costDetails.tuition && (
                      <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl">
                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-2">Tuition</p>
                        <p className="text-sm font-bold text-[#0B1F3A]">{costDetails.tuition}</p>
                      </div>
                    )}
                    {costDetails.living && (
                      <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Living Cost</p>
                        <p className="text-sm font-bold text-[#0B1F3A]">{costDetails.living}</p>
                      </div>
                    )}
                    {costDetails.applicationFee && (
                      <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Application Fee</p>
                        <p className="text-sm font-bold text-[#0B1F3A]">{costDetails.applicationFee}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Student Life */}
              {data.studentLife && (
                <motion.div {...fadeUp}>
                  <SectionHeading label="Student" accent="Life." />
                  <div className="p-6 bg-[#0B1F3A] rounded-2xl">
                    <p className="text-sm font-semibold text-white/80 leading-relaxed">
                      {data.studentLife}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* FAQ Section */}
              <motion.div {...fadeUp} className="pt-8 border-t border-slate-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <HelpCircle className="text-[#EAB308]" size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-[#0B1F3A] uppercase tracking-tight">
                    Student <span className="text-[#EAB308]">Intelligence</span>
                  </h3>
                </div>

                <div className="bg-white rounded-3xl border border-slate-100 divide-y divide-slate-100 overflow-hidden shadow-sm px-6">
                  {allFaqs.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      question={faq.question}
                      answer={faq.answer}
                      isOpen={openFaqIndex === index}
                      onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* ── RIGHT SIDEBAR ── */}
            <aside className="lg:w-[35%]">
              <div className="sticky top-24 space-y-6">

                {/* Quick Overview */}
                <div className="bg-[#0B1F3A] rounded-[2rem] p-8 text-white shadow-xl">
                  <h3 className="text-base font-black uppercase mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
                    <Info size={16} className="text-[#EAB308]" /> Quick Overview
                  </h3>
                  <div className="space-y-4 mb-8">
                    <InfoRow label="Visa Type"  value={data.visaType} />
                    <InfoRow label="Visa Name"  value={data.visaName} />
                    <InfoRow label="Category"   value={data.category} />
                    <InfoRow label="Processing" value={data.processingTime} />
                    <InfoRow label="Duration"   value={data.duration} />
                    <InfoRow label="Region"     value={data.region} />
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-4 bg-[#EAB308] text-[#0B1F3A] rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-amber-400 transition-all shadow-lg"
                  >
                    Start Application
                  </button>
                </div>

                {/* Important Note */}
                {data.important && (
                  <div className="bg-amber-50 border border-amber-200 rounded-[2rem] p-6">
                    <div className="flex gap-3">
                      <AlertCircle size={18} className="text-[#EAB308] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-2">Important Note</p>
                        <p className="text-xs font-semibold text-amber-800 leading-relaxed">{data.important}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact */}
                <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Need Expert Advice?</p>
                  <div className="space-y-4">
                    <a
                      href="tel:+8801348992268"
                      className="flex items-center gap-3 text-[#0B1F3A] hover:text-[#EAB308] group transition-colors"
                    >
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 group-hover:border-[#EAB308]">
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

                {/* Trust Badge */}
                <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 text-center">
                  <Shield size={24} className="mx-auto text-[#EAB308] mb-3" />
                  <p className="font-black text-sm uppercase text-[#0B1F3A]">100% Legal &amp; Verified</p>
                  <p className="text-xs font-semibold text-slate-500 mt-1">
                    Processed through official government channels only.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-20 px-6 lg:px-8 bg-white">
        <motion.div
          {...fadeUp}
          className="max-w-7xl mx-auto bg-[#0B1F3A] rounded-[3.5rem] p-12 lg:p-20 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-72 h-72 bg-[#EAB308]/10 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl lg:text-6xl font-black text-white leading-tight uppercase">
              Ready to Study in{' '}
              <span className="text-[#EAB308]">{data.country}?</span>
            </h2>
            <p className="text-white/60 font-medium text-sm max-w-md mx-auto leading-relaxed">
              Our academic advisors guide you through university selection, documentation, and visa approval.
              Start your journey today.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#EAB308] text-[#0B1F3A] px-10 py-5 font-black uppercase text-xs tracking-[0.3em] hover:bg-white transition-all shadow-xl rounded-full"
            >
              Apply for Student Visa →
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default StudentVisaDetail;