// src/components/ServiceArea.jsx  
import React, { useState } from 'react';
import { useNavigate }      from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Search } from 'lucide-react';
import { toSlug } from '../../constants/countryDataMap'; // ← import helper

/* ─── Country list ───────────────────────────────────────────── */
const COUNTRIES = [
  { name: 'Albania',         flag: 'https://flagcdn.com/w320/al.png' },
  { name: 'Armenia',         flag: 'https://flagcdn.com/w320/am.png' },
  { name: 'Austria',         flag: 'https://flagcdn.com/w320/at.png' },
  { name: 'Azerbaijan',      flag: 'https://flagcdn.com/w320/az.png' },
  { name: 'Belarus',         flag: 'https://flagcdn.com/w320/by.png' },
  { name: 'Belgium',         flag: 'https://flagcdn.com/w320/be.png' },
  { name: 'Bulgaria',        flag: 'https://flagcdn.com/w320/bg.png' },
  { name: 'Cambodia',        flag: 'https://flagcdn.com/w320/kh.png' },
  { name: 'China',           flag: 'https://flagcdn.com/w320/cn.png' },
  { name: 'Croatia',         flag: 'https://flagcdn.com/w320/hr.png' },
  { name: 'Cyprus',          flag: 'https://flagcdn.com/w320/cy.png' },
  { name: 'Czech Republic',  flag: 'https://flagcdn.com/w320/cz.png' },
  { name: 'Denmark',         flag: 'https://flagcdn.com/w320/dk.png' },
  { name: 'Egypt',           flag: 'https://flagcdn.com/w320/eg.png' },
  { name: 'Estonia',         flag: 'https://flagcdn.com/w320/ee.png' },
  { name: 'Finland',         flag: 'https://flagcdn.com/w320/fi.png' },
  { name: 'France',          flag: 'https://flagcdn.com/w320/fr.png' },
  { name: 'Georgia',         flag: 'https://flagcdn.com/w320/ge.png' },
  { name: 'Germany',         flag: 'https://flagcdn.com/w320/de.png' },
  { name: 'Greece',          flag: 'https://flagcdn.com/w320/gr.png' },
  { name: 'Hungary',         flag: 'https://flagcdn.com/w320/hu.png' },
  { name: 'Iceland',         flag: 'https://flagcdn.com/w320/is.png' },
  { name: 'India',           flag: 'https://flagcdn.com/w320/in.png' },
  { name: 'Indonesia',       flag: 'https://flagcdn.com/w320/id.png' },
  { name: 'Ireland',         flag: 'https://flagcdn.com/w320/ie.png' },
  { name: 'Italy',           flag: 'https://flagcdn.com/w320/it.png' },
  { name: 'Japan',           flag: 'https://flagcdn.com/w320/jp.png' },
  { name: 'Laos',            flag: 'https://flagcdn.com/w320/la.png' },
  { name: 'Latvia',          flag: 'https://flagcdn.com/w320/lv.png' },
  { name: 'Lithuania',       flag: 'https://flagcdn.com/w320/lt.png' },
  { name: 'Luxembourg',      flag: 'https://flagcdn.com/w320/lu.png' },
  { name: 'Malaysia',        flag: 'https://flagcdn.com/w320/my.png' },
  { name: 'Malta',           flag: 'https://flagcdn.com/w320/mt.png' },
  { name: 'Moldova',         flag: 'https://flagcdn.com/w320/md.png' },
  { name: 'Montenegro',      flag: 'https://flagcdn.com/w320/me.png' },
  { name: 'Nepal',           flag: 'https://flagcdn.com/w320/np.png' },
  { name: 'Netherlands',     flag: 'https://flagcdn.com/w320/nl.png' },
  { name: 'New Zealand',     flag: 'https://flagcdn.com/w320/nz.png' },
  { name: 'North Macedonia', flag: 'https://flagcdn.com/w320/mk.png' },
  { name: 'Norway',          flag: 'https://flagcdn.com/w320/no.png' },
  { name: 'Philippines',     flag: 'https://flagcdn.com/w320/ph.png' },
  { name: 'Poland',          flag: 'https://flagcdn.com/w320/pl.png' },
  { name: 'Portugal',        flag: 'https://flagcdn.com/w320/pt.png' },
  { name: 'Romania',         flag: 'https://flagcdn.com/w320/ro.png' },
  { name: 'Russia',          flag: 'https://flagcdn.com/w320/ru.png' },
  { name: 'Serbia',          flag: 'https://flagcdn.com/w320/rs.png' },
  { name: 'Singapore',       flag: 'https://flagcdn.com/w320/sg.png' },
  { name: 'Slovakia',        flag: 'https://flagcdn.com/w320/sk.png' },
  { name: 'Slovenia',        flag: 'https://flagcdn.com/w320/si.png' },
  { name: 'South Korea',     flag: 'https://flagcdn.com/w320/kr.png' },
  { name: 'Spain',           flag: 'https://flagcdn.com/w320/es.png' },
  { name: 'Sri Lanka',       flag: 'https://flagcdn.com/w320/lk.png' },
  { name: 'Sweden',          flag: 'https://flagcdn.com/w320/se.png' },
  { name: 'Switzerland',     flag: 'https://flagcdn.com/w320/ch.png' },
  { name: 'Thailand',        flag: 'https://flagcdn.com/w320/th.png' },
  { name: 'Turkiye',         flag: 'https://flagcdn.com/w320/tr.png' },
  { name: 'United Kingdom',  flag: 'https://flagcdn.com/w320/gb.png' },
].sort((a, b) => a.name.localeCompare(b.name));

/* ─── Main Component ─────────────────────────────────────────── */
const ServiceArea = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCountryClick = (country) => {
    navigate(`/destinations/${toSlug(country.name)}`);
  };

  return (
    <section className="py-24 bg-white" style={{ fontFamily: "'Times New Roman', serif" }}>
      <div className="container mx-auto px-4">

        {/* ── Header ── */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
            style={{ background: 'rgba(11,31,58,0.05)', border: '1px solid rgba(11,31,58,0.1)' }}
          >
            <Globe size={13} style={{ color: '#D4AF37' }} />
            <span
              className="text-[10px] font-bold uppercase"
              style={{ letterSpacing: '0.3em', color: '#0B1F3A' }}
            >
              Global Reach
            </span>
          </div>

          <h2
            className="text-4xl md:text-5xl font-bold uppercase"
            style={{ color: '#0B1F3A', letterSpacing: '-0.02em' }}
          >
            AVAILABLE{' '}
            <span style={{ color: '#D4AF37', fontStyle: 'italic' }}>DESTINATIONS</span>
          </h2>

          <div
            className="mx-auto mt-6"
            style={{ width: 80, height: 4, background: '#D4AF37', borderRadius: 2 }}
          />

          <p className="text-slate-500 text-sm mt-4 max-w-md mx-auto leading-relaxed">
            Click any country to explore visa services, work permit opportunities,
            and study options available through SNJ Global.
          </p>
        </div>

        {/* ── Search ── */}
        <div className="max-w-md mx-auto mb-14 relative">
          <Search
            size={18}
            className="absolute text-slate-400 pointer-events-none"
            style={{ left: 16, top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search for a country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-4 bg-white rounded-2xl outline-none text-sm transition-all"
            style={{
              paddingLeft: 48,
              paddingRight: 24,
              border: '1px solid #e2e8f0',
              color: '#0B1F3A',
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#D4AF37';
              e.target.style.boxShadow = '0 0 0 4px rgba(212,175,55,0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
            }}
          />
        </div>

        {/* ── Country Grid ── */}
        <motion.div
          layout
          className="grid gap-5 max-w-7xl mx-auto"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))' }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((country) => (
              <motion.div
                layout
                key={country.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                onClick={() => handleCountryClick(country)}
                className="group flex flex-col items-center p-5 bg-white rounded-2xl cursor-pointer transition-all duration-300"
                style={{ border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(11,31,58,0.04)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(11,31,58,0.10)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#f1f5f9';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(11,31,58,0.04)';
                }}
              >
                {/* Flag circle */}
                <div
                  className="rounded-full overflow-hidden mb-4 flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    width: 64,
                    height: 64,
                    border: '3px solid #fff',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.14)',
                    background: '#f8fafc',
                  }}
                >
                  <img
                    src={country.flag}
                    alt={`${country.name} flag`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentNode.style.background = '#0B1F3A';
                      e.target.parentNode.style.display = 'flex';
                      e.target.parentNode.style.alignItems = 'center';
                      e.target.parentNode.style.justifyContent = 'center';
                      const span = document.createElement('span');
                      span.textContent = country.name.slice(0, 2).toUpperCase();
                      span.style.cssText = 'color:#D4AF37;font-weight:900;font-size:18px;';
                      e.target.parentNode.appendChild(span);
                    }}
                  />
                </div>

                {/* Country name */}
                <h3
                  className="text-[10px] font-black uppercase tracking-wider text-center leading-tight transition-colors duration-300 group-hover:text-[#D4AF37]"
                  style={{ color: '#0B1F3A', minHeight: '2.4rem', display: 'flex', alignItems: 'center' }}
                >
                  {country.name}
                </h3>

                {/* Hover underline */}
                <div
                  className="h-0.5 mt-2 rounded-full transition-all duration-300 group-hover:w-8"
                  style={{ background: '#D4AF37', width: 0 }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-400 text-sm font-medium">
              No countries found matching &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServiceArea;