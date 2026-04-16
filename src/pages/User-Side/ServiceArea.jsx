import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Search } from 'lucide-react';

const Destinations = () => {
    const [searchQuery, setSearchQuery] = useState('');

    // Full list using SVG image URLs to guarantee visibility
    const countries = [
        { name: 'Albania', flag: 'https://flagcdn.com/w320/al.png' },
        { name: 'Armenia', flag: 'https://flagcdn.com/w320/am.png' },
        { name: 'Austria', flag: 'https://flagcdn.com/w320/at.png' },
        { name: 'Azerbaijan', flag: 'https://flagcdn.com/w320/az.png' },
        { name: 'Belarus', flag: 'https://flagcdn.com/w320/by.png' },
        { name: 'Belgium', flag: 'https://flagcdn.com/w320/be.png' },
        { name: 'Bulgaria', flag: 'https://flagcdn.com/w320/bg.png' },
        { name: 'Cambodia', flag: 'https://flagcdn.com/w320/kh.png' },
        { name: 'China', flag: 'https://flagcdn.com/w320/cn.png' },
        { name: 'Croatia', flag: 'https://flagcdn.com/w320/hr.png' },
        { name: 'Cyprus', flag: 'https://flagcdn.com/w320/cy.png' },
        { name: 'Czech Republic', flag: 'https://flagcdn.com/w320/cz.png' },
        { name: 'Denmark', flag: 'https://flagcdn.com/w320/dk.png' },
        { name: 'Egypt', flag: 'https://flagcdn.com/w320/eg.png' },
        { name: 'Estonia', flag: 'https://flagcdn.com/w320/ee.png' },
        { name: 'Finland', flag: 'https://flagcdn.com/w320/fi.png' },
        { name: 'France', flag: 'https://flagcdn.com/w320/fr.png' },
        { name: 'Georgia', flag: 'https://flagcdn.com/w320/ge.png' },
        { name: 'Germany', flag: 'https://flagcdn.com/w320/de.png' },
        { name: 'Greece', flag: 'https://flagcdn.com/w320/gr.png' },
        { name: 'Hungary', flag: 'https://flagcdn.com/w320/hu.png' },
        { name: 'Iceland', flag: 'https://flagcdn.com/w320/is.png' },
        { name: 'India', flag: 'https://flagcdn.com/w320/in.png' },
        { name: 'Indonesia', flag: 'https://flagcdn.com/w320/id.png' },
        { name: 'Ireland', flag: 'https://flagcdn.com/w320/ie.png' },
        { name: 'Italy', flag: 'https://flagcdn.com/w320/it.png' },
        { name: 'Japan', flag: 'https://flagcdn.com/w320/jp.png' },
        { name: 'Laos', flag: 'https://flagcdn.com/w320/la.png' },
        { name: 'Latvia', flag: 'https://flagcdn.com/w320/lv.png' },
        { name: 'Lithuania', flag: 'https://flagcdn.com/w320/lt.png' },
        { name: 'Luxembourg', flag: 'https://flagcdn.com/w320/lu.png' },
        { name: 'Malaysia', flag: 'https://flagcdn.com/w320/my.png' },
        { name: 'Malta', flag: 'https://flagcdn.com/w320/mt.png' },
        { name: 'Moldova', flag: 'https://flagcdn.com/w320/md.png' },
        { name: 'Montenegro', flag: 'https://flagcdn.com/w320/me.png' },
        { name: 'Nepal', flag: 'https://flagcdn.com/w320/np.png' },
        { name: 'Netherlands', flag: 'https://flagcdn.com/w320/nl.png' },
        { name: 'Norway', flag: 'https://flagcdn.com/w320/no.png' },
        { name: 'Philippines', flag: 'https://flagcdn.com/w320/ph.png' },
        { name: 'Poland', flag: 'https://flagcdn.com/w320/pl.png' },
        { name: 'Portugal', flag: 'https://flagcdn.com/w320/pt.png' },
        { name: 'Romania', flag: 'https://flagcdn.com/w320/ro.png' },
        { name: 'Russia', flag: 'https://flagcdn.com/w320/ru.png' },
        { name: 'Serbia', flag: 'https://flagcdn.com/w320/rs.png' },
        { name: 'Singapore', flag: 'https://flagcdn.com/w320/sg.png' },
        { name: 'Slovakia', flag: 'https://flagcdn.com/w320/sk.png' },
        { name: 'Slovenia', flag: 'https://flagcdn.com/w320/si.png' },
        { name: 'South Korea', flag: 'https://flagcdn.com/w320/kr.png' },
        { name: 'Spain', flag: 'https://flagcdn.com/w320/es.png' },
        { name: 'Sri Lanka', flag: 'https://flagcdn.com/w320/lk.png' },
        { name: 'Sweden', flag: 'https://flagcdn.com/w320/se.png' },
        { name: 'Switzerland', flag: 'https://flagcdn.com/w320/ch.png' },
        { name: 'Thailand', flag: 'https://flagcdn.com/w320/th.png' },
        { name: 'Turkiye', flag: 'https://flagcdn.com/w320/tr.png' },
        { name: 'United Kingdom', flag: 'https://flagcdn.com/w320/gb.png' }
    ].sort((a, b) => a.name.localeCompare(b.name));

    const filteredCountries = countries.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section className="py-24 bg-white font-['Times_New_Roman',_serif]">
            <div className="container mx-auto px-4">
                
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#0B1F3A]/5 border border-[#0B1F3A]/10 mb-4">
                        <Globe size={14} className="text-[#D4AF37]" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#0B1F3A]">Global Reach</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-[#0B1F3A] uppercase tracking-tighter">
                        AVAILABLE <span className="italic text-[#D4AF37]">DESTINATIONS</span>
                    </h2>
                    <div className="w-20 h-1 bg-[#D4AF37] mx-auto mt-6"></div>
                </div>

                {/* Search */}
                <div className="max-w-md mx-auto mb-16 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="text"
                        placeholder="Search for a country..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/5 transition-all text-[#0B1F3A]"
                    />
                </div>

                {/* Flags Grid */}
                <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
                    <AnimatePresence mode='popLayout'>
                        {filteredCountries.map((country) => (
                            <motion.div
                                layout
                                key={country.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ y: -10 }}
                                className="group flex flex-col items-center p-8 bg-white rounded-3xl border border-slate-100 shadow-[0_10px_30px_rgba(11,31,58,0.03)] hover:shadow-[0_20px_40px_rgba(11,31,58,0.08)] hover:border-[#D4AF37]/40 transition-all duration-300"
                            >
                                <div className="w-24 h-24 rounded-full overflow-hidden mb-6 border-4 border-white shadow-md group-hover:scale-110 transition-transform duration-300 bg-slate-50">
                                    <img 
                                        src={country.flag} 
                                        alt={`${country.name} flag`} 
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                
                                <h3 className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider text-center group-hover:text-[#D4AF37] transition-colors min-h-[2rem] flex items-center">
                                    {country.name}
                                </h3>
                                
                                <div className="w-0 group-hover:w-10 h-0.5 bg-[#D4AF37] mt-3 transition-all duration-300"></div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
};

export default Destinations;