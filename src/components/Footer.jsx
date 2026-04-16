import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, Twitter, Linkedin, Instagram, Youtube, 
  MapPin, Phone, Mail, Globe, ArrowUp, 
  ChevronRight, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Footer = () => {
  const [showScroll, setShowScroll] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const checkScrollTop = () => {
      if (window.pageYOffset > 400) setShowScroll(true);
      else setShowScroll(false);
    };
    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const footerSections = [
    {
      title: 'Global Services',
      links: [
        { name: 'Visa Solutions',           path: '/visa' },
        { name: 'Citizenship by Investment', path: '/citizenship' },
        { name: 'Travel Expeditions',        path: '/travel' },
        { name: 'Flight Services',           path: '/flight' },
      ],
    },
    {
      title: 'Corporate',
      links: [
        { name: 'Employer Portal',    path: '#' },
        { name: 'B2B Partners Portal', path: '#' },
        { name: 'User Portal',        path: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'About SNJ',          path: '/aboutus' },
        { name: 'Global Sitemap',     path: '/sitemap' },
        { name: 'Terms & Conditions', path: '/terms-engagement' },
        { name: 'Policy Centre',      path: '/policy' },          
        { name: 'Global Disclaimer',  path: '/global-disclaimer' },
      ],
    },
  ];

  return (
    <footer
      style={{
        background: '#0B1F3A',
        color: '#ffffff',
        fontFamily: '"Times New Roman", serif',
        borderTop: '1px solid rgba(212,175,55,0.3)',
        paddingTop: 96,
        paddingBottom: 48,
        position: 'relative',
        overflow: 'hidden',
      }}
    >

      {/* ── SCROLL TO TOP BUTTON ── */}
      <AnimatePresence>
        {showScroll && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            style={{
              position: 'fixed', bottom: 40, right: 40, zIndex: 50,
              width: 52, height: 52,
              background: '#D4AF37', color: '#0B1F3A',
              borderRadius: '50%', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 30px rgba(212,175,55,0.35)',
            }}
          >
            <ArrowUp size={22} strokeWidth={3} />
          </motion.button>
        )}
      </AnimatePresence>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>

        {/* ── TOP BRAND + CONTACT ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 64,
          marginBottom: 80,
          paddingBottom: 64,
          borderBottom: '1px solid rgba(255,255,255,0.10)',
        }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
              <img src="/company_logo.png" style={{ width: 96, height: 96 }} alt="SNJ Logo" />
              <div>
                <h2 style={{
                  fontFamily: '"Times New Roman", serif',
                  fontSize: 36, fontWeight: 'bold',
                  color: '#ffffff', textTransform: 'uppercase',
                  lineHeight: 1, margin: 0,
                }}>
                  SNJ <span style={{ color: '#D4AF37' }}>GLOBALROUTES</span>
                </h2>
                <span style={{
                  fontFamily: '"Times New Roman", serif',
                  fontSize: 11, fontWeight: 'bold',
                  color: '#D4AF37', letterSpacing: '5px',
                  textTransform: 'uppercase', marginTop: 8, display: 'flex',
                  alignItems: 'center', gap: 6,
                }}>
                  <Award size={13} /> Official Premium Portal
                </span>
              </div>
            </div>
            <p style={{
              fontFamily: '"Times New Roman", serif',
              fontSize: 18, fontStyle: 'italic',
              color: 'rgba(255,255,255,0.75)', lineHeight: 1.7,
              maxWidth: 400, fontWeight: 300,
            }}>
              "Delivering trusted pathways for{' '}
              <strong style={{ color: '#ffffff', fontWeight: 'bold' }}>
                global mobility, international opportunities,
              </strong>{' '}
              and seamless relocation solutions."
            </p>
          </div>

          {/* Contact cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignContent: 'start' }}>
            <div style={{
              padding: '28px 24px',
              borderRadius: 24,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.10)',
            }}>
              <Phone color="#D4AF37" size={26} style={{ marginBottom: 12 }} />
              <span style={{
                fontFamily: '"Times New Roman", serif',
                fontSize: 10, fontWeight: 'bold',
                color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase',
                letterSpacing: '3px', display: 'block', marginBottom: 6,
              }}>Global Support</span>
              <a href="tel:+8801348992268" style={{
                fontFamily: '"Times New Roman", serif',
                fontSize: 17, fontWeight: 'bold', color: '#ffffff', textDecoration: 'none',
              }}>
                +880 1348-992268
              </a>
            </div>
            <div style={{
              padding: '28px 24px',
              borderRadius: 24,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.10)',
            }}>
              <Mail color="#D4AF37" size={26} style={{ marginBottom: 12 }} />
              <span style={{
                fontFamily: '"Times New Roman", serif',
                fontSize: 10, fontWeight: 'bold',
                color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase',
                letterSpacing: '3px', display: 'block', marginBottom: 6,
              }}>Official Inquiry</span>
              <p style={{
                fontFamily: '"Times New Roman", serif',
                fontSize: 14, fontWeight: 'bold', color: '#ffffff', margin: 0,
              }}>
                directorsnj932@gmail.com
              </p>
            </div>
          </div>
        </div>


        {/* ── MAIN LINK GRID ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 40,
          marginBottom: 80,
        }}>

          {footerSections.map((section, idx) => (
            <div key={idx}>
              <h4 style={{
                fontFamily: '"Times New Roman", serif',
                fontSize: 12, fontWeight: 'bold',
                color: '#D4AF37', textTransform: 'uppercase',
                letterSpacing: '3px', marginBottom: 24,
              }}>
                {section.title}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {section.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link
                      to={link.path}
                      style={{
                        fontFamily: '"Times New Roman", serif',
                        fontSize: 15, color: 'rgba(255,255,255,0.60)',
                        textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.60)'}
                    >
                      <ChevronRight size={13} color="#D4AF37" />
                      {link.name}
                      {/* Badge for new items */}
                      {(link.name === 'Policy Centre' || link.name === 'Global Disclaimer') && (
                        <span style={{
                          fontFamily: '"Times New Roman", serif',
                          fontSize: 9, fontWeight: 'bold',
                          background: '#D4AF37', color: '#0B1F3A',
                          borderRadius: 4, padding: '1px 6px',
                          letterSpacing: 1, textTransform: 'uppercase',
                        }}>NEW</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Corporate Presence Box */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{
              background: '#D4AF37',
              borderRadius: 40,
              padding: '36px 32px',
              position: 'relative', overflow: 'hidden',
              color: '#0B1F3A',
            }}>
              <h4 style={{
                fontFamily: '"Times New Roman", serif',
                fontSize: 10, fontWeight: 'bold',
                textTransform: 'uppercase', letterSpacing: '4px',
                opacity: 0.6, marginBottom: 14,
              }}>Corporate Presence</h4>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                <MapPin size={28} style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{
                  fontFamily: '"Times New Roman", serif',
                  fontSize: 18, fontWeight: 'bold',
                  textTransform: 'uppercase', fontStyle: 'italic',
                  lineHeight: 1.4, margin: 0,
                }}>
                  Global Operations Across<br />Europe, Middle East &amp; Asia
                </p>
              </div>
              <Globe size={130} color="#0B1F3A" style={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.08 }} />
            </div>
          </div>

        </div>


        {/* ── BOTTOM BAR ── */}
        <div style={{
          paddingTop: 36,
          borderTop: '1px solid rgba(255,255,255,0.10)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 28,
        }}>

          {/* Social icons */}
          <div style={{ display: 'flex', gap: 10 }}>
            {[Facebook, Instagram, Twitter, Youtube, Linkedin].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                style={{
                  width: 44, height: 44, borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.20)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#ffffff', textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#D4AF37';
                  e.currentTarget.style.color = '#0B1F3A';
                  e.currentTarget.style.border = '1px solid #D4AF37';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.20)';
                }}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>

          {/* Copyright + quick links */}
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontFamily: '"Times New Roman", serif',
              fontSize: 11, fontWeight: 'bold',
              textTransform: 'uppercase', letterSpacing: '4px',
              color: '#ffffff', marginBottom: 8,
            }}>
              © {currentYear} SNJ GLOBALROUTES
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
              {[
                { label: 'Terms & Conditions', path: '/terms-engagement' },
                { label: 'Policy Centre',      path: '/policy' },
                { label: 'Global Disclaimer',  path: '/global-disclaimer' },
                { label: 'Global Sitemap',     path: '/sitemap' },
              ].map((item, i) => (
                <Link
                  key={i}
                  to={item.path}
                  style={{
                    fontFamily: '"Times New Roman", serif',
                    fontSize: 10, fontWeight: 'bold',
                    textTransform: 'uppercase', letterSpacing: '2px',
                    color: 'rgba(255,255,255,0.40)', textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#D4AF37'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.40)'}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Developer badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 24px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 999,
          }}>
            <span style={{
              fontFamily: '"Times New Roman", serif',
              fontSize: 10, fontWeight: 'bold',
              color: 'rgba(255,255,255,0.30)', textTransform: 'uppercase',
              fontStyle: 'italic',
            }}>Engineered by</span>
            <div style={{
              width: 8, height: 8, background: '#D4AF37', borderRadius: '50%',
              boxShadow: '0 0 10px #D4AF37',
              animation: 'pulse 2s infinite',
            }} />
            <span style={{
              fontFamily: '"Times New Roman", serif',
              fontSize: 12, fontWeight: 'bold',
              color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '3px',
            }}>JM-IT STUDIO</span>
          </div>

        </div>
      </div>

      {/* Background watermark */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        fontFamily: '"Times New Roman", serif',
        fontSize: 'clamp(120px, 18vw, 320px)', fontWeight: 'bold',
        color: 'rgba(255,255,255,0.018)',
        lineHeight: 1, pointerEvents: 'none', userSelect: 'none',
        transform: 'translateY(-30%)',
      }}>SNJ</div>

    </footer>
  );
};

export default Footer;