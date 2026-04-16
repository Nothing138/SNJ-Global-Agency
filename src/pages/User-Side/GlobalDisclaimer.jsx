import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert, Scale, Banknote, UserX,
  Star, Target, Award, Globe
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

/* ─────────────────────────────────────────
   STYLE SYSTEM
───────────────────────────────────────── */
const S = {
  page: {
    fontFamily: '"Times New Roman", serif',
    background: WHITE,
    color: GRAY,
    minHeight: '100vh',
  },
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
    textTransform: 'uppercase',
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
    fontSize: 26, fontWeight: 'bold', color: NAVY2,
    marginBottom: 8, lineHeight: 1.3,
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
  dividerGold: {
    width: 56, height: 3, background: GOLD,
    borderRadius: 2, margin: '20px 0 32px',
  },
  dividerGoldCenter: {
    width: 56, height: 3, background: GOLD,
    borderRadius: 2, margin: '20px auto 32px',
  },
};

/* ─────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────── */
const SectionHeader = ({ label, title, sub, center = true, light = false }) => (
  <div style={{ textAlign: center ? 'center' : 'left', marginBottom: 56 }}>
    <span style={S.label}>{label}</span>
    <h2 style={light ? S.h2White : S.h2Navy}>{title}</h2>
    <div style={center ? S.dividerGoldCenter : S.dividerGold} />
    {sub && (
      <p style={{
        ...(light ? S.bodyWhite : S.body),
        maxWidth: 600, margin: center ? '0 auto' : '0',
      }}>
        {sub}
      </p>
    )}
  </div>
);

/* ─────────────────────────────────────────
   CLAUSE CARD
───────────────────────────────────────── */
const ClauseCard = ({ icon, title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7 }}
    style={{
      background: WHITE,
      borderRadius: 20,
      padding: '36px 32px',
      border: '1px solid #E2E8F0',
      borderTop: `3px solid ${GOLD}`,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: NAVY,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <h3 style={S.h3}>{title}</h3>
    </div>
    {children}
  </motion.div>
);

/* ─────────────────────────────────────────
   BULLET LIST
───────────────────────────────────────── */
const BulletList = ({ items }) => (
  <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
    {items.map((item, i) => (
      <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <span style={{
          width: 7, height: 7, borderRadius: '50%',
          background: GOLD, flexShrink: 0, marginTop: 8,
        }} />
        <span style={S.body}>{item}</span>
      </li>
    ))}
  </ul>
);

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
const GlobalDisclaimer = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const whyChooseUs = [
    {
      icon: <Target size={24} color={GOLD} />,
      title: 'Precision Strategy',
      desc: 'We map complex sovereign rules for a seamless submission experience tailored to your profile.',
    },
    {
      icon: <ShieldAlert size={24} color={GOLD} />,
      title: 'Licensed Integrity',
      desc: 'We operate as a legal entity, committed to ethical global mobility practices at every stage.',
    },
    {
      icon: <Award size={24} color={GOLD} />,
      title: 'Document Vetting',
      desc: 'Our specialists ensure your application meets the exact standards required by consulates worldwide.',
    },
  ];

  return (
    <div style={S.page}>

      {/* ══════════ HERO ══════════ */}
      <section style={{
        position: 'relative', background: NAVY,
        padding: '120px 32px 96px', textAlign: 'center', overflow: 'hidden',
      }}>
        {/* Gold top bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 4,
          background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
        }} />

        {/* Decorative radial */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 70% 30%, ${GOLD}0A 0%, transparent 55%)`,
        }} />

        {/* Watermark */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: '"Times New Roman", serif',
          fontSize: 'clamp(120px, 25vw, 320px)', fontWeight: 'bold',
          color: 'rgba(255,255,255,0.03)', pointerEvents: 'none', userSelect: 'none',
        }}>
          SNJ
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{ position: 'relative', zIndex: 2, maxWidth: 800, margin: '0 auto' }}
        >
          <span style={S.label}>SNJ Global Routes · Legal Transparency</span>
          <h1 style={S.h1}>
            Global{' '}
            <span style={{ color: GOLD, fontStyle: 'italic', fontWeight: 300 }}>Disclaimer</span>
          </h1>
          <p style={{
            fontFamily: '"Times New Roman", serif',
            fontSize: 13, fontWeight: 'bold',
            letterSpacing: '4px', textTransform: 'uppercase',
            color: GOLD, marginTop: 16,
          }}>
            Operational Boundaries &amp; Transparency
          </p>
          <div style={{ width: 64, height: 3, background: GOLD, margin: '28px auto 0', borderRadius: 2 }} />
        </motion.div>
      </section>


      {/* ══════════ 5.1 GENERAL NATURE ══════════ */}
      <section style={S.sectionWhite}>
        <div style={S.inner}>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              background: LIGHT,
              borderRadius: 24,
              padding: '48px 48px',
              border: `1px solid ${GOLD}44`,
              borderLeft: `6px solid ${GOLD}`,
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: 40,
              alignItems: 'center',
            }}
          >
            <ShieldAlert size={72} color={NAVY} style={{ minWidth: 72 }} />
            <div>
              <span style={S.label}>Section  — General Nature</span>
              <h2 style={S.h2Navy}>
                All Content is Provided for{' '}
                <span style={S.goldItalic}>Informational &amp; Guidance Purposes</span>
              </h2>
              <div style={S.dividerGold} />
              <p style={S.body}>
                All content published by SNJ Global Routes is provided strictly for informational and guidance purposes only. Nothing contained within this website, its pages, documents, or communications constitutes a formal professional service beyond the advisory scope described in our Terms and Conditions.
              </p>
            </div>
          </motion.div>
        </div>
      </section>


      {/* ══════════ CORE MANDATE CARDS ══════════ */}
      <section style={S.sectionLight}>
        <div style={S.inner}>
          <SectionHeader
            label="Core Mandate"
            title="Operating with Elite Transparency"
            sub="Each of the following clauses defines the precise boundaries within which SNJ Global Routes operates."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>

            {/* 5.2 */}
            <ClauseCard icon={<Scale size={24} color={GOLD} />} title="No Professional Advice">
              <p style={S.body}>
                Nothing on this website constitutes:
              </p>
              <BulletList items={[
                'Legal advice',
                'Immigration advice',
                'Financial advice',
                'Government representation',
              ]} />
              <p style={{ ...S.body, marginTop: 16 }}>
                SNJ Global Routes operates as a <em style={S.goldItalic}>Private Independent Advisory Firm</em>. We hold zero affiliation with any government agency, sovereign ministry, or consulate. Our advice is based on public and diplomatic protocols and is purely advisory in nature.
              </p>
            </ClauseCard>

            {/* 5.3 */}
            <ClauseCard icon={<UserX size={24} color={GOLD} />} title="No Outcome Control">
              <p style={S.body}>
                The Company does not control:
              </p>
              <BulletList items={[
                'Government decisions',
                'Embassy decisions',
                'University decisions',
                'Employer decisions',
              ]} />
              <p style={{ ...S.body, marginTop: 16 }}>
                All decisions regarding visa issuance, residency, admissions, or employment are made{' '}
                <em style={S.goldItalic}>solely by the respective authorities</em>. Our engagement terminates upon delivery of the agreed service.
              </p>
            </ClauseCard>

            {/* 5.4 */}
            <ClauseCard icon={<Banknote size={24} color={GOLD} />} title="User Risk Acceptance">
              <p style={S.body}>
                Users of this website and our services acknowledge:
              </p>
              <BulletList items={[
                'They act on their own judgment',
                'They assume all risks',
                'They must verify independently',
              ]} />
              <p style={{ ...S.body, marginTop: 16 }}>
                To prioritise serious applicants, <strong style={{ color: NAVY2 }}>administrative operations will not commence until 100% confirmation of service fees is received.</strong> Pre-payment ensures specialised resources are dedicated to your success.
              </p>
            </ClauseCard>

            {/* Data Integrity */}
            <ClauseCard icon={<ShieldAlert size={24} color={GOLD} />} title="Data Integrity Standard">
              <p style={S.body}>
                SNJ Global Routes enforces a{' '}
                <strong style={{ color: NAVY2 }}>Zero-Tolerance</strong> policy for fraudulent documentation.
              </p>
              <p style={{ ...S.body, marginTop: 16 }}>
                In the event of falsified submissions, we reserve the right to terminate services immediately without refund and report the incident to relevant authorities.
              </p>
              <p style={{ ...S.body, marginTop: 16 }}>
                All client data is stored with{' '}
                <em style={S.goldItalic}>high-security protocols</em>{' '}
                and is never shared with third-party marketing entities.
              </p>
            </ClauseCard>

          </div>
        </div>
      </section>


      {/* ══════════ FULL DISCLAIMER CLAUSES ══════════ */}
      <section style={S.sectionWhite}>
        <div style={S.inner}>
          <SectionHeader
            label="Full Disclaimer"
            title="Risk Allocation Statement"
            sub="The following clauses form the complete disclaimer framework governing use of our services."
            center={false}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

            {/* 5.1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              style={{
                display: 'grid', gridTemplateColumns: 'auto 1fr',
                gap: 28, paddingBottom: 40, borderBottom: '1px solid #E2E8F0',
              }}
            >
              <span style={{
                fontFamily: '"Times New Roman", serif', fontSize: 52,
                fontWeight: 'bold', color: `${GOLD}20`, lineHeight: 1, minWidth: 64,
              }}>1.1</span>
              <div>
                <h3 style={S.h3}>General Nature</h3>
                <p style={S.body}>
                  All content is provided strictly for informational and guidance purposes. No part of this website or its associated communications should be interpreted as a binding commitment, guarantee, or professional engagement beyond our defined advisory scope.
                </p>
              </div>
            </motion.div>

            {/* 5.2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              style={{
                display: 'grid', gridTemplateColumns: 'auto 1fr',
                gap: 28, paddingBottom: 40, borderBottom: '1px solid #E2E8F0',
              }}
            >
              <span style={{
                fontFamily: '"Times New Roman", serif', fontSize: 52,
                fontWeight: 'bold', color: `${GOLD}20`, lineHeight: 1, minWidth: 64,
              }}>1.2</span>
              <div>
                <h3 style={S.h3}>No Professional Advice</h3>
                <p style={{ ...S.body, marginBottom: 12 }}>Nothing on this website constitutes:</p>
                <BulletList items={['Legal advice', 'Immigration advice', 'Financial advice', 'Government representation']} />
              </div>
            </motion.div>

            {/* 5.3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              style={{
                display: 'grid', gridTemplateColumns: 'auto 1fr',
                gap: 28, paddingBottom: 40, borderBottom: '1px solid #E2E8F0',
              }}
            >
              <span style={{
                fontFamily: '"Times New Roman", serif', fontSize: 52,
                fontWeight: 'bold', color: `${GOLD}20`, lineHeight: 1, minWidth: 64,
              }}>1.3</span>
              <div>
                <h3 style={S.h3}>No Outcome Control</h3>
                <p style={{ ...S.body, marginBottom: 12 }}>The Company does not control:</p>
                <BulletList items={['Government decisions', 'Embassy decisions', 'University decisions', 'Employer decisions']} />
              </div>
            </motion.div>

            {/* 5.4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              style={{
                display: 'grid', gridTemplateColumns: 'auto 1fr',
                gap: 28, paddingBottom: 40,
              }}
            >
              <span style={{
                fontFamily: '"Times New Roman", serif', fontSize: 52,
                fontWeight: 'bold', color: `${GOLD}20`, lineHeight: 1, minWidth: 64,
              }}>1.4</span>
              <div>
                <h3 style={S.h3}>User Risk Acceptance</h3>
                <p style={{ ...S.body, marginBottom: 12 }}>Users acknowledge:</p>
                <BulletList items={['They act on their own judgment', 'They assume all risks', 'They must verify independently']} />
              </div>
            </motion.div>

          </div>
        </div>
      </section>


      {/* ══════════ WHY TRUST SNJ ══════════ */}
      <section style={{ ...S.sectionNavy, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 75% 25%, ${GOLD}09 0%, transparent 55%)`,
        }} />
        <div style={{ ...S.inner, position: 'relative', zIndex: 1 }}>
          <SectionHeader
            label="The SNJ Distinction"
            title="Why Trust SNJ Global Routes?"
            light center
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
            {whyChooseUs.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.12 }}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  borderTop: `3px solid ${GOLD}`,
                  borderRadius: 20,
                  padding: '36px 28px',
                  textAlign: 'center',
                }}
              >
                <div style={{
                  width: 64, height: 64, borderRadius: 16,
                  background: 'rgba(255,255,255,0.08)',
                  border: `1px solid ${GOLD}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                }}>
                  {item.icon}
                </div>
                <h4 style={{
                  fontFamily: '"Times New Roman", serif',
                  fontSize: 16, fontWeight: 'bold',
                  color: WHITE, textTransform: 'uppercase',
                  letterSpacing: 1, marginBottom: 12,
                }}>{item.title}</h4>
                <p style={S.bodyWhite}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════ SUCCESS STORIES ══════════ */}
      <section style={S.sectionLight}>
        <div style={S.inner}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 20 }}>
            <div>
              <span style={S.label}>Global Verification</span>
              <h2 style={S.h2Navy}>Real People. Real Results.</h2>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {[1,2,3,4,5].map(s => <Star key={s} size={20} fill={GOLD} color={GOLD} />)}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {[
              {
                initial: 'S',
                name: 'Sarah J., MSc Student',
                text: '"Their pre-payment policy showed they are serious professionals. I got my Canada student visa in record time. The guidance was clear, honest, and exactly what I needed."',
              },
              {
                initial: 'A',
                name: 'Ahmed R., Businessman',
                text: '"The precision and transparency of SNJ Global Routes made my business mobility process seamless. They never promised anything they could not deliver — that built my trust."',
              },
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.12 }}
                style={{
                  background: WHITE,
                  borderRadius: 20,
                  padding: '36px 32px',
                  border: '1px solid #E2E8F0',
                  borderLeft: `4px solid ${NAVY}`,
                }}
              >
                <p style={{ ...S.body, fontStyle: 'italic', marginBottom: 24, color: NAVY2 }}>
                  {review.text}
                </p>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%', background: NAVY,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: '"Times New Roman", serif',
                    fontSize: 18, fontWeight: 'bold', color: WHITE,
                  }}>{review.initial}</div>
                  <p style={{
                    fontFamily: '"Times New Roman", serif',
                    fontSize: 13, fontWeight: 'bold',
                    color: NAVY, letterSpacing: 1,
                    textTransform: 'uppercase', margin: 0,
                  }}>{review.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════ FOOTER ══════════ */}
      <footer style={{
        background: NAVY, padding: '72px 32px',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
        }} />

        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 28, opacity: 0.2 }}>
          <ShieldAlert size={36} color={WHITE} />
          <Globe size={36} color={WHITE} />
          <Award size={36} color={WHITE} />
        </div>

        <p style={{
          fontFamily: '"Times New Roman", serif',
          fontSize: 20, fontWeight: 'bold',
          letterSpacing: '4px', textTransform: 'uppercase',
          color: WHITE, marginBottom: 8,
        }}>
          SNJ Global Routes
        </p>
        <p style={{
          fontFamily: '"Times New Roman", serif',
          fontSize: 13, fontStyle: 'italic',
          color: 'rgba(255,255,255,0.4)', marginBottom: 0,
        }}>
          Architecture of Global Mobility Pathways · Est. 2024 · Bangladesh
        </p>
      </footer>

    </div>
  );
};

export default GlobalDisclaimer;