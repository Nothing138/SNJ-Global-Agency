import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, ShieldCheck, Mail, Phone,
  Briefcase, Target, Eye, Users,
  HelpCircle, Plus, Minus, CheckCircle2,
  Lock, Scale, Zap, Calendar, MapPin, Star
} from 'lucide-react';
import Navbar from '../../components/Navbar';

/* ─────────────────────────────────────────────
   DESIGN TOKENS  (Navy / White / Gold system)
───────────────────────────────────────────── */
const NAVY   = '#0B1F3A';
const NAVY2  = '#0F172A';
const GOLD   = '#EAB308';
const GRAY   = '#64748B';
const WHITE  = '#FFFFFF';
const LIGHT  = '#F8FAFC';

/* ─────────────────────────────────────────────
   INLINE STYLE HELPERS
───────────────────────────────────────────── */
const S = {
  // Page shell
  page: {
    fontFamily: '"Times New Roman", serif',
    background: WHITE,
    color: GRAY,
  },

  // Section wrappers
  sectionWhite: { padding: '80px 0', background: WHITE },
  sectionLight:  { padding: '80px 0', background: LIGHT },
  sectionNavy:   { padding: '80px 0', background: NAVY },

  inner: { maxWidth: 1160, margin: '0 auto', padding: '0 32px' },

  // Typography
  h1: {
    fontFamily: '"Times New Roman", serif',
    fontSize: 'clamp(40px, 6vw, 56px)',
    fontWeight: 'bold',
    color: WHITE,
    lineHeight: 1.15,
  },
  h2Navy: {
    fontFamily: '"Times New Roman", serif',
    fontSize: 'clamp(28px, 3.5vw, 34px)',
    fontWeight: 'bold',
    color: NAVY2,
    lineHeight: 1.3,
  },
  h2White: {
    fontFamily: '"Times New Roman", serif',
    fontSize: 'clamp(28px, 3.5vw, 34px)',
    fontWeight: 'bold',
    color: WHITE,
    lineHeight: 1.3,
  },
  h3: {
    fontFamily: '"Times New Roman", serif',
    fontSize: 28,
    fontWeight: 'bold',
    color: NAVY2,
    marginBottom: 16,
  },
  body: {
    fontFamily: '"Times New Roman", serif',
    fontSize: 17,
    color: GRAY,
    lineHeight: 1.75,
  },
  bodyWhite: {
    fontFamily: '"Times New Roman", serif',
    fontSize: 17,
    color: 'rgba(255,255,255,0.78)',
    lineHeight: 1.75,
  },
  label: {
    fontFamily: '"Times New Roman", serif',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    color: GOLD,
    display: 'block',
    marginBottom: 12,
  },
  goldItalic: {
    color: GOLD,
    fontStyle: 'italic',
  },
  dividerGold: {
    width: 56,
    height: 3,
    background: GOLD,
    borderRadius: 2,
    margin: '20px 0 32px',
  },
};

/* ─────────────────────────────────────────────
   REUSABLE: Section Header (centred)
───────────────────────────────────────────── */
const SectionHeader = ({ label, title, titleColor = NAVY2, center = true }) => (
  <div style={{ textAlign: center ? 'center' : 'left', marginBottom: 56 }}>
    <span style={S.label}>{label}</span>
    <h2 style={{ ...S.h2Navy, color: titleColor }}>{title}</h2>
    <div style={{ ...S.dividerGold, ...(center ? { margin: '20px auto 0' } : {}) }} />
  </div>
);

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const About = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [activeFaq, setActiveFaq] = useState(null);

  /* ── Expansion timeline data ── */
  const timeline = [
    {
      year: 'Sep 2026',
      title: 'Phase 1 — Foundation Offices',
      cities: ['Dhaka', 'Dubai', 'Kuala Lumpur', 'Baku', 'Nairobi', 'London'],
      color: GOLD,
    },
    {
      year: 'Jul 2027',
      title: 'Phase 2 — Destination Cities',
      cities: ['Toronto', 'New York', 'Sydney', 'Berlin', 'Paris', 'Johannesburg'],
      color: NAVY,
    },
    {
      year: '2030',
      title: 'Phase 3 — 45+ Service Points',
      cities: ['Southeast Asia', 'South Asia', 'Africa', 'Eastern Europe', 'Turkey', 'Georgia'],
      color: '#1e3a5f',
    },
  ];

  /* ── Values ── */
  const values = [
    { icon: <ShieldCheck size={22} color={GOLD} />, title: 'Transparency', desc: 'No hidden fees, no false promises. Every process is explained clearly.' },
    { icon: <Scale size={22} color={GOLD} />,       title: 'Integrity',    desc: 'We do not promise visas. We guide honestly through legal, proven paths.' },
    { icon: <Users size={22} color={GOLD} />,       title: 'Accessibility', desc: 'Opportunities should not be gatekept by confusion or middlemen.' },
    { icon: <Globe size={22} color={GOLD} />,       title: 'Impact',       desc: 'Reducing unsafe migration by making legal pathways genuinely reachable.' },
    { icon: <Lock size={22} color={GOLD} />,        title: 'Trust',        desc: 'Built for the moments when people are making the biggest decisions of their lives.' },
    { icon: <Zap size={22} color={GOLD} />,         title: 'Awareness',    desc: 'We believe wrong decisions happen because better options are unknown.' },
  ];

  /* ── FAQs ── */
  const faqs = [
    {
      q: 'What makes SNJ Global Routes different from other consultancies?',
      a: 'We do not promise visas or guaranteed outcomes. We are here to guide properly, keep things transparent, and make sure no one is misled. Our goal is to reduce misinformation, not profit from it.',
    },
    {
      q: 'Do you work with both individuals and institutions?',
      a: 'Yes. We support students, job seekers, and travelers individually, and we also connect companies and educational institutions with candidates who are genuinely ready and willing to contribute.',
    },
    {
      q: 'Is SNJ Global Routes part of any government body?',
      a: 'No. We are not affiliated with any government. We operate independently and our role is to guide people through legal, clear pathways — not to issue visas or make official immigration decisions.',
    },
    {
      q: 'Where are your offices located?',
      a: 'We started in Bangladesh in 2024 and are actively working toward physical offices in Dhaka, Dubai, Kuala Lumpur, Baku, Nairobi, and London by September 2026, with further expansion planned through 2030.',
    },
  ];

  /* ─── RENDER ─── */
  return (
    <>
      <Navbar />
      <div style={S.page}>

        {/* ════════════════════════════════
            HERO
        ════════════════════════════════ */}
        <section style={{
          position: 'relative',
          minHeight: '88vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: NAVY,
        }}>
          {/* Background image */}
          <img
            src="/src/assets/about us.jpg"
            alt="SNJ Global Routes"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              opacity: 0.32,
            }}
          />
          {/* Gradient overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(160deg, ${NAVY}E0 0%, ${NAVY}99 50%, ${NAVY}F0 100%)`,
          }} />

          {/* Gold accent lines */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: 4, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
          }} />

          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 32px', maxWidth: 860 }}
          >
            <span style={S.label}>Est. 2024 · Bangladesh</span>
            <h1 style={S.h1}>
              SNJ{' '}
              <span style={{ color: GOLD, fontStyle: 'italic', fontWeight: 300 }}>
                Global Routes
              </span>
            </h1>
            <p style={{ ...S.bodyWhite, maxWidth: 640, margin: '24px auto 0', fontSize: 18 }}>
              Bridging the gap between capable people and global opportunities — through
              <em style={{ color: GOLD }}> transparency, honesty, and proper guidance.</em>
            </p>
            <div style={{ width: 64, height: 3, background: GOLD, margin: '36px auto 0', borderRadius: 2 }} />
          </motion.div>
        </section>


        {/* ════════════════════════════════
            WHO WE ARE
        ════════════════════════════════ */}
        <section style={S.sectionWhite}>
          <div style={S.inner}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 64, alignItems: 'center' }}>

              {/* Image block */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9 }}
                style={{ position: 'relative' }}
              >
                <div style={{
                  position: 'absolute', inset: -12,
                  borderRadius: 40,
                  border: `2px solid ${GOLD}33`,
                }} />
                <img
                  src="/src/assets/about us.jpg"
                  alt="Who We Are"
                  style={{
                    width: '100%',
                    height: 520,
                    objectFit: 'cover',
                    borderRadius: 32,
                    display: 'block',
                  }}
                />
                {/* Quote card */}
                <div style={{
                  position: 'absolute',
                  bottom: 28, left: 28, right: 28,
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 16,
                  padding: '20px 24px',
                  borderLeft: `4px solid ${GOLD}`,
                }}>
                  <p style={{
                    fontFamily: '"Times New Roman", serif',
                    fontSize: 15,
                    color: NAVY,
                    fontStyle: 'italic',
                    fontWeight: 'bold',
                    lineHeight: 1.5,
                    margin: 0,
                  }}>
                    "This is not just a business for us. It is an attempt to build something people can trust."
                  </p>
                </div>
              </motion.div>

              {/* Text block */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9 }}
              >
                <span style={S.label}>Who We Are</span>
                <h2 style={S.h2Navy}>
                  Started in Bangladesh.{' '}
                  <span style={S.goldItalic}>Built for the World.</span>
                </h2>
                <div style={S.dividerGold} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {[
                    `SNJ Global Routes started in Bangladesh in 2024 from a simple but serious realization. There are millions of people who are capable, hardworking, and ready to build a better future, but they do not have access to the right channels. At the same time, many countries and companies are struggling to find reliable and skilled people.`,
                    `Somewhere in between, a gap has formed, and it is not a small one. Because of this gap, people often end up trusting the wrong sources. They fall into fraud, misinformation, or illegal migration routes. Many lose their money, their confidence, and sometimes even their lives. Not because they are unqualified, but because they did not have the right guidance or a clear, honest path.`,
                    `That is exactly why SNJ Global Routes was built. We are trying to create a platform where things are simple and clear. A student can look for the right institution based on their results and budget. A job seeker can understand where they are applying and what the process actually is. A traveler can plan without confusion or hidden information.`,
                    `We are not part of any government, and we do not promise visas. That is not how this works. What we do is guide people properly, keep things transparent, and try to make sure no one is misled in the process. At the end of the day, this is not just a business for us. It is an attempt to build something people can trust when they are making some of the most important decisions of their lives.`,
                  ].map((para, i) => (
                    <p key={i} style={S.body}>{para}</p>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>


        {/* ════════════════════════════════
            OUR MISSION
        ════════════════════════════════ */}
        <section style={S.sectionLight}>
          <div style={S.inner}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 64, alignItems: 'center' }}>

              {/* Text block */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.85 }}
              >
                <span style={S.label}>Our Mission</span>
                <h2 style={S.h2Navy}>
                  Making Global Opportunities{' '}
                  <span style={S.goldItalic}>Transparent &amp; Honest</span>
                </h2>
                <div style={S.dividerGold} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {[
                    `Our mission is to make global opportunities easier to access, more transparent, and more honest, while also reducing illegal migration and exploitation.`,
                    `We want people to stop feeling like they have no choice but to take risky or unclear paths. If someone wants to study, work, or travel abroad, they should be able to do it with proper information and a clear understanding of what they are getting into.`,
                    `At the same time, we are working to connect companies and institutions with people who are actually ready and willing to contribute. The talent is already there. The connection is what has been missing.`,
                    `We also believe that awareness matters a lot. Many people make wrong decisions simply because they do not know better options exist. If we can guide even a portion of them toward safer and legal pathways, that itself creates real impact.`,
                    `In the long run, we want to work with governments, organizations, and institutions in a practical way, so the system becomes safer and more reliable for everyone involved.`,
                  ].map((para, i) => (
                    <p key={i} style={S.body}>{para}</p>
                  ))}
                </div>
              </motion.div>

              {/* Icon card grid */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.85, delay: 0.15 }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  {[
                    { icon: <Globe size={28} color={GOLD} />,       label: 'Global Access',       sub: 'Opportunities for everyone' },
                    { icon: <ShieldCheck size={28} color={GOLD} />, label: 'Safe Pathways',        sub: 'Legal, clear, honest routes' },
                    { icon: <Users size={28} color={GOLD} />,       label: 'Talent Connection',    sub: 'People meet right institutions' },
                    { icon: <Target size={28} color={GOLD} />,      label: 'Reduce Exploitation',  sub: 'Fight fraud and misinformation' },
                    { icon: <Zap size={28} color={GOLD} />,         label: 'Awareness First',      sub: 'Inform before anything else' },
                    { icon: <Briefcase size={28} color={GOLD} />,   label: 'Real Impact',          sub: 'Systemic change, not quick fixes' },
                  ].map((item, i) => (
                    <div key={i} style={{
                      background: WHITE,
                      borderRadius: 16,
                      padding: '24px 20px',
                      border: `1px solid #E2E8F0`,
                      borderBottom: `3px solid ${GOLD}`,
                    }}>
                      <div style={{ marginBottom: 12 }}>{item.icon}</div>
                      <p style={{ fontFamily: '"Times New Roman", serif', fontSize: 14, fontWeight: 'bold', color: NAVY2, marginBottom: 4 }}>{item.label}</p>
                      <p style={{ fontFamily: '"Times New Roman", serif', fontSize: 12, color: GRAY }}>{item.sub}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

            </div>
          </div>
        </section>


        {/* ════════════════════════════════
            OUR VISION
        ════════════════════════════════ */}
        <section style={{ ...S.sectionNavy, position: 'relative', overflow: 'hidden' }}>
          {/* Subtle pattern */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `radial-gradient(circle at 20% 50%, ${GOLD}10 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${GOLD}08 0%, transparent 40%)`,
          }} />

          <div style={{ ...S.inner, position: 'relative', zIndex: 1 }}>
            <SectionHeader
              label="Our Vision"
              title="A Future Where Opportunity is Clear & Accessible"
              titleColor={WHITE}
            />

            {/* Vision paragraphs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 64 }}>
              {[
                {
                  heading: 'The Platform We\'re Building',
                  text: 'Our vision is to build SNJ Global Routes into a platform that people genuinely trust when it comes to education, jobs, and moving across borders. We want to see a future where people do not feel forced to take illegal or dangerous steps just to move forward in life. Opportunities should be clear, structured, and accessible — not hidden behind confusion or middlemen.',
                },
                {
                  heading: 'Where We Are Going',
                  text: 'We are already working toward expanding beyond Bangladesh. By September 2026, we plan to have our first set of physical offices in Dhaka, Dubai, Kuala Lumpur, Baku, Nairobi, and London. These are not random choices. Each of these locations plays an important role in global student movement, job markets, or international connectivity.',
                },
                {
                  heading: 'The Bigger Picture',
                  text: 'Looking further ahead, by 2030, our goal is to build at least 45 service points worldwide — across Southeast Asia, South Asia, Africa, Eastern Europe, and transit countries like Turkey and Georgia. The idea is not just expansion for the sake of it, but to be present where people actually need support.',
                },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.12 }}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderTop: `3px solid ${GOLD}`,
                    borderRadius: 20,
                    padding: '32px 28px',
                  }}
                >
                  <h4 style={{
                    fontFamily: '"Times New Roman", serif',
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: GOLD,
                    fontStyle: 'italic',
                    marginBottom: 16,
                  }}>{card.heading}</h4>
                  <p style={S.bodyWhite}>{card.text}</p>
                </motion.div>
              ))}
            </div>

            {/* Expansion Timeline */}
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: 24,
              padding: '40px 36px',
            }}>
              <h3 style={{
                fontFamily: '"Times New Roman", serif',
                fontSize: 22,
                fontWeight: 'bold',
                color: WHITE,
                marginBottom: 36,
                textAlign: 'center',
              }}>
                Global Expansion Roadmap
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
                {timeline.map((phase, i) => (
                  <div key={i} style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 16,
                    padding: '24px 20px',
                    borderLeft: `4px solid ${GOLD}`,
                  }}>
                    <span style={{
                      fontFamily: '"Times New Roman", serif',
                      fontSize: 13,
                      fontWeight: 'bold',
                      color: GOLD,
                      letterSpacing: 2,
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: 8,
                    }}>{phase.year}</span>
                    <p style={{
                      fontFamily: '"Times New Roman", serif',
                      fontSize: 15,
                      fontWeight: 'bold',
                      color: WHITE,
                      marginBottom: 16,
                    }}>{phase.title}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {phase.cities.map((city, j) => (
                        <span key={j} style={{
                          fontFamily: '"Times New Roman", serif',
                          fontSize: 12,
                          background: 'rgba(234,179,8,0.15)',
                          color: GOLD,
                          border: `1px solid ${GOLD}44`,
                          borderRadius: 20,
                          padding: '4px 12px',
                        }}>
                          <MapPin size={10} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                          {city}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* 2030 stat bar */}
              <div style={{
                marginTop: 32,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 24,
                justifyContent: 'center',
              }}>
                {[
                  { num: '45+', label: 'Service Points by 2030' },
                  { num: '6',   label: 'Cities — Phase 1 (2026)' },
                  { num: '3',   label: 'Continents in Year One' },
                ].map((stat, i) => (
                  <div key={i} style={{ textAlign: 'center', padding: '16px 32px' }}>
                    <p style={{
                      fontFamily: '"Times New Roman", serif',
                      fontSize: 40,
                      fontWeight: 'bold',
                      color: GOLD,
                      lineHeight: 1,
                    }}>{stat.num}</p>
                    <p style={{
                      fontFamily: '"Times New Roman", serif',
                      fontSize: 13,
                      color: 'rgba(255,255,255,0.55)',
                      marginTop: 8,
                      letterSpacing: 1,
                    }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* ════════════════════════════════
            OUR COMMITMENT
        ════════════════════════════════ */}
        <section style={S.sectionWhite}>
          <div style={S.inner}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 64, alignItems: 'center' }}>

              {/* Commitment text */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.85 }}
              >
                <span style={S.label}>Our Commitment</span>
                <h2 style={S.h2Navy}>
                  We Are Not Here{' '}
                  <span style={S.goldItalic}>to Sell Dreams.</span>
                </h2>
                <div style={S.dividerGold} />

                <p style={{ ...S.body, marginBottom: 24 }}>
                  We are not here to sell dreams.
                </p>
                <p style={{ ...S.body, marginBottom: 24 }}>
                  We are here to make sure that when someone decides to take a step toward their future, they do it with the right information, a clear process, and someone they can rely on.
                </p>

                {/* Commitment pillars */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 32 }}>
                  {[
                    'Right information — always honest, always current.',
                    'Clear process — no hidden steps, no surprise costs.',
                    'Someone to rely on — present at every stage of the journey.',
                  ].map((point, i) => (
                    <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                      <div style={{
                        width: 28, height: 28, minWidth: 28,
                        borderRadius: '50%',
                        background: `${GOLD}18`,
                        border: `2px solid ${GOLD}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <CheckCircle2 size={14} color={GOLD} />
                      </div>
                      <p style={{ ...S.body, marginTop: 2 }}>{point}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Values grid */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.85 }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {values.map((v, i) => (
                    <div key={i} style={{
                      background: i % 3 === 0 ? NAVY : LIGHT,
                      borderRadius: 18,
                      padding: '24px 20px',
                      border: `1px solid ${i % 3 === 0 ? 'transparent' : '#E2E8F0'}`,
                    }}>
                      <div style={{ marginBottom: 12 }}>{v.icon}</div>
                      <p style={{
                        fontFamily: '"Times New Roman", serif',
                        fontSize: 15,
                        fontWeight: 'bold',
                        color: i % 3 === 0 ? WHITE : NAVY2,
                        marginBottom: 6,
                      }}>{v.title}</p>
                      <p style={{
                        fontFamily: '"Times New Roman", serif',
                        fontSize: 13,
                        color: i % 3 === 0 ? 'rgba(255,255,255,0.65)' : GRAY,
                        lineHeight: 1.6,
                      }}>{v.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

            </div>
          </div>
        </section>


        {/* ════════════════════════════════
            FAQ
        ════════════════════════════════ */}
        <section style={S.sectionLight}>
          <div style={{ ...S.inner, maxWidth: 860 }}>
            <SectionHeader
              label="Common Questions"
              title="What People Ask Us"
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {faqs.map((faq, idx) => (
                <div key={idx} style={{
                  background: WHITE,
                  borderRadius: 16,
                  border: `1px solid #E2E8F0`,
                  overflow: 'hidden',
                  borderLeft: activeFaq === idx ? `4px solid ${GOLD}` : `4px solid transparent`,
                  transition: 'border-left 0.25s',
                }}>
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      textAlign: 'left',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      gap: 16,
                    }}
                  >
                    <span style={{
                      fontFamily: '"Times New Roman", serif',
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: NAVY2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}>
                      <HelpCircle size={18} color={GOLD} style={{ minWidth: 18 }} />
                      {faq.q}
                    </span>
                    {activeFaq === idx
                      ? <Minus size={18} color={GOLD} style={{ minWidth: 18 }} />
                      : <Plus size={18} color={GRAY} style={{ minWidth: 18 }} />
                    }
                  </button>
                  <AnimatePresence>
                    {activeFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <p style={{
                          ...S.body,
                          padding: '0 24px 20px 54px',
                          borderTop: `1px solid #F1F5F9`,
                          paddingTop: 16,
                        }}>
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ════════════════════════════════
            CONTACT CTA
        ════════════════════════════════ */}
        <section style={{
          background: NAVY,
          padding: '80px 32px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: 3,
            background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
          }} />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span style={S.label}>Take the First Step</span>
            <h2 style={{ ...S.h2White, marginBottom: 16 }}>
              Start Your Journey{' '}
              <span style={{ color: GOLD, fontStyle: 'italic' }}>Today</span>
            </h2>
            <p style={{ ...S.bodyWhite, maxWidth: 520, margin: '0 auto 40px' }}>
              Reach out and speak with someone who will guide you honestly — no false promises, no pressure.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
              <a
                href="https://wa.me/8801348992268"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '16px 36px',
                  background: '#25D366',
                  color: WHITE,
                  borderRadius: 12,
                  fontFamily: '"Times New Roman", serif',
                  fontSize: 14,
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                }}
              >
                <Phone size={18} /> WhatsApp Us
              </a>
              <a
                href="mailto:supplyinfo365@gmail.com"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '16px 36px',
                  background: GOLD,
                  color: NAVY,
                  borderRadius: 12,
                  fontFamily: '"Times New Roman", serif',
                  fontSize: 14,
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                }}
              >
                <Mail size={18} /> Email Us
              </a>
            </div>
          </motion.div>
        </section>

      </div>
    </>
  );
};

export default About;