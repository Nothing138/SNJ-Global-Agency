import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight, Phone, Mail, MessageSquare,
  BellRing, Globe, Users, Stamp,
  PlaneTakeoff, ArrowRight, Sparkles
} from 'lucide-react';

const SERVICES = [
  {
    label: 'Work Visa',
    sublabel: 'Applications & Processing',
    icon: Stamp,
    path: '/visa',
    num: '01',
    accent: '#D4AF37',
    tag: 'Most Popular',
    shape: 'hexagon',
  },
  {
    label: 'Employer',
    sublabel: 'Recruitment & Staffing',
    icon: Users,
    path: '/employer',
    num: '02',
    accent: '#0B1F3A',
    tag: 'For Business',
    shape: 'diamond',
  },
  {
    label: 'Citizenship',
    sublabel: 'Residency & Naturalization',
    icon: Globe,
    path: '/citizenship',
    num: '03',
    accent: '#1a6b4a',
    tag: 'Life-Changing',
    shape: 'shield',
  },
  {
    label: 'Flight',
    sublabel: 'Booking & Travel',
    icon: PlaneTakeoff,
    path: '/flight',
    num: '04',
    accent: '#7c3aed',
    tag: 'Fast & Easy',
    shape: 'wing',
  },
];

const supportLinks = [
  { icon: <MessageSquare size={13} />, label: 'WhatsApp', color: 'bg-[#25D366]', link: 'https://wa.me/48728356666' },
  { icon: <Mail size={13} />, label: 'Email Us', color: 'bg-[#0B1F3A]', link: 'mailto:directorsnj932@gmail.com' },
  { icon: <Phone size={13} />, label: 'Call Us', color: 'bg-[#D4AF37]', link: 'tel:+48222085497' },
];

/* ─── Geometric icon frames ──────────────────────────────────────────── */
const HexagonIcon = ({ color, Icon }) => (
  <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
    <svg viewBox="0 0 44 44" className="absolute inset-0 w-full h-full">
      <polygon points="22,2 40,12 40,32 22,42 4,32 4,12"
        fill={`${color}18`} stroke={color} strokeWidth="1.5" />
    </svg>
    <Icon size={16} style={{ color }} />
  </div>
);

const DiamondIcon = ({ color, Icon }) => (
  <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
    <svg viewBox="0 0 44 44" className="absolute inset-0 w-full h-full">
      <rect x="7" y="7" width="30" height="30" rx="2"
        fill={`${color}18`} stroke={color} strokeWidth="1.5"
        transform="rotate(45 22 22)" />
    </svg>
    <Icon size={16} style={{ color }} />
  </div>
);

const ShieldIconComp = ({ color, Icon }) => (
  <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
    <svg viewBox="0 0 44 44" className="absolute inset-0 w-full h-full">
      <path d="M22 3 L40 11 L40 24 C40 33 22 41 22 41 C22 41 4 33 4 24 L4 11 Z"
        fill={`${color}18`} stroke={color} strokeWidth="1.5" />
    </svg>
    <Icon size={16} style={{ color }} />
  </div>
);

const WingIcon = ({ color, Icon }) => (
  <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
    <svg viewBox="0 0 44 44" className="absolute inset-0 w-full h-full">
      <ellipse cx="22" cy="22" rx="18" ry="11"
        fill={`${color}18`} stroke={color} strokeWidth="1.5"
        transform="rotate(-20 22 22)" />
    </svg>
    <Icon size={16} style={{ color }} />
  </div>
);

const SHAPE_MAP = {
  hexagon: HexagonIcon,
  diamond: DiamondIcon,
  shield: ShieldIconComp,
  wing: WingIcon,
};

/* ─── Main Component ─────────────────────────────────────────────────── */
const Hero = () => {
  const navigate = useNavigate();
  const [showSupport, setShowSupport] = useState(false);
  const [activeService, setActiveService] = useState(null);
  const [hoveredService, setHoveredService] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) setIsLoggedIn(true);
  }, []);

  const handleServiceClick = (index, path) => {
    setActiveService(index);
    navigate(path);
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white pt-28 sm:pt-32 pb-24"
      style={{ fontFamily: "'Times New Roman', serif" }}
    >
      {/* ── Background ───────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 65%)', transform: 'translate(25%,-25%)' }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(11,31,58,0.05) 0%, transparent 65%)', transform: 'translate(-20%,20%)' }} />
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.022 }}>
          <defs>
            <pattern id="dotsHero" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="#0B1F3A" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotsHero)" />
        </svg>
        <div className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg,transparent,#D4AF37 25%,#D4AF37 75%,transparent)' }} />
      </div>

      {/* ── Content wrapper — same horizontal padding both sides ── */}
      <div className="w-full px-8 sm:px-12 lg:px-16 relative z-10 max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-16 items-center">

          {/* ══ LEFT ══════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col"
          >
            {/* ── Headline ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}>
              <h1
                className="font-black uppercase leading-[0.93] tracking-[-0.02em] text-[#0B1F3A] mb-1"
                style={{ fontSize: 'clamp(2.2rem, 6.5vw, 4.2rem)', textShadow: '0 3px 0 rgba(11,31,58,0.07)' }}>
                ONE PLATFORM,
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.28, duration: 0.7 }}
              className="flex items-center gap-4 mb-1">
              <div className="w-12 h-[3px] bg-[#D4AF37] shrink-0 rounded-full" />
              <h1
                className="font-black uppercase leading-[0.93] tracking-[-0.02em] italic"
                style={{
                  fontSize: 'clamp(3.0rem, 6.5vw, 4.2rem)',
                  background: 'linear-gradient(135deg, #D4AF37 0%, #f0cc60 50%, #b8940e 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(2px 2px 0 rgba(212,175,55,0.22))',
                }}>
                ENDLESS
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="mb-8"
            >
              <h1
                className="font-black uppercase leading-[0.93] tracking-[-0.02em] text-[#0B1F3A]"
                style={{
                  fontSize: 'clamp(2.2rem, 6.5vw, 4.2rem)',
                  textShadow: '0 3px 0 rgba(11,31,58,0.07)',
                }}
              >
                Opportunities.
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="text-slate-500 text-[15px] sm:text-base mb-10 leading-[1.85] max-w-[90%]"
              style={{ fontFamily: 'Georgia, serif' }}>
              Turning dreams into reality — connecting people to careers,
              students to education, and businesses to the right talent worldwide.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.52 }}
              className="flex flex-wrap items-center gap-4 mb-10">
              {!isLoggedIn ? (
                <button
                  onClick={() => navigate('/register')}
                  className="group relative px-8 py-3.5 bg-[#D4AF37] text-white font-black uppercase text-[10px] tracking-[0.22em] rounded-sm flex items-center gap-2.5 overflow-hidden"
                  style={{ boxShadow: '4px 4px 0 rgba(11,31,58,0.18)' }}>
                  <span className="relative z-10 flex items-center gap-2">Get Started <ArrowUpRight size={15} /></span>
                  <span className="absolute inset-0 bg-[#0B1F3A] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              ) : (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-3.5 bg-[#0B1F3A] text-white font-black uppercase text-[10px] tracking-[0.22em] rounded-sm">
                  Go to Dashboard
                </button>
              )}
              <button
                onClick={() => navigate('/about')}
                className="px-8 py-3.5 border border-[#0B1F3A]/20 text-[#0B1F3A] font-black uppercase text-[10px] tracking-[0.22em] rounded-sm hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors duration-300">
                About Us
              </button>
            </motion.div>

            {/* Disclaimer */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="border-l-[3px] border-[#D4AF37] bg-amber-50/50 pl-5 pr-4 py-4 rounded-r-xl flex items-start gap-4 max-w-[90%]">
              <div className="relative shrink-0">
                <motion.div
                  animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="absolute inset-0 bg-[#D4AF37]/40 rounded-full" />
                <div className="relative bg-[#D4AF37] p-2 rounded-full text-white z-10">
                  <BellRing size={14} />
                </div>
              </div>
              <div>
                <p className="text-[#0B1F3A] font-black uppercase text-[9px] tracking-[0.2em] mb-1.5">Official Disclaimer</p>
                <p className="text-[#0B1F3A]/65 text-[11px] sm:text-xs leading-relaxed italic" style={{ fontFamily: 'Georgia, serif' }}>
                  "We provide professional consultancy and application support services only —
                  a private agency with no affiliation to any government body."
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* ══ RIGHT — SERVICES PANEL ════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative">

            {/* Art-deco corner accents */}
            <div className="absolute -top-4 -right-4 w-14 h-14 border-t-2 border-r-2 border-[#D4AF37]/45 rounded-tr-xl pointer-events-none" />
            <div className="absolute -bottom-4 -left-4 w-14 h-14 border-b-2 border-l-2 border-[#D4AF37]/45 rounded-bl-xl pointer-events-none" />

            <div
              className="rounded-2xl overflow-hidden border border-[#0B1F3A]/8"
              style={{ boxShadow: '0 24px 64px rgba(11,31,58,0.10), 0 4px 20px rgba(11,31,58,0.06)' }}>

              {/* Hookline header */}
              <div className="relative bg-[#0B1F3A] px-6 pt-5 pb-4 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.05]" style={{
                  backgroundImage: 'repeating-linear-gradient(45deg,#D4AF37 0,#D4AF37 1px,transparent 0,transparent 50%)',
                  backgroundSize: '10px 10px'
                }} />
                <div className="relative flex items-start gap-3">
                  <div className="mt-1 bg-[#D4AF37]/15 border border-[#D4AF37]/30 rounded-lg p-1.5 shrink-0">
                    <Sparkles size={14} className="text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="text-[#D4AF37]/50 font-bold uppercase text-[7.5px] tracking-[0.32em] mb-1.5">SNJ GlobalRoutes</p>
                    <h3 className="text-white font-black text-[1.1rem] sm:text-[1.25rem] leading-tight">
                      Not sure where to start? We'll guide you.
                    </h3>
                    
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[1px]"
                  style={{ background: 'linear-gradient(90deg,transparent,rgba(212,175,55,0.5) 40%,rgba(212,175,55,0.5) 60%,transparent)' }} />
              </div>

              {/* 2×2 service grid */}
              <div className="bg-[#FAFAF9] p-3 grid grid-cols-2 gap-2.5">
                {SERVICES.map((svc, i) => {
                  const isActive = activeService === i;
                  const isHovered = hoveredService === i;
                  const ShapeComp = SHAPE_MAP[svc.shape];

                  return (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.09 }}
                      onClick={() => handleServiceClick(i, svc.path)}
                      onMouseEnter={() => setHoveredService(i)}
                      onMouseLeave={() => setHoveredService(null)}
                      className="relative group text-left focus:outline-none overflow-hidden rounded-xl border transition-all duration-300"
                      style={{
                        borderColor: (isActive || isHovered) ? svc.accent : 'rgba(11,31,58,0.09)',
                        background: isActive
                          ? svc.accent
                          : isHovered
                            ? `${svc.accent}08`
                            : '#ffffff',
                        boxShadow: (isActive || isHovered)
                          ? `0 6px 20px ${svc.accent}20, 3px 3px 0 ${svc.accent}28`
                          : '0 2px 6px rgba(11,31,58,0.04)',
                        transform: isHovered && !isActive ? 'translateY(-2px)' : 'none',
                      }}
                    >
                      <div className="p-4 flex flex-col gap-2 min-h-[148px]">

                        {/* Tag + number */}
                        <div className="flex items-center justify-between">
                          <span
                            className="text-[7px] font-black uppercase tracking-[0.2em] px-1.5 py-0.5 rounded-full"
                            style={{
                              background: isActive ? 'rgba(255,255,255,0.18)' : `${svc.accent}14`,
                              color: isActive ? '#fff' : svc.accent,
                            }}>
                            {svc.tag}
                          </span>
                          <span
                            className="font-black text-2xl leading-none select-none"
                            style={{ color: isActive ? 'rgba(255,255,255,0.10)' : `${svc.accent}10` }}>
                            {svc.num}
                          </span>
                        </div>

                        {/* Shape icon */}
                        <div style={{ filter: isActive ? 'brightness(10)' : 'none' }}>
                          <ShapeComp color={svc.accent} Icon={svc.icon} />
                        </div>

                        {/* Label + sublabel */}
                        <div className="flex-1">
                          <p
                            className="font-black uppercase text-[12px] tracking-[0.08em] leading-none mb-1"
                            style={{ color: isActive ? '#fff' : '#0B1F3A' }}>
                            {svc.label}
                          </p>
                          <p
                            className="text-[8.5px] font-semibold leading-snug"
                            style={{ color: isActive ? 'rgba(255,255,255,0.55)' : 'rgba(11,31,58,0.35)' }}>
                            {svc.sublabel}
                          </p>
                        </div>

                        {/* Explore row */}
                        <div className={`flex items-center gap-1 transition-all duration-300 ${isActive || isHovered ? 'opacity-100' : 'opacity-0'}`}>
                          <span
                            className="text-[8px] font-black uppercase tracking-widest"
                            style={{ color: isActive ? 'rgba(255,255,255,0.7)' : svc.accent }}>
                            Explore
                          </span>
                          <ArrowRight size={9} style={{ color: isActive ? 'rgba(255,255,255,0.7)' : svc.accent }} />
                        </div>

                        {/* Bottom accent line */}
                        <div
                          className="absolute bottom-0 left-0 right-0 h-[2px] transition-transform duration-300 origin-left rounded-b-xl"
                          style={{
                            background: isActive ? 'rgba(255,255,255,0.3)' : svc.accent,
                            transform: isActive || isHovered ? 'scaleX(1)' : 'scaleX(0)',
                          }}
                        />
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Stats footer */}
              <div className="grid grid-cols-3 bg-white border-t border-[#0B1F3A]/8">
                {[
                  { val: '12k+', label: 'Placements' },
                  { val: '50+', label: 'Countries' },
                  { val: '99%', label: 'Satisfaction' },
                ].map((s, i) => (
                  <div key={i} className={`px-3 py-3 text-center ${i < 2 ? 'border-r border-[#0B1F3A]/8' : ''}`}>
                    <p className="text-[#D4AF37] text-base font-black italic tracking-tight">{s.val}</p>
                    <p className="text-[#0B1F3A]/28 text-[7.5px] font-bold uppercase tracking-[0.2em] mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Free Counseling button */}
            <div className="absolute -bottom-5 left-5">
              <motion.button
                onClick={() => setShowSupport(s => !s)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="group relative bg-[#0B1F3A] text-white py-2.5 px-5 rounded-sm flex items-center gap-2.5 overflow-hidden"
                style={{ boxShadow: '3px 3px 0 #D4AF37' }}>
                <span className="absolute inset-0 bg-[#D4AF37] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <Sparkles
                  size={13}
                  className={`relative z-10 transition-all duration-300 ${showSupport ? 'rotate-12 scale-110' : 'animate-pulse'}`}
                />
                <p className="relative z-10 text-[9px] font-black uppercase tracking-[0.2em]">Free Counseling</p>
              </motion.button>

              <AnimatePresence>
                {showSupport && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    className="absolute bottom-14 left-0 flex flex-col gap-2 z-50">
                    {supportLinks.map((s, i) => (
                      <a
                        key={i}
                        href={s.link}
                        className={`${s.color} text-white px-4 py-2.5 rounded-sm shadow-md flex items-center gap-2.5 hover:scale-105 transition-transform min-w-[144px]`}>
                        {s.icon}
                        <span className="text-[9px] font-black uppercase tracking-widest">{s.label}</span>
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;