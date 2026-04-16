import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Globe, FileCheck, ArrowRight,
  Handshake, Landmark, Star, Award, Briefcase,
  ChevronDown, ChevronUp, CheckCircle2, XCircle
} from 'lucide-react';

/* ─────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────── */
const NAVY  = '#0B1F3A';
const NAVY2 = '#0F172A';
const GOLD  = '#EAB308';
const GRAY  = '#64748B';
const WHITE = '#FFFFFF';
const LIGHT = '#F8FAFC';

const S = {
  page: { fontFamily: '"Times New Roman", serif', background: WHITE, color: GRAY },
  inner: { maxWidth: 1140, margin: '0 auto', padding: '0 32px' },
  sectionWhite: { padding: '80px 0', background: WHITE },
  sectionLight:  { padding: '80px 0', background: LIGHT },
  sectionNavy:   { padding: '80px 0', background: NAVY },
  label: {
    fontFamily: '"Times New Roman", serif',
    fontSize: 12, fontWeight: 'bold',
    letterSpacing: '3px', textTransform: 'uppercase',
    color: GOLD, display: 'block', marginBottom: 12,
  },
  h1: {
    fontFamily: '"Times New Roman", serif',
    fontSize: 'clamp(40px, 6vw, 56px)',
    fontWeight: 'bold', color: WHITE, lineHeight: 1.15,
  },
  h2Navy: {
    fontFamily: '"Times New Roman", serif',
    fontSize: 'clamp(28px, 3.5vw, 34px)',
    fontWeight: 'bold', color: NAVY2, lineHeight: 1.3,
  },
  h2White: {
    fontFamily: '"Times New Roman", serif',
    fontSize: 'clamp(28px, 3.5vw, 34px)',
    fontWeight: 'bold', color: WHITE, lineHeight: 1.3,
  },
  h3: {
    fontFamily: '"Times New Roman", serif',
    fontSize: 22, fontWeight: 'bold', color: NAVY2, marginBottom: 12,
  },
  body: {
    fontFamily: '"Times New Roman", serif',
    fontSize: 17, color: GRAY, lineHeight: 1.75,
  },
  bodyWhite: {
    fontFamily: '"Times New Roman", serif',
    fontSize: 17, color: 'rgba(255,255,255,0.75)', lineHeight: 1.75,
  },
  goldItalic: { color: GOLD, fontStyle: 'italic' },
  dividerGold: { width: 56, height: 3, background: GOLD, borderRadius: 2, margin: '20px 0 32px' },
  dividerGoldCenter: { width: 56, height: 3, background: GOLD, borderRadius: 2, margin: '20px auto 32px' },
};

/* ─── SECTION HEADER ─── */
const SectionHeader = ({ label, title, sub, center = true, light = false }) => (
  <div style={{ textAlign: center ? 'center' : 'left', marginBottom: 56 }}>
    <span style={S.label}>{label}</span>
    <h2 style={light ? S.h2White : S.h2Navy}>{title}</h2>
    <div style={center ? S.dividerGoldCenter : S.dividerGold} />
    {sub && (
      <p style={{ ...(light ? S.bodyWhite : S.body), maxWidth: 620, margin: center ? '0 auto' : '0' }}>
        {sub}
      </p>
    )}
  </div>
);

/* ─── CLAUSE BLOCK ─── */
const ClauseBlock = ({ number, title, goldSubtitle, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7 }}
    style={{
      display: 'grid', gridTemplateColumns: 'auto 1fr',
      gap: 32, paddingBottom: 48, borderBottom: '1px solid #E2E8F0',
    }}
  >
    <span style={{
      fontFamily: '"Times New Roman", serif',
      fontSize: 56, fontWeight: 'bold',
      color: `${GOLD}22`, lineHeight: 1, minWidth: 72, textAlign: 'right',
    }}>{number}</span>
    <div>
      <h3 style={S.h3}>{title}</h3>
      {goldSubtitle && (
        <p style={{
          fontFamily: '"Times New Roman", serif', fontSize: 16,
          fontStyle: 'italic', color: GOLD, fontWeight: 'bold', marginBottom: 16,
        }}>{goldSubtitle}</p>
      )}
      {children}
    </div>
  </motion.div>
);

/* ─── LISTS ─── */
const BulletList = ({ items }) => (
  <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
    {items.map((item, i) => (
      <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <CheckCircle2 size={16} color={GOLD} style={{ minWidth: 16, marginTop: 3 }} />
        <span style={S.body}>{item}</span>
      </li>
    ))}
  </ul>
);

const CrossList = ({ items }) => (
  <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
    {items.map((item, i) => (
      <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <XCircle size={16} color="#EF4444" style={{ minWidth: 16, marginTop: 3 }} />
        <span style={S.body}>{item}</span>
      </li>
    ))}
  </ul>
);

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
const TermsConditions = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [openClause, setOpenClause] = useState(null);

  const advantages = [
    {
      icon: <Landmark size={36} color={GOLD} />,
      title: 'Sovereign Knowledge',
      desc: 'We master the hidden requirements of global mobility laws to safeguard your journey at every stage.',
    },
    {
      icon: <Award size={36} color={GOLD} />,
      title: 'Premium Strategy',
      desc: 'Every case is handled by senior advisors to ensure maximum clarity, precision, and informed decision-making.',
    },
    {
      icon: <Briefcase size={36} color={GOLD} />,
      title: 'Full Guidance',
      desc: 'From eligibility assessment to document organisation, we manage every detail with professionalism.',
    },
  ];

  const quickClauses = [
    { id: 0, title: '1.1 Formation of Agreement', content: 'This document constitutes a legally binding agreement between SNJ Global Routes and any person accessing, browsing, registering, or using our website or services. By accessing or using any part of our services, you confirm that you have read, understood, and accepted all terms without limitation. If you do not agree, you must immediately cease all use of the website and services.' },
    { id: 1, title: '1.3 Definition and Scope of Services', content: 'The Company provides non-binding advisory and facilitation services only. Services include: initial eligibility assessment, educational pathway guidance, job market orientation, assistance in structuring applications and documentation, review and organisation of supporting documents, coordination with third-party institutions, and general procedural guidance regarding international mobility.' },
    { id: 2, title: '1.4 No Guarantee, No Assurance', content: 'No visa approval, job placement, university admission, or residency outcome is guaranteed under any circumstances. All outcomes are determined exclusively by third-party authorities including governments, embassies, universities, and employers. Any expectation of guaranteed results is expressly excluded and void.' },
    { id: 3, title: '1.7 Limitation of Liability', content: 'The Company shall not be liable for any financial loss, loss of opportunity, emotional distress, application rejection, delays caused by third parties, or government/institutional decisions. Maximum liability shall not exceed the total amount paid for the specific service.' },
    { id: 4, title: '1.9 Governing Law', content: 'This Agreement shall be governed by the laws of England and Wales. Any disputes shall be subject to exclusive jurisdiction of courts in England and Wales.' },
  ];

  return (
    <div style={S.page}>

      {/* ══════════ HERO ══════════ */}
      <section style={{
        position: 'relative', minHeight: '72vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: NAVY, overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
        <Globe size={700} color={WHITE} style={{ position: 'absolute', right: -120, bottom: -120, opacity: 0.04 }} />
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 20% 50%, ${GOLD}0A 0%, transparent 60%)` }} />

        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1 }}
          style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 32px', maxWidth: 860 }}
        >
          <span style={S.label}>SNJ Global Routes · Legal Framework</span>
          <h1 style={S.h1}>
            Terms <span style={{ color: GOLD }}>&amp;</span>{' '}
            <span style={{ fontStyle: 'italic', fontWeight: 300 }}>Conditions</span>
          </h1>
          <p style={{ ...S.bodyWhite, fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', marginTop: 12 }}>
            Official Engagement Policy · Master Legal Agreement
          </p>
          <div style={{ width: 64, height: 3, background: GOLD, margin: '28px auto 32px', borderRadius: 2 }} />
          <div style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 20, padding: '28px 36px', maxWidth: 700, margin: '0 auto',
          }}>
            <p style={{ ...S.bodyWhite, fontStyle: 'italic', fontSize: 18, margin: 0 }}>
              "Precision. Integrity. Global Reach. By engaging our services, you enter into a professional agreement governed by{' '}
              <span style={{ color: GOLD }}>elite standards of transparency.</span>"
            </p>
          </div>
        </motion.div>
      </section>


      {/* ══════════ OFFICIAL STATUS ══════════ */}
      <section style={S.sectionLight}>
        <div style={S.inner}>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 40, alignItems: 'center',
              background: WHITE, borderRadius: 24, padding: '40px 48px',
              border: `1px solid ${GOLD}55`, borderLeft: `6px solid ${GOLD}`,
            }}
          >
            <ShieldCheck size={72} color={NAVY} style={{ minWidth: 72 }} />
            <div>
              <span style={S.label}>Official Consultancy Status</span>
              <h2 style={S.h2Navy}>SNJ Global Routes is an <span style={S.goldItalic}>Independent Advisory Firm</span></h2>
              <div style={S.dividerGold} />
              <p style={S.body}>
                SNJ Global Routes is a privately owned, independent international consultancy and facilitation service provider. We operate in the sectors of international education guidance, employment facilitation support, travel and mobility consultancy, and documentation and application assistance.
              </p>
              <p style={{ ...S.body, marginTop: 16, fontStyle: 'italic', fontWeight: 'bold', color: NAVY2 }}>
                We are not affiliated with any government, embassy, sovereign consulate, or visa-issuing body. Our expertise lies in preparation and guidance — final decisions remain exclusively with the relevant government authorities.
              </p>
            </div>
          </motion.div>
        </div>
      </section>


      {/* ══════════ 1.1 FORMATION ══════════ */}
      <section style={S.sectionWhite}>
        <div style={S.inner}>
          <SectionHeader label="Section 1.1" title="Formation of Agreement" center={false} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={S.body}>
              <strong style={{ color: NAVY2 }}>1.1.1</strong>{' '}
              This document constitutes a legally binding agreement between SNJ Global Routes{' '}
              (<em style={S.goldItalic}>"Company", "we", "us", "our"</em>) and any person accessing,
              browsing, registering, or using our website or services{' '}
              (<em style={S.goldItalic}>"Client", "User", "you", "your"</em>).
            </p>
            <p style={S.body}>
              <strong style={{ color: NAVY2 }}>1.1.2</strong>{' '}
              By accessing or using any part of our services, you confirm that you have read, understood, and accepted all terms without limitation.
            </p>
            <p style={S.body}>
              <strong style={{ color: NAVY2 }}>1.1.3</strong>{' '}
              If you do not agree, you must immediately cease all use of the website and services.
            </p>
          </div>
        </div>
      </section>


      {/* ══════════ FULL POLICY CLAUSES ══════════ */}
      <section style={S.sectionLight}>
        <div style={S.inner}>
          <SectionHeader
            label="Master Agreement"
            title="Full Policy Clauses"
            sub="All terms are presented in full. Please read each clause carefully before engaging our services."
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>

            <ClauseBlock number="1.2" title="Legal Nature of the Company" goldSubtitle="The 'Independent Firm' Declaration">
              <p style={S.body}>SNJ Global Routes is a privately owned, independent international consultancy and facilitation service provider.</p>
              <p style={{ ...S.body, marginTop: 12, marginBottom: 8 }}>The Company operates in the sectors of:</p>
              <BulletList items={['International education guidance','Employment facilitation support','Travel and mobility consultancy','Documentation and application assistance']} />
              <p style={{ ...S.body, marginTop: 16, marginBottom: 8 }}>The Company is <strong style={{ color: NAVY2 }}>not</strong>:</p>
              <CrossList items={['A government authority','An immigration department','An embassy or consulate','A visa issuing body','A recruitment agency acting on behalf of any state']} />
              <p style={{ ...S.body, marginTop: 16 }}>
                <strong style={{ color: NAVY2 }}>1.2.4</strong> The Company does not exercise any statutory, regulatory, or governmental power.
              </p>
            </ClauseBlock>

            <ClauseBlock number="1.3" title="Definition and Scope of Services" goldSubtitle="The 'Advisory Only' Standard">
              <p style={S.body}><strong style={{ color: NAVY2 }}>1.3.1</strong> The Company provides non-binding advisory and facilitation services only.</p>
              <p style={{ ...S.body, margin: '16px 0 8px' }}><strong style={{ color: NAVY2 }}>1.3.2</strong> Services may include:</p>
              <BulletList items={[
                '(a) Initial eligibility assessment based on Client-provided information',
                '(b) Educational pathway guidance based on qualifications and budget',
                '(c) Job market orientation and general employment opportunity guidance',
                '(d) Assistance in structuring applications and documentation',
                '(e) Review and organisation of supporting documents',
                '(f) Coordination and communication assistance with third-party institutions',
                '(g) General procedural guidance regarding international mobility',
              ]} />
              <p style={{ ...S.body, margin: '16px 0 8px' }}><strong style={{ color: NAVY2 }}>1.3.3</strong> The Company does not:</p>
              <CrossList items={[
                'Submit applications with decision-making authority',
                'Guarantee acceptance or approval',
                'Influence any external decision-making body',
                'Act as a legal representative in immigration or judicial matters',
              ]} />
            </ClauseBlock>

            <ClauseBlock number="1.4" title="No Guarantee, No Assurance, No Representation" goldSubtitle="The 'Zero Guarantee' Clause">
              <p style={{ ...S.body, marginBottom: 12 }}><strong style={{ color: NAVY2 }}>1.4.1</strong> The Client expressly acknowledges that:</p>
              <CrossList items={[
                '(a) No visa approval is guaranteed under any circumstances',
                '(b) No job placement is guaranteed under any circumstances',
                '(c) No university admission is guaranteed under any circumstances',
                '(d) No residency, citizenship, or settlement outcome is guaranteed',
              ]} />
              <p style={{ ...S.body, marginTop: 16 }}>
                <strong style={{ color: NAVY2 }}>1.4.2</strong> All outcomes are determined exclusively by third-party authorities, including but not limited to governments, embassies, universities, and employers.
              </p>
              <p style={{ ...S.body, marginTop: 12 }}>
                <strong style={{ color: NAVY2 }}>1.4.3</strong> Any expectation of guaranteed results is expressly excluded and void.
              </p>
            </ClauseBlock>

            <ClauseBlock number="1.5" title="Accuracy of Information and Client Responsibility" goldSubtitle="The 'Client Accountability' Protocol">
              <p style={{ ...S.body, marginBottom: 12 }}><strong style={{ color: NAVY2 }}>1.5.1</strong> The Client is solely responsible for ensuring that all information provided is:</p>
              <BulletList items={['Accurate', 'Complete', 'Truthful', 'Up to date']} />
              <p style={{ ...S.body, marginTop: 16 }}>
                <strong style={{ color: NAVY2 }}>1.5.2</strong> The Company shall not be liable for any delay, rejection, or loss caused by incorrect or incomplete data.
              </p>
              <p style={{ ...S.body, marginTop: 12 }}>
                <strong style={{ color: NAVY2 }}>1.5.3</strong> The Client is responsible for verifying authenticity of all documents before submission.
              </p>
            </ClauseBlock>

            <ClauseBlock number="1.6" title="Service Commencement and Resource Allocation" goldSubtitle="The 'Commitment First' Protocol">
              <p style={{ ...S.body, marginBottom: 12 }}><strong style={{ color: NAVY2 }}>1.6.1</strong> Service commencement occurs immediately when the Company begins any of the following:</p>
              <BulletList items={['Case evaluation','Consultation','Document review','Eligibility analysis','Internal file creation']} />
              <p style={{ ...S.body, margin: '16px 0 8px' }}><strong style={{ color: NAVY2 }}>1.6.2</strong> Upon commencement, the Company allocates:</p>
              <BulletList items={['Human resources','Administrative capacity','Operational time','External coordination efforts']} />
              <p style={{ ...S.body, marginTop: 16 }}>
                <strong style={{ color: NAVY2 }}>1.6.3</strong> These allocations constitute full service engagement regardless of outcome.
              </p>
            </ClauseBlock>

            <ClauseBlock number="1.7" title="Limitation of Liability" goldSubtitle="The 'Delivery Boundary' Standard">
              <p style={{ ...S.body, marginBottom: 12 }}><strong style={{ color: NAVY2 }}>1.7.1</strong> The Company shall not be liable for any:</p>
              <CrossList items={['(a) Financial loss','(b) Loss of opportunity','(c) Emotional distress','(d) Application rejection','(e) Delays caused by third parties','(f) Government or institutional decisions']} />
              <p style={{ ...S.body, marginTop: 16 }}>
                <strong style={{ color: NAVY2 }}>1.7.2</strong> The Client agrees that all services are used at their own risk.
              </p>
              <p style={{ ...S.body, marginTop: 12 }}>
                <strong style={{ color: NAVY2 }}>1.7.3</strong> Maximum liability, if any, shall not exceed the total amount paid for the specific service.
              </p>
            </ClauseBlock>

            <ClauseBlock number="1.8" title="Right to Refuse Service" goldSubtitle="The 'Service Integrity' Clause">
              <p style={{ ...S.body, marginBottom: 12 }}><strong style={{ color: NAVY2 }}>1.8.1</strong> The Company reserves the right to refuse, suspend, or terminate services where:</p>
              <CrossList items={['False information is provided','Illegal activity is suspected','Abuse or misconduct occurs','Compliance risk is identified']} />
            </ClauseBlock>

            <ClauseBlock number="1.9" title="Governing Law" goldSubtitle="The 'Jurisdiction' Standard">
              <p style={S.body}>
                <strong style={{ color: NAVY2 }}>1.9.1</strong> This Agreement shall be governed by the laws of <em style={S.goldItalic}>England and Wales</em>.
              </p>
              <p style={{ ...S.body, marginTop: 12 }}>
                <strong style={{ color: NAVY2 }}>1.9.2</strong> Any disputes shall be subject to exclusive jurisdiction of courts in England and Wales.
              </p>
            </ClauseBlock>

          </div>
        </div>
      </section>


      {/* ══════════ SNJ ADVANTAGE ══════════ */}
      <section style={{ ...S.sectionNavy, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 80% 20%, ${GOLD}08 0%, transparent 50%)` }} />
        <div style={{ ...S.inner, position: 'relative', zIndex: 1 }}>
          <SectionHeader label="Why SNJ Global Routes" title="The SNJ Advantage" light center />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {advantages.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.12 }}
                style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)',
                  borderTop: `3px solid ${GOLD}`, borderRadius: 20, padding: '36px 28px',
                }}
              >
                <div style={{ marginBottom: 20 }}>{item.icon}</div>
                <h4 style={{ fontFamily: '"Times New Roman", serif', fontSize: 18, fontWeight: 'bold', color: WHITE, marginBottom: 12 }}>{item.title}</h4>
                <p style={S.bodyWhite}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════ QUICK REFERENCE ══════════ */}
      <section style={S.sectionWhite}>
        <div style={{ ...S.inner, maxWidth: 860 }}>
          <SectionHeader label="Quick Reference" title="Key Clauses at a Glance" sub="Expand any clause below for a plain-English summary of the most important terms." />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {quickClauses.map((clause) => (
              <div key={clause.id} style={{
                background: WHITE, border: `1px solid #E2E8F0`,
                borderLeft: openClause === clause.id ? `4px solid ${GOLD}` : `4px solid transparent`,
                borderRadius: 14, overflow: 'hidden', transition: 'border-left 0.25s',
              }}>
                <button
                  onClick={() => setOpenClause(openClause === clause.id ? null : clause.id)}
                  style={{
                    width: '100%', padding: '18px 24px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'none', border: 'none', cursor: 'pointer', gap: 16,
                  }}
                >
                  <span style={{ fontFamily: '"Times New Roman", serif', fontSize: 16, fontWeight: 'bold', color: NAVY2, textAlign: 'left' }}>
                    {clause.title}
                  </span>
                  {openClause === clause.id ? <ChevronUp size={18} color={GOLD} /> : <ChevronDown size={18} color={GRAY} />}
                </button>
                <AnimatePresence>
                  {openClause === clause.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p style={{ ...S.body, padding: '16px 24px 20px', borderTop: '1px solid #F1F5F9', margin: 0 }}>
                        {clause.content}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════ TESTIMONIALS ══════════ */}
      <section style={S.sectionLight}>
        <div style={S.inner}>
          <SectionHeader label="Client Verification" title="Trusted by Clients Worldwide" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {[
              { initial: 'R', name: 'Robert H., CEO TechCorp', text: '"The transparency regarding their policy actually made me trust them more. It is clear they are a high-end firm that does not waste time. My business visa was approved perfectly."' },
              { initial: 'S', name: 'Sophia K., International Lawyer', text: '"Precision is the word. SNJ Global Routes caught a documentation error that two other agencies missed. Their protocol is strict, but it gets results where others fail."' },
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.12 }}
                style={{
                  background: WHITE, borderRadius: 24, padding: '36px 32px',
                  border: '1px solid #E2E8F0', borderBottom: `3px solid ${GOLD}`,
                }}
              >
                <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={16} fill={GOLD} color={GOLD} />)}
                </div>
                <p style={{ ...S.body, fontStyle: 'italic', marginBottom: 24 }}>{review.text}</p>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%', background: NAVY,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: '"Times New Roman", serif', fontSize: 18, fontWeight: 'bold', color: WHITE,
                  }}>{review.initial}</div>
                  <p style={{ fontFamily: '"Times New Roman", serif', fontSize: 14, fontWeight: 'bold', color: NAVY2, letterSpacing: 1, textTransform: 'uppercase', margin: 0 }}>
                    {review.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════ FOOTER ══════════ */}
      <footer style={{ background: NAVY, padding: '72px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 28, opacity: 0.25 }}>
          <Handshake size={36} color={WHITE} />
          <Landmark size={36} color={WHITE} />
          <ShieldCheck size={36} color={WHITE} />
        </div>
        <p style={{ fontFamily: '"Times New Roman", serif', fontSize: 20, fontWeight: 'bold', letterSpacing: '4px', textTransform: 'uppercase', color: WHITE, marginBottom: 8 }}>
          SNJ Global Routes
        </p>
        <p style={{ fontFamily: '"Times New Roman", serif', fontSize: 14, fontStyle: 'italic', color: 'rgba(255,255,255,0.45)', marginBottom: 36 }}>
          Independent International Consultancy · Est. 2024 · Bangladesh
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 40px',
            background: GOLD, color: NAVY, borderRadius: 12, border: 'none', cursor: 'pointer',
            fontFamily: '"Times New Roman", serif', fontSize: 14, fontWeight: 'bold',
            letterSpacing: 1, textTransform: 'uppercase',
          }}>
            Consult an Officer <ArrowRight size={16} />
          </button>
          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 40px',
            background: 'transparent', color: WHITE, borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.25)', cursor: 'pointer',
            fontFamily: '"Times New Roman", serif', fontSize: 14, fontWeight: 'bold',
            letterSpacing: 1, textTransform: 'uppercase',
          }}>
            <FileCheck size={16} /> Download Policy PDF
          </button>
        </div>
      </footer>

    </div>
  );
};

export default TermsConditions;