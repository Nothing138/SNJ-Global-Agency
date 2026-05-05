// src/pages/ServiceAreaCountry.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';

import { workVisaData }   from '../constants/workVisaData';
import { visaData }       from '../constants/visaData';
import { studentVisaData }from '../constants/studentVisaData';
import { countryDataMap } from '../constants/Countrydatamap'; // ← fix casing

import {
  ArrowLeft, Clock, Briefcase, FileText, Info, Phone, Mail,
  Send, X, Globe, Wallet, Star, Calendar, AlertCircle, Shield,
  CheckCircle2, MapPin, Building2, BookOpen, GraduationCap,
  ListChecks, Plus, Minus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Flag code lookup ───────────────────────────────────────── */
const FLAG_CODE = {
  albania:'al', armenia:'am', austria:'at', australia:'au', azerbaijan:'az',
  belarus:'by', belgium:'be', bulgaria:'bg', cambodia:'kh', canada:'ca',
  china:'cn', croatia:'hr', cyprus:'cy', 'czech-republic':'cz', denmark:'dk',
  egypt:'eg', estonia:'ee', finland:'fi', france:'fr', georgia:'ge',
  germany:'de', greece:'gr', hungary:'hu', iceland:'is', india:'in',
  indonesia:'id', ireland:'ie', italy:'it', japan:'jp', laos:'la',
  latvia:'lv', lithuania:'lt', luxembourg:'lu', malaysia:'my', malta:'mt',
  moldova:'md', montenegro:'me', nepal:'np', netherlands:'nl',
  'new-zealand':'nz', 'north-macedonia':'mk', norway:'no', philippines:'ph',
  poland:'pl', portugal:'pt', romania:'ro', russia:'ru', serbia:'rs',
  singapore:'sg', slovakia:'sk', slovenia:'si', 'south-korea':'kr',
  spain:'es', 'sri-lanka':'lk', sweden:'se', switzerland:'ch',
  thailand:'th', turkiye:'tr', 'united-kingdom':'gb',
};

/* ─── Atoms ──────────────────────────────────────────────────── */
const Badge = ({ children, gold }) => (
  <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
    gold ? 'bg-[#EAB308] text-[#0B1F3A]' : 'bg-white/10 text-white'
  }`}>
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

const InfoRow = ({ label, value }) => value ? (
  <div className="flex justify-between items-start border-b border-white/5 pb-4 gap-4">
    <span className="text-white/50 text-[10px] font-black uppercase tracking-widest shrink-0">{label}</span>
    <span className="font-bold text-white text-sm text-right">{value}</span>
  </div>
) : null;

const QuickCard = ({ label, value, Icon }) => value ? (
  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
    <Icon size={14} className="text-[#EAB308] mb-1" />
    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</p>
    <p className="text-xs font-bold text-[#0B1F3A] mt-0.5 leading-snug">{value}</p>
  </div>
) : null;

const FaqItem = ({ question, answer, isOpen, onClick }) => (
  <div className="border-b border-slate-100 last:border-0">
    <button onClick={onClick} className="w-full py-5 flex items-center justify-between gap-4 text-left group">
      <span className={`text-sm font-bold uppercase tracking-tight transition-colors ${isOpen ? 'text-[#EAB308]' : 'text-[#0B1F3A]'}`}>
        {question}
      </span>
      <div className={`p-2 rounded-full flex-shrink-0 transition-all ${isOpen ? 'bg-[#EAB308] text-white' : 'bg-slate-50 text-slate-400'}`}>
        {isOpen ? <Minus size={14} /> : <Plus size={14} />}
      </div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
          className="overflow-hidden"
        >
          <p className="pb-6 text-slate-500 text-sm leading-relaxed font-medium">{answer}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const TabBtn = ({ label, icon: Icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
      active ? 'bg-[#EAB308] text-[#0B1F3A] shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'
    }`}
  >
    <Icon size={14} />{label}
  </button>
);

/* ─── Visit Visa Section ─────────────────────────────────────── */
const VisitSection = ({ data }) => {
  const [openFaq, setOpenFaq] = useState(null);
  return (
    <div className="space-y-14">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <QuickCard label="Processing" value={data.processingTime} Icon={Clock} />
        <QuickCard label="Stay"       value={data.stayDuration}   Icon={Calendar} />
        <QuickCard label="Validity"   value={data.validity}        Icon={Globe} />
        <QuickCard label="Visa Type"  value={data.visaType}        Icon={Shield} />
      </div>

      {data.description && (
        <div>
          <SectionHeading label="About This" accent="Destination." />
          <p className="text-slate-600 text-sm leading-relaxed font-medium">{data.description}</p>
        </div>
      )}

      {data.bestFor?.length > 0 && (
        <div>
          <SectionHeading label="Best" accent="For." />
          <div className="flex flex-wrap gap-3">
            {data.bestFor.map((b, i) => (
              <span key={i} className="flex items-center gap-2 px-4 py-2 bg-[#0B1F3A] text-white text-xs font-bold rounded-full">
                <MapPin size={11} />{b}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.highlights?.length > 0 && (
        <div>
          <SectionHeading label="Why Visit" accent="Here?" />
          <ul className="space-y-3">{data.highlights.map((h, i) => <CheckItem key={i} text={h} />)}</ul>
        </div>
      )}

      {data.requirements?.length > 0 && (
        <div>
          <SectionHeading label="Visa" accent="Requirements." />
          <div className="grid sm:grid-cols-2 gap-3">
            {data.requirements.map((r, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-[#EAB308]/40 transition-all">
                <FileText size={14} className="text-[#EAB308] shrink-0 mt-0.5" />
                <span className="text-sm font-semibold text-slate-700 leading-snug">{r}</span>
              </div>
            ))}
          </div>
          {data.additionalRequirements?.length > 0 && (
            <div className="mt-3 grid sm:grid-cols-2 gap-3">
              {data.additionalRequirements.map((r, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                  <FileText size={14} className="text-amber-500 shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-amber-800 leading-snug">{r}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {data.visaProcess?.length > 0 && (
        <div>
          <SectionHeading label="Application" accent="Process." />
          <ol className="space-y-4">
            {data.visaProcess.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="w-7 h-7 bg-[#EAB308] text-[#0B1F3A] rounded-full flex items-center justify-center font-black text-xs shrink-0 mt-0.5">{i+1}</span>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {Array.isArray(data.faq) && data.faq.length > 0 && (
        <div>
          <SectionHeading label="Common" accent="Questions." />
          <div className="bg-white rounded-3xl border border-slate-100 divide-y divide-slate-100 shadow-sm px-6">
            {data.faq.map((faq, i) => (
              <FaqItem key={i} question={faq.question} answer={faq.answer}
                isOpen={openFaq===i} onClick={() => setOpenFaq(openFaq===i ? null : i)} />
            ))}
          </div>
        </div>
      )}

      {data.important && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4">
          <AlertCircle size={18} className="text-[#EAB308] shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-700 mb-1">Important Notice</p>
            <p className="text-sm text-amber-800 font-medium leading-relaxed">{data.important}</p>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Work Visa Section ──────────────────────────────────────── */
const WorkSection = ({ data }) => {
  const permits = (data.permitTypes || []).map(p => typeof p === 'string' ? { type: p, for: '' } : p);
  return (
    <div className="space-y-14">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <QuickCard label="Processing" value={data.processingTime} Icon={Clock} />
        <QuickCard label="Salary"     value={data.salary}         Icon={Wallet} />
        <QuickCard label="Work Hours" value={data.workHours}      Icon={Briefcase} />
      </div>

      {data.whyChoose?.length > 0 && (
        <div>
          <SectionHeading label="Why Work" accent="Here?" />
          <ul className="space-y-3">{data.whyChoose.map((item, i) => <CheckItem key={i} text={item} />)}</ul>
        </div>
      )}

      {Array.isArray(data.benefits) && data.benefits.length > 0 && (
        <div>
          <SectionHeading label="Key" accent="Benefits." />
          <div className="grid sm:grid-cols-2 gap-4">
            {data.benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-[#EAB308]/40 transition-all">
                <Star size={14} className="text-[#EAB308] shrink-0 mt-0.5" />
                <span className="text-sm font-semibold text-slate-700">{b}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.inDemandJobs?.length > 0 && (
        <div>
          <SectionHeading label="Available" accent="Vacancies." />
          <div className="grid sm:grid-cols-2 gap-5">
            {data.inDemandJobs.map((job, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-[#EAB308]/50 transition-all">
                <div className="flex justify-between items-start mb-3 gap-2">
                  <h4 className="font-black text-[#0B1F3A] text-sm leading-snug">{job.title}</h4>
                  <span className="bg-amber-50 text-[#EAB308] text-[9px] font-black uppercase px-2 py-1 rounded-full shrink-0 border border-amber-200">{job.gender}</span>
                </div>
                {job.age  && <p className="text-xs text-slate-400 font-semibold mb-1">Age: {job.age}</p>}
                {job.note && <p className="text-xs text-slate-500 mb-4 leading-relaxed">{job.note}</p>}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Salary</span>
                  <span className="font-black text-[#0B1F3A] text-sm text-right">{job.salary}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.salaryTable?.length > 0 && (
        <div>
          <SectionHeading label="Salary" accent="Overview." />
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0B1F3A] text-white">
                  <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest">Role</th>
                  <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest">Monthly</th>
                  <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest">Hourly / Notes</th>
                </tr>
              </thead>
              <tbody>
                {data.salaryTable.map((row, i) => (
                  <tr key={i} className={i%2===0 ? 'bg-slate-50' : 'bg-white'}>
                    <td className="p-4 font-semibold text-slate-700">{row.hours}</td>
                    <td className="p-4 font-bold text-[#0B1F3A]">{row.monthly}</td>
                    <td className="p-4 font-bold text-[#EAB308]">{row.annual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {data.workProcess?.length > 0 && (
        <div>
          <SectionHeading label="Application" accent="Process." />
          <ol className="space-y-4">
            {data.workProcess.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="w-7 h-7 bg-[#0B1F3A] text-[#EAB308] rounded-full flex items-center justify-center font-black text-xs shrink-0 mt-0.5">{i+1}</span>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {data.accommodation && (
        <div>
          <SectionHeading label="Accommodation" accent="Info." />
          <div className="bg-slate-50 border-l-4 border-[#EAB308] rounded-r-2xl p-5 flex gap-4">
            <Building2 size={18} className="text-[#EAB308] shrink-0 mt-0.5" />
            <p className="text-sm text-slate-700 font-medium leading-relaxed">{data.accommodation}</p>
          </div>
        </div>
      )}

      {permits.length > 0 && (
        <div className="bg-[#0B1F3A] p-8 rounded-[2.5rem] text-white">
          <h3 className="text-lg font-black uppercase mb-5 flex items-center gap-3">
            <ListChecks className="text-[#EAB308]" size={18} />
            Permit <span className="text-[#EAB308] ml-1">Categories.</span>
          </h3>
          <div className="space-y-3">
            {permits.map((p, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 gap-2">
                <span className="font-black text-[#EAB308] text-sm">{p.type}</span>
                {p.for && <span className="text-white/50 text-xs italic">{p.for}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {data.requirements?.length > 0 && (
        <div>
          <SectionHeading label="Main" accent="Requirements." />
          <div className="grid sm:grid-cols-2 gap-3">
            {data.requirements.map((r, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-[#EAB308]/40 transition-all">
                <FileText size={14} className="text-[#EAB308] shrink-0 mt-0.5" />
                <span className="text-sm font-semibold text-slate-700 leading-snug">{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {Array.isArray(data.eligibleNationalities) && data.eligibleNationalities.length > 0 && (
        <div>
          <SectionHeading label="Eligible" accent="Nationalities." />
          <div className="flex flex-wrap gap-2">
            {data.eligibleNationalities.map((n, i) => (
              <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">{n}</span>
            ))}
          </div>
        </div>
      )}

      {data.important && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4">
          <AlertCircle size={18} className="text-[#EAB308] shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-700 mb-1">Important Notice</p>
            <p className="text-sm text-amber-800 font-medium leading-relaxed">{data.important}</p>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Student Visa Section ───────────────────────────────────── */
const StudentSection = ({ data }) => {
  const [openFaq, setOpenFaq] = useState(null);
  const whyList = data.whyStudyHere || data.whyChoose || [];
  const generalFaqs = [
    { question: 'What is a student visa?', answer: 'A student visa allows you to study in a foreign country at an approved educational institution.' },
    { question: 'Can I work while studying?', answer: 'Most countries allow students to work part-time during studies — typically 20–24 hours/week.' },
    { question: 'What is proof of funds?', answer: 'Proof of funds shows you can financially support your education and living expenses abroad.' },
    { question: 'Do you provide interview preparation?', answer: 'Yes, we provide complete interview guidance and mock sessions before your visa submission.' },
    { question: 'Can I stay after completing my studies?', answer: 'Many countries offer post-study work opportunities and PR pathways after graduation.' },
  ];
  const allFaqs = [...(Array.isArray(data.faq) ? data.faq : []), ...generalFaqs];

  return (
    <div className="space-y-14">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <QuickCard label="Processing" value={data.processingTime} Icon={Clock} />
        <QuickCard label="Duration"   value={data.duration}       Icon={Calendar} />
        <QuickCard label="Visa Name"  value={data.visaName}       Icon={Globe} />
      </div>

      {whyList.length > 0 && (
        <div>
          <SectionHeading label="Why Study" accent="Here?" />
          <ul className="space-y-3">{whyList.map((item, i) => <CheckItem key={i} text={item} />)}</ul>
        </div>
      )}

      {Array.isArray(data.benefits) && data.benefits.length > 0 && (
        <div>
          <SectionHeading label="Key" accent="Benefits." />
          <div className="grid sm:grid-cols-2 gap-4">
            {data.benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-[#EAB308]/40 transition-all">
                <Star size={14} className="text-[#EAB308] shrink-0 mt-0.5" />
                <span className="text-sm font-semibold text-slate-700">{b}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.topUniversities?.length > 0 && (
        <div>
          <SectionHeading label="Top" accent="Universities." />
          <div className="grid sm:grid-cols-2 gap-3">
            {data.topUniversities.map((u, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-[#EAB308]/40 transition-all">
                <Building2 size={14} className="text-[#EAB308] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-black text-[#0B1F3A]">{u.name}</p>
                  {u.note && <p className="text-xs text-slate-500 mt-0.5 font-medium">{u.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.popularCourses?.length > 0 && (
        <div>
          <SectionHeading label="Popular" accent="Courses." />
          <div className="flex flex-wrap gap-3">
            {data.popularCourses.map((c, i) => (
              <span key={i} className="flex items-center gap-2 px-4 py-2 bg-[#0B1F3A] text-white text-xs font-bold rounded-full">
                <BookOpen size={11} />{c}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.intakeMonths?.length > 0 && (
        <div>
          <SectionHeading label="Intake" accent="Dates." />
          <div className="flex flex-wrap gap-4">
            {data.intakeMonths.map((d, i) => (
              <div key={i} className="flex items-center gap-2 px-5 py-3 bg-amber-50 border border-amber-200 rounded-2xl">
                <Calendar size={13} className="text-[#EAB308]" />
                <span className="text-sm font-bold text-[#0B1F3A]">{d}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.requirements?.length > 0 && (
        <div>
          <SectionHeading label="Admission" accent="Requirements." />
          <div className="grid sm:grid-cols-2 gap-3">
            {data.requirements.map((r, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-[#EAB308]/40 transition-all">
                <FileText size={14} className="text-[#EAB308] shrink-0 mt-0.5" />
                <span className="text-sm font-semibold text-slate-700 leading-snug">{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.scholarships?.length > 0 && (
        <div>
          <SectionHeading label="Scholarships &" accent="Financial Aid." />
          <ul className="space-y-3">{data.scholarships.map((s, i) => <CheckItem key={i} text={s} />)}</ul>
        </div>
      )}

      {data.workOpportunities && (
        <div>
          <SectionHeading label="Work" accent="Opportunities." />
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-sm font-semibold text-slate-600 leading-relaxed">{data.workOpportunities}</p>
          </div>
        </div>
      )}

      {data.visaProcess?.length > 0 && (
        <div>
          <SectionHeading label="Visa" accent="Process." />
          <ol className="space-y-4">
            {data.visaProcess.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-[#EAB308] text-[#0B1F3A] text-xs font-black flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>
                <span className="text-sm font-semibold text-slate-700 leading-snug pt-1">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {data.studentLife && (
        <div>
          <SectionHeading label="Student" accent="Life." />
          <div className="p-6 bg-[#0B1F3A] rounded-2xl">
            <p className="text-sm font-semibold text-white/80 leading-relaxed">{data.studentLife}</p>
          </div>
        </div>
      )}

      {allFaqs.length > 0 && (
        <div>
          <SectionHeading label="Common" accent="Questions." />
          <div className="bg-white rounded-3xl border border-slate-100 divide-y divide-slate-100 shadow-sm px-6">
            {allFaqs.map((faq, i) => (
              <FaqItem key={i} question={faq.question} answer={faq.answer}
                isOpen={openFaq===i} onClick={() => setOpenFaq(openFaq===i ? null : i)} />
            ))}
          </div>
        </div>
      )}

      {data.important && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4">
          <AlertCircle size={18} className="text-[#EAB308] shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-700 mb-1">Important Note</p>
            <p className="text-sm text-amber-800 font-medium leading-relaxed">{data.important}</p>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Coming Soon ────────────────────────────────────────────── */
const ComingSoon = ({ countryName }) => (
  <div className="py-32 flex flex-col items-center justify-center text-center gap-5">
    <div className="w-20 h-20 bg-amber-50 border-2 border-amber-200 rounded-3xl flex items-center justify-center">
      <Globe size={32} className="text-[#EAB308]" />
    </div>
    <div>
      <h3 className="text-2xl font-black text-[#0B1F3A] uppercase">Coming Soon</h3>
      <p className="text-slate-500 text-sm max-w-sm leading-relaxed mt-2">
        Detailed visa information for <strong>{countryName}</strong> is being prepared.
        Contact our team for personalised guidance.
      </p>
    </div>
    <a
      href="tel:+8801348992268"
      className="px-8 py-4 bg-[#EAB308] text-[#0B1F3A] rounded-full font-black text-xs uppercase tracking-widest hover:bg-amber-400 transition-all"
    >
      Call Us Now
    </a>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
const ServiceAreaCountry = () => {
  const { countryId } = useParams();
  const navigate = useNavigate();

  /* ── Data lookup ── */
  const mapping     = countryDataMap[countryId] || {};
  const workData    = mapping.workVisaId    ? workVisaData.find(d => d.id === mapping.workVisaId)       : null;
  const visitData   = mapping.visitVisaId   ? visaData.find(d => d.id === mapping.visitVisaId)          : null;
  const studentData = mapping.studentVisaId ? studentVisaData.find(d => d.id === mapping.studentVisaId) : null;

  const anyData     = workData || visitData || studentData;
  const countryName = anyData?.country
    || countryId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const flagCode    = FLAG_CODE[countryId] || 'un';
  const flagSrc     = `https://flagcdn.com/w320/${flagCode}.png`;

  /* ── Tabs — computed once, stable ── */
  const tabs = useMemo(() => [
    visitData   && { key: 'visit',   label: 'Visit Visa',   icon: Globe },
    workData    && { key: 'work',    label: 'Work Permit',  icon: Briefcase },
    studentData && { key: 'student', label: 'Student Visa', icon: GraduationCap },
  ].filter(Boolean), [visitData, workData, studentData]);

  /* ── Active tab — default to first available tab immediately ── */
  const [activeTab, setActiveTab] = useState(() => tabs[0]?.key || null);

  /* Reset when country changes */
  useEffect(() => {
    if (tabs.length > 0 && !activeTab) setActiveTab(tabs[0].key);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [countryId]);

  /* ── Modal ── */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSending, setIsSending]     = useState(false);
  const [formData, setFormData]       = useState({ name:'', contact:'', passport:'', nationality:'' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    const reqType = activeTab === 'visit' ? 'Visit Visa' : activeTab === 'work' ? 'Work Permit' : 'Student Visa';
    try {
      await emailjs.send('service_lyaj90m', 'template_jcvorut', {
        user_name: formData.name, user_contact: formData.contact,
        user_passport: formData.passport, user_nationality: formData.nationality,
        package_name: countryName, request_type: `${reqType} Application`,
      }, 'fBmCBPjkDCPx48ro6');
      alert('Application sent! We will contact you within 24 hours.');
      setIsModalOpen(false);
      setFormData({ name:'', contact:'', passport:'', nationality:'' });
    } catch { alert('Something went wrong. Please try again.'); }
    finally { setIsSending(false); }
  };

  const activeSidebarData = activeTab==='visit' ? visitData : activeTab==='work' ? workData : studentData;

  const fadeUp = {
    initial: { opacity:0, y:24 }, whileInView: { opacity:1, y:0 },
    viewport: { once:true }, transition: { duration:0.5 },
  };

  return (
    <div className="min-h-screen bg-white font-['Inter',_sans-serif] overflow-x-hidden">

      {/* ── APPLICATION MODAL ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#0B1F3A]/80 backdrop-blur-sm" />
            <motion.div
              initial={{ scale:0.92, opacity:0, y:20 }}
              animate={{ scale:1, opacity:1, y:0 }}
              exit={{ scale:0.92, opacity:0, y:20 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 lg:p-10 relative z-10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={22} className="text-[#0B1F3A]" />
              </button>
              <div className="mb-8">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#EAB308]">
                  {activeTab==='visit' ? 'Visit Visa' : activeTab==='work' ? 'Work Permit' : 'Student Visa'} — {countryName}
                </span>
                <h3 className="text-2xl font-black text-[#0B1F3A] uppercase tracking-tight mt-1">Start Application</h3>
                <p className="text-slate-500 text-sm mt-1">Our team will contact you within 24 hours.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { placeholder:'Full Name',       key:'name',        type:'text' },
                  { placeholder:'Contact Number',  key:'contact',     type:'tel'  },
                  { placeholder:'Passport Number', key:'passport',    type:'text' },
                  { placeholder:'Nationality',     key:'nationality', type:'text' },
                ].map(({ placeholder, key, type: t }) => (
                  <div key={key}>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block mb-1">{placeholder}</label>
                    <input required type={t} placeholder={placeholder} value={formData[key]}
                      onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-semibold text-[#0B1F3A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#EAB308] transition-all" />
                  </div>
                ))}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
                  <AlertCircle size={15} className="text-[#EAB308] shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 font-medium leading-relaxed">
                    Do not make any irreversible commitments until you receive final confirmation.
                  </p>
                </div>
                <button disabled={isSending} type="submit"
                  className="w-full bg-[#EAB308] text-[#0B1F3A] py-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-amber-400 transition-all disabled:opacity-50">
                  {isSending ? (
                    <><motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:'linear' }}
                      className="w-4 h-4 border-2 border-[#0B1F3A] border-t-transparent rounded-full" />Sending…</>
                  ) : <><Send size={14} />Submit Application</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-[#0B1F3A] to-[#0d2a50] overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#EAB308]/10 rounded-full translate-x-1/2 -translate-y-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div {...fadeUp}>
            <button onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-[#EAB308] font-bold text-[11px] uppercase tracking-[0.3em] mb-10 hover:gap-3 transition-all">
              <ArrowLeft size={15} />Back to Destinations
            </button>

            <div className="flex items-center gap-5 mb-6">
              <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-xl"
                style={{ border:'3px solid rgba(255,255,255,0.15)' }}>
                <img src={flagSrc} alt={countryName}
                  className="w-full h-full object-cover"
                  onError={e => { e.target.style.display='none'; }} />
              </div>
              <div className="flex flex-wrap gap-2">
                {tabs.map(t => (
                  <Badge key={t.key} gold={activeTab===t.key}>{t.label}</Badge>
                ))}
                {tabs.length === 0 && <Badge>Coming Soon</Badge>}
              </div>
            </div>

            <h1 className="text-5xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter uppercase">
              {countryName}
              <span className="text-[#EAB308] italic font-light lowercase text-3xl lg:text-5xl block mt-3">
                {tabs.length > 1 ? `${tabs.length} Services Available` : tabs[0]?.label || 'Explore Opportunities'}
              </span>
            </h1>

            {tabs.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-10">
                {tabs.map(tab => (
                  <TabBtn key={tab.key} label={tab.label} icon={tab.icon}
                    active={activeTab===tab.key} onClick={() => setActiveTab(tab.key)} />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="py-14 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">

            {/* LEFT */}
            <div className="lg:w-[65%]">
              {tabs.length === 0 && <ComingSoon countryName={countryName} />}

              <AnimatePresence mode="wait">
                {activeTab==='visit' && visitData && (
                  <motion.div key="visit"
                    initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                    exit={{ opacity:0, y:-16 }} transition={{ duration:0.3 }}>
                    <VisitSection data={visitData} />
                  </motion.div>
                )}
                {activeTab==='work' && workData && (
                  <motion.div key="work"
                    initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                    exit={{ opacity:0, y:-16 }} transition={{ duration:0.3 }}>
                    <WorkSection data={workData} />
                  </motion.div>
                )}
                {activeTab==='student' && studentData && (
                  <motion.div key="student"
                    initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                    exit={{ opacity:0, y:-16 }} transition={{ duration:0.3 }}>
                    <StudentSection data={studentData} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* RIGHT SIDEBAR */}
            {tabs.length > 0 && (
              <aside className="lg:w-[35%]">
                <div className="sticky top-24 space-y-6">

                  <div className="bg-[#0B1F3A] rounded-[2rem] p-8 text-white shadow-xl">
                    <h3 className="text-base font-black uppercase mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
                      <Info size={16} className="text-[#EAB308]" />Quick Overview
                    </h3>
                    <div className="space-y-4 mb-8">
                      {activeSidebarData && <>
                        <InfoRow label="Visa Type"   value={activeSidebarData.visaType} />
                        <InfoRow label="Category"    value={activeSidebarData.category} />
                        <InfoRow label="Processing"  value={activeSidebarData.processingTime} />
                        <InfoRow label="Region"      value={activeSidebarData.region} />
                        {activeTab==='work' && <>
                          <InfoRow label="Salary"     value={activeSidebarData.salary} />
                          <InfoRow label="Work Hours" value={activeSidebarData.workHours} />
                        </>}
                        {(activeTab==='visit'||activeTab==='student') &&
                          <InfoRow label="Duration" value={activeSidebarData.duration} />}
                      </>}
                    </div>
                    <button onClick={() => setIsModalOpen(true)}
                      className="w-full py-4 bg-[#EAB308] text-[#0B1F3A] rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-amber-400 transition-all shadow-lg">
                      Start Application
                    </button>
                  </div>

                  {tabs.length > 1 && (
                    <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Other Services</p>
                      <div className="space-y-2">
                        {tabs.filter(t => t.key !== activeTab).map(tab => (
                          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                            className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#EAB308] hover:shadow-sm transition-all text-left">
                            <tab.icon size={15} className="text-[#EAB308]" />
                            <span className="text-sm font-bold text-[#0B1F3A]">{tab.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Need Expert Advice?</p>
                    <div className="space-y-4">
                      <a href="tel:+8801348992268"
                        className="flex items-center gap-3 text-[#0B1F3A] hover:text-[#EAB308] transition-colors group">
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200 group-hover:border-[#EAB308] transition-all"><Phone size={15} /></div>
                        <span className="font-bold text-sm">+880 1348 992268</span>
                      </a>
                      <div className="flex items-center gap-3 text-[#0B1F3A]">
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200"><Mail size={15} /></div>
                        <span className="font-bold text-sm">info@snjglobal.com</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#EAB308] rounded-[2rem] p-6 text-[#0B1F3A]">
                    <Shield size={20} className="mb-3" />
                    <p className="font-black text-sm uppercase tracking-tight">100% Legal & Verified</p>
                    <p className="text-xs font-semibold mt-1 text-[#0B1F3A]/70 leading-relaxed">
                      All applications processed through official government channels only.
                    </p>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      {tabs.length > 0 && (
        <section className="py-20 px-6 lg:px-8 bg-white">
          <motion.div {...fadeUp}
            className="max-w-7xl mx-auto bg-[#0B1F3A] rounded-[3.5rem] p-12 lg:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-72 h-72 bg-[#EAB308]/10 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#EAB308]/5 rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />
            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl lg:text-6xl font-black text-white leading-tight uppercase">
                Ready for <span className="text-[#EAB308]">{countryName}?</span>
              </h2>
              <p className="text-white/60 font-medium text-sm max-w-md mx-auto leading-relaxed">
                Our expert team handles everything — documentation, applications, and follow-ups.
              </p>
              <button onClick={() => setIsModalOpen(true)}
                className="bg-[#EAB308] text-[#0B1F3A] px-10 py-5 font-black uppercase text-xs tracking-[0.3em] hover:bg-white transition-all shadow-xl rounded-full">
                Start Your Application →
              </button>
            </div>
          </motion.div>
        </section>
      )}
    </div>
  );
};

export default ServiceAreaCountry;