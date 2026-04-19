import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Lock, Cookie, CreditCard,
  CheckCircle2, XCircle, ChevronDown, ChevronUp,
  FileText, Eye, Settings, BarChart2, Globe,
  AlertTriangle, Database, UserCheck
} from 'lucide-react';

const NAVY  = '#0B1F3A';
const NAVY2 = '#0F172A';
const GOLD  = '#EAB308';
const GRAY  = '#64748B';
const WHITE = '#FFFFFF';
const LIGHT = '#F8FAFC';

const S = {
  page: {
    fontFamily: '"Times New Roman", serif',
    background: WHITE,
    color: GRAY,
    minHeight: '100vh',
  },
  inner: { maxWidth: 1140, margin: '0 auto', padding: '0 clamp(16px, 4vw, 32px)' },
  innerNarrow: { maxWidth: 900, margin: '0 auto', padding: '0 clamp(16px, 4vw, 32px)' },

  sectionWhite: { padding: 'clamp(40px, 8vw, 80px) 0', background: WHITE },
  sectionLight:  { padding: 'clamp(40px, 8vw, 80px) 0', background: LIGHT },
  sectionNavy:   { padding: 'clamp(40px, 8vw, 80px) 0', background: NAVY },

  label: {
    fontFamily: '"Times New Roman", serif',
    fontSize: 12, fontWeight: 'bold',
    letterSpacing: '3px', textTransform: 'uppercase',
    color: GOLD, display: 'block', marginBottom: 12,
  },
  h1: {
    fontFamily: '"Times New Roman", serif',
    fontSize: 'clamp(32px, 6vw, 56px)',
    fontWeight: 'bold', color: WHITE, lineHeight: 1.15, textTransform: 'uppercase',
  },
  h2Navy: {
    fontFamily: '"Times New Roman", serif',
    fontSize: 'clamp(22px, 3.5vw, 34px)',
    fontWeight: 'bold', color: NAVY2, lineHeight: 1.3,
  },
  h2White: {
    fontFamily: '"Times New Roman", serif',
    fontSize: 'clamp(22px, 3.5vw, 34px)',
    fontWeight: 'bold', color: WHITE, lineHeight: 1.3,
  },
  h3: {
    fontFamily: '"Times New Roman", serif',
    fontSize: 'clamp(17px, 2.2vw, 22px)', fontWeight: 'bold', color: NAVY2, marginBottom: 10,
  },
  body: {
    fontFamily: '"Times New Roman", serif',
    fontSize: 'clamp(15px, 1.6vw, 17px)', color: GRAY, lineHeight: 1.75,
  },
  bodyWhite: {
    fontFamily: '"Times New Roman", serif',
    fontSize: 'clamp(15px, 1.6vw, 17px)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.75,
  },
  goldItalic: { color: GOLD, fontStyle: 'italic' },
  dividerGold: { width: 56, height: 3, background: GOLD, borderRadius: 2, margin: '20px 0 32px' },
  dividerGoldCenter: { width: 56, height: 3, background: GOLD, borderRadius: 2, margin: '20px auto 32px' },
};

const SectionHeader = ({ label, title, sub, center = true, light = false }) => (
  <div style={{ textAlign: center ? 'center' : 'left', marginBottom: 'clamp(32px, 5vw, 56px)' }}>
    <span style={S.label}>{label}</span>
    <h2 style={light ? S.h2White : S.h2Navy}>{title}</h2>
    <div style={center ? S.dividerGoldCenter : S.dividerGold} />
    {sub && <p style={{ ...(light ? S.bodyWhite : S.body), maxWidth: 640, margin: center ? '0 auto' : '0' }}>{sub}</p>}
  </div>
);

const BulletList = ({ items }) => (
  <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
    {items.map((item, i) => (
      <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <CheckCircle2 size={15} color={GOLD} style={{ minWidth: 15, marginTop: 4 }} />
        <span style={S.body}>{item}</span>
      </li>
    ))}
  </ul>
);

const CrossList = ({ items }) => (
  <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
    {items.map((item, i) => (
      <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <XCircle size={15} color="#EF4444" style={{ minWidth: 15, marginTop: 4 }} />
        <span style={S.body}>{item}</span>
      </li>
    ))}
  </ul>
);

const ClauseRow = ({ number, title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.65 }}
    style={{ paddingBottom: 40, borderBottom: '1px solid #E2E8F0' }}
  >
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(8px, 2vw, 28px)', marginBottom: 8 }}>
      <span style={{
        fontFamily: '"Times New Roman", serif',
        fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 'bold',
        color: `${GOLD}20`, lineHeight: 1, minWidth: 48,
      }}>{number}</span>
      <h3 style={{ ...S.h3, flex: 1, minWidth: 160 }}>{title}</h3>
    </div>
    <div style={{ paddingLeft: 'clamp(0px, 2vw, 60px)' }}>
      {children}
    </div>
  </motion.div>
);

const PolicyDashboard = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [activeTab, setActiveTab] = useState('refund');

  const tabs = [
    { id: 'refund',  label: 'Refund Policy',  icon: <CreditCard size={18} /> },
    { id: 'privacy', label: 'Privacy Policy', icon: <Lock size={18} /> },
    { id: 'cookie',  label: 'Cookie Policy',  icon: <Cookie size={18} /> },
  ];

  return (
    <div style={S.page}>

      {/* ══════════ HERO ══════════ */}
      <section style={{
        position: 'relative', background: NAVY,
        padding: 'clamp(80px, 12vw, 120px) clamp(16px, 4vw, 50px) clamp(60px, 10vw, 100px)',
        textAlign: 'center', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 30% 50%, ${GOLD}09 0%, transparent 55%)` }} />
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: '"Times New Roman", serif', fontSize: 'clamp(80px, 18vw, 280px)', fontWeight: 'bold',
          color: 'rgba(255,255,255,0.025)', pointerEvents: 'none', userSelect: 'none',
        }}>SNJ</div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{ position: 'relative', zIndex: 2, maxWidth: 820, margin: '0 auto' }}
        >
          <span style={S.label}>SNJ Global Routes · Legal &amp; Data Framework</span>
          <h1 style={S.h1}>
            Policy{' '}
            <span style={{ color: GOLD, fontStyle: 'italic', fontWeight: 300 }}>Centre</span>
          </h1>
          <p style={{ fontFamily: '"Times New Roman", serif', fontSize: 13, letterSpacing: '4px', textTransform: 'uppercase', color: GOLD, marginTop: 14 }}>
            Refund · Privacy · Cookie
          </p>
          <div style={{ width: 64, height: 3, background: GOLD, margin: '28px auto 36px', borderRadius: 2 }} />
          <p style={{ ...S.bodyWhite, maxWidth: 560, margin: '0 auto', fontSize: 'clamp(14px, 1.8vw, 17px)' }}>
            All policies governing your use of SNJ Global Routes services are presented in full below. Please read each section carefully.
          </p>
        </motion.div>
      </section>


      {/* ══════════ TAB NAVIGATION ══════════ */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: WHITE, borderBottom: `2px solid #E2E8F0`,
        boxShadow: '0 2px 16px rgba(11,31,58,0.07)',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}>
        <div style={{ ...S.inner, display: 'flex', gap: 0, minWidth: 'max-content' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setTimeout(() => {
                  document.getElementById(tab.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
              }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: 'clamp(14px, 2vw, 20px) clamp(14px, 2.5vw, 28px)',
                fontFamily: '"Times New Roman", serif',
                fontSize: 'clamp(13px, 1.5vw, 15px)', fontWeight: 'bold',
                color: activeTab === tab.id ? GOLD : GRAY,
                background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: activeTab === tab.id ? `3px solid ${GOLD}` : '3px solid transparent',
                marginBottom: -2, whiteSpace: 'nowrap', transition: 'all 0.2s',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>


      {/* ══════════ REFUND POLICY ══════════ */}
      <section id="refund" style={S.sectionWhite}>
        <div style={S.inner}>
          <SectionHeader
            label="Section 1 — Financial Terms Protection Framework"
            title="Refund Policy"
            sub="All payments made to SNJ Global Routes are service-based consultancy fees representing professional time, effort, and expertise."
            center={false}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{
              background: LIGHT, borderRadius: 20,
              padding: 'clamp(20px, 3.5vw, 32px) clamp(16px, 3vw, 36px)',
              border: `1px solid ${GOLD}44`, borderLeft: `5px solid ${GOLD}`,
              marginBottom: 56, display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center',
            }}
          >
            <AlertTriangle size={48} color={GOLD} style={{ minWidth: 48, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{ ...S.body, fontWeight: 'bold', color: NAVY2, marginBottom: 6 }}>Important Notice</p>
              <p style={S.body}>
                Payments are <em style={S.goldItalic}>not contingent on outcomes</em>. Once service commences, all fees are fully earned and non-refundable regardless of result. This includes visa refusals, admission rejections, or any third-party decision.
              </p>
            </div>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            <ClauseRow number="1.1" title="Nature of Payments">
              <p style={{ ...S.body, marginBottom: 12 }}><strong style={{ color: NAVY2 }}>1.1.1</strong> All payments made to the Company are service-based consultancy fees.</p>
              <p style={{ ...S.body, marginBottom: 8 }}><strong style={{ color: NAVY2 }}>1.1.2</strong> Payments represent:</p>
              <BulletList items={['Professional time', 'Administrative effort', 'Advisory expertise', 'Coordination work']} />
              <p style={{ ...S.body, marginTop: 14 }}><strong style={{ color: NAVY2 }}>1.1.3</strong> Payments are <em style={S.goldItalic}>not contingent on outcomes.</em></p>
            </ClauseRow>

            <ClauseRow number="1.2" title="Pre-Service Refund Eligibility">
              <p style={{ ...S.body, marginBottom: 12 }}><strong style={{ color: NAVY2 }}>1.2.1</strong> If cancellation is requested <em style={S.goldItalic}>before any service commencement</em>:</p>
              <BulletList items={['(a) A partial refund may be considered', '(b) Administrative charges will be deducted', '(c) Payment gateway fees are non-recoverable', '(d) Internal processing costs may be deducted']} />
            </ClauseRow>

            <ClauseRow number="1.3" title="Post-Service Commencement Rule">
              <p style={{ ...S.body, marginBottom: 12 }}><strong style={{ color: NAVY2 }}>1.3.1</strong> Once service begins, all payments become:</p>
              <BulletList items={['Fully earned', 'Non-refundable', 'Irreversible']} />
              <p style={{ ...S.body, margin: '16px 0 8px' }}><strong style={{ color: NAVY2 }}>1.3.2</strong> This applies even if:</p>
              <CrossList items={['Client stops mid-process', 'Client withdraws application', 'Client changes decision']} />
            </ClauseRow>

            <ClauseRow number="1.4" title="Explicit Non-Refund Conditions">
              <p style={{ ...S.body, marginBottom: 12 }}>Refunds will <strong style={{ color: NAVY2 }}>not</strong> be issued for:</p>
              <CrossList items={['(a) Visa refusal or rejection', '(b) Admission rejection', '(c) Job application rejection', '(d) Embassy or government refusal', '(e) Processing delays', '(f) Policy changes', '(g) Third-party decisions']} />
            </ClauseRow>

            <ClauseRow number="1.5" title="Exceptional Refund Cases">
              <p style={{ ...S.body, marginBottom: 12 }}>Refunds may <em style={S.goldItalic}>only</em> be considered in strictly limited situations:</p>
              <BulletList items={['(a) Duplicate payment confirmed by system logs', '(b) Verified technical payment error', '(c) Fraudulent transaction confirmed by payment provider']} />
              <p style={{ ...S.body, margin: '16px 0 8px' }}>All refunds require:</p>
              <BulletList items={['Internal audit', 'Management approval', 'Documented verification']} />
            </ClauseRow>
          </div>
        </div>
      </section>


      {/* ══════════ PRIVACY POLICY ══════════ */}
      <section id="privacy" style={S.sectionLight}>
        <div style={S.inner}>
          <SectionHeader
            label="Section 2 — Data Governance Framework"
            title="Privacy Policy"
            sub="SNJ Global Routes collects only data necessary for service delivery, handled with strict security and full respect for your rights."
            center={false}
          />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))',
            gap: 20, marginBottom: 56,
          }}>
            {[
              { icon: <Database size={28} color={GOLD} />, label: 'Minimal Collection', sub: 'Only what is needed' },
              { icon: <Lock size={28} color={GOLD} />,     label: 'Secure Storage',     sub: 'Restricted access' },
              { icon: <Eye size={28} color={GOLD} />,      label: 'No Data Selling',    sub: 'Never sold or traded' },
              { icon: <UserCheck size={28} color={GOLD} />,label: 'Your Consent',       sub: 'Explicit agreement' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                style={{
                  background: WHITE, borderRadius: 16,
                  padding: 'clamp(16px, 2.5vw, 24px) clamp(12px, 2vw, 20px)',
                  border: '1px solid #E2E8F0', borderTop: `3px solid ${GOLD}`, textAlign: 'center',
                }}
              >
                <div style={{ marginBottom: 12 }}>{item.icon}</div>
                <p style={{ fontFamily: '"Times New Roman", serif', fontSize: 15, fontWeight: 'bold', color: NAVY2, marginBottom: 4 }}>{item.label}</p>
                <p style={{ fontFamily: '"Times New Roman", serif', fontSize: 13, color: GRAY }}>{item.sub}</p>
              </motion.div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            <ClauseRow number="2.1" title="Data Collection Principles">
              <p style={{ ...S.body, marginBottom: 12 }}><strong style={{ color: NAVY2 }}>2.1.1</strong> The Company collects only data necessary for service delivery.</p>
              <p style={{ ...S.body, marginBottom: 8 }}><strong style={{ color: NAVY2 }}>2.1.2</strong> This may include:</p>
              <BulletList items={['Identity information', 'Contact details', 'Passport information', 'Academic records', 'Employment history', 'Financial documents (if required)']} />
            </ClauseRow>

            <ClauseRow number="2.2" title="Purpose of Processing">
              <p style={{ ...S.body, marginBottom: 12 }}>Data is processed strictly for:</p>
              <BulletList items={['(a) Client assessment', '(b) Service delivery', '(c) Application preparation', '(d) Communication with third parties', '(e) Operational record keeping']} />
            </ClauseRow>

            <ClauseRow number="2.3" title="Data Sharing Restrictions">
              <p style={{ ...S.body, marginBottom: 8 }}><strong style={{ color: NAVY2 }}>2.3.1</strong> Data may only be shared when necessary with:</p>
              <BulletList items={['Universities', 'Employers', 'Immigration service partners', 'Verified third-party providers']} />
              <p style={{ ...S.body, marginTop: 16 }}><strong style={{ color: NAVY2 }}>2.3.2</strong> The Company does <strong style={{ color: NAVY2 }}>not</strong> <em style={S.goldItalic}>sell, rent, or trade data.</em></p>
            </ClauseRow>

            <ClauseRow number="2.4" title="Data Security Measures">
              <p style={{ ...S.body, marginBottom: 8 }}><strong style={{ color: NAVY2 }}>2.4.1</strong> The Company implements reasonable safeguards including:</p>
              <BulletList items={['Access control', 'Secure storage systems', 'Restricted internal access']} />
              <p style={{ ...S.body, marginTop: 16 }}><strong style={{ color: NAVY2 }}>2.4.2</strong> However, no system is fully secure, and the Client accepts inherent digital risk.</p>
            </ClauseRow>

            <ClauseRow number="2.5" title="Consent Clause">
              <p style={{ ...S.body, marginBottom: 12 }}>By using services, the Client explicitly consents to:</p>
              <BulletList items={['Data collection', 'Data processing', 'Necessary third-party sharing']} />
            </ClauseRow>
          </div>
        </div>
      </section>


      {/* ══════════ COOKIE POLICY ══════════ */}
      <section id="cookie" style={S.sectionWhite}>
        <div style={S.inner}>
          <SectionHeader
            label="Section 3 — Tracking and Analytics Framework"
            title="Cookie Policy"
            sub="Cookies are small data files stored on your device to enhance website performance, security, and your browsing experience."
            center={false}
          />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))',
            gap: 20, marginBottom: 56,
          }}>
            {[
              { icon: <ShieldCheck size={24} color={GOLD} />, type: '(a) Essential',    desc: 'Required for login, security, and core functionality.' },
              { icon: <BarChart2 size={24} color={GOLD} />,   type: '(b) Performance',  desc: 'Measure website usage and improve functionality.' },
              { icon: <Settings size={24} color={GOLD} />,    type: '(c) Functional',   desc: 'Remember user preferences and settings.' },
              { icon: <Eye size={24} color={GOLD} />,         type: '(d) Analytics',    desc: 'Track user behaviour and traffic patterns.' },
              { icon: <Globe size={24} color={GOLD} />,       type: '(e) Third-Party',  desc: 'Used for external tools such as analytics platforms.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                style={{
                  background: LIGHT, borderRadius: 16,
                  padding: 'clamp(16px, 2.5vw, 24px) clamp(12px, 2vw, 20px)',
                  border: '1px solid #E2E8F0', borderBottom: `3px solid ${GOLD}`,
                }}
              >
                <div style={{ marginBottom: 12 }}>{item.icon}</div>
                <p style={{ fontFamily: '"Times New Roman", serif', fontSize: 14, fontWeight: 'bold', color: NAVY2, marginBottom: 6 }}>{item.type}</p>
                <p style={{ fontFamily: '"Times New Roman", serif', fontSize: 13, color: GRAY, lineHeight: 1.6 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            <ClauseRow number="3.1" title="Definition">
              <p style={S.body}>Cookies are small data files stored on the User's device to enhance website performance. They allow our website to remember your preferences and improve the overall browsing experience.</p>
            </ClauseRow>

            <ClauseRow number="3.2" title="Categories of Cookies">
              <BulletList items={[
                '(a) Essential Cookies — Required for login, security, and core functionality',
                '(b) Performance Cookies — Measure website usage and improve functionality',
                '(c) Functional Cookies — Remember user preferences and settings',
                '(d) Analytics Cookies — Track user behaviour and traffic patterns',
                '(e) Third-Party Cookies — Used for external tools such as analytics platforms',
              ]} />
            </ClauseRow>

            <ClauseRow number="3.3" title="Purpose of Cookies">
              <p style={{ ...S.body, marginBottom: 12 }}>Cookies are used to:</p>
              <BulletList items={['Improve website performance', 'Analyse traffic patterns', 'Enhance user experience', 'Maintain security']} />
            </ClauseRow>

            <ClauseRow number="3.4" title="User Rights">
              <p style={{ ...S.body, marginBottom: 12 }}>Users may:</p>
              <BulletList items={['Disable cookies via browser settings', 'Restrict tracking', 'Delete stored cookies']} />
              <p style={{ ...S.body, marginTop: 16 }}><em style={S.goldItalic}>Some features may not function properly if cookies are disabled.</em></p>
            </ClauseRow>

            <ClauseRow number="3.5" title="Consent Mechanism">
              <p style={S.body}>
                Continued use of the website constitutes{' '}
                <em style={S.goldItalic}>full acceptance of cookie usage</em>{' '}
                as described in this policy. You may withdraw consent at any time by adjusting your browser settings.
              </p>
            </ClauseRow>
          </div>
        </div>
      </section>


      {/* ══════════ NAVY SUMMARY ══════════ */}
      <section style={{ ...S.sectionNavy, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 80% 20%, ${GOLD}08 0%, transparent 50%)` }} />
        <div style={{ ...S.inner, position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <span style={S.label}>Policy Summary</span>
          <h2 style={S.h2White}>Three Commitments. One Standard.</h2>
          <div style={S.dividerGoldCenter} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: 24, marginTop: 48 }}>
            {[
              { icon: <CreditCard size={32} color={GOLD} />, title: 'Refund Policy', desc: 'Service fees are earned upon commencement. Exceptions apply only for verified technical or duplicate payment errors.' },
              { icon: <Lock size={32} color={GOLD} />,       title: 'Privacy Policy', desc: 'Your data is collected minimally, stored securely, never sold, and only shared when strictly necessary for service delivery.' },
              { icon: <Cookie size={32} color={GOLD} />,     title: 'Cookie Policy',  desc: 'Cookies improve your experience. You retain the right to disable or delete them at any time via your browser settings.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.12 }}
                style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)',
                  borderTop: `3px solid ${GOLD}`, borderRadius: 20,
                  padding: 'clamp(24px, 3.5vw, 36px) clamp(16px, 2.5vw, 28px)', textAlign: 'left',
                }}
              >
                <div style={{ marginBottom: 16 }}>{item.icon}</div>
                <h4 style={{ fontFamily: '"Times New Roman", serif', fontSize: 18, fontWeight: 'bold', color: WHITE, marginBottom: 12 }}>{item.title}</h4>
                <p style={S.bodyWhite}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════ FOOTER ══════════ */}
      <footer style={{
        background: NAVY,
        padding: 'clamp(40px, 7vw, 64px) clamp(16px, 4vw, 32px)',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
        borderTop: `1px solid rgba(255,255,255,0.08)`,
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
        <p style={{ fontFamily: '"Times New Roman", serif', fontSize: 18, fontWeight: 'bold', letterSpacing: '4px', textTransform: 'uppercase', color: WHITE, marginBottom: 8 }}>SNJ Global Routes</p>
        <p style={{ fontFamily: '"Times New Roman", serif', fontSize: 13, fontStyle: 'italic', color: 'rgba(255,255,255,0.4)' }}>
          Independent International Consultancy · Est. 2024 · Bangladesh
        </p>
      </footer>

    </div>
  );
};

export default PolicyDashboard;