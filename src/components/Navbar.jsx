import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { 
  Globe, Phone, Clock, Menu, X, 
  Home, Plane, PlaneTakeoff, ShieldCheck, 
  ChevronDown, User, LogOut, LayoutDashboard,
  Facebook, Instagram, Youtube, Twitter, Linkedin,
  LogIn, UserPlus
} from 'lucide-react';

const TikTokIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false); 
  const [showJoinDropdown, setShowJoinDropdown] = useState(false);
  const [currentLang, setCurrentLang] = useState({ name: 'English', flag: '🇺🇸' });
  const [user, setUser] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const langRef = useRef(null);
  const joinRef = useRef(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'az', name: 'Azerbaijan', flag: '🇦🇿' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'ar', name: 'Arabian', flag: '🇸🇦' },
    { code: 'ur', name: 'Urdu', flag: '🇵🇰' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'pl', name: 'Poland', flag: '🇵🇱' },
    { code: 'mt', name: 'Malta', flag: '🇲🇹' },
    { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
    { code: 'ms', name: 'Singapore', flag: '🇸🇬' },
    { code: 'af', name: 'Afrikaans', flag: '🇿🇦' },
    { code: 'sw', name: 'Swahili', flag: '🇰🇪' },
    { code: 'tr', name: 'Türkiye', flag: '🇹🇷' }
  ];

  useEffect(() => {
    const savedLangCode = localStorage.getItem('user_lang');
    if (savedLangCode) {
      const lang = languages.find(l => l.code === savedLangCode);
      if (lang) {
        setCurrentLang({ name: lang.name, flag: lang.flag });
        setTimeout(() => {
          if (window.changeLanguage) window.changeLanguage(lang.code);
        }, 1500);
      }
    }
  }, []);

  const handleTranslate = (lang) => {
    if (window.changeLanguage) {
      window.changeLanguage(lang.code);
      localStorage.setItem('user_lang', lang.code);
      setCurrentLang({ name: lang.name, flag: lang.flag });
      setShowLangDropdown(false);
      
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Switching to ${lang.name}`,
        showConfirmButton: false,
        timer: 1000,
        background: '#0B1F3A',
        color: '#fff'
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) setShowLangDropdown(false);
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setShowUserDropdown(false);
      if (joinRef.current && !joinRef.current.contains(event.target)) setShowJoinDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== "undefined") {
        try { setUser(JSON.parse(storedUser)); } catch (e) { setUser(null); }
      } else { setUser(null); }
    };
    checkUser();
    window.addEventListener('authChange', checkUser);
    window.addEventListener('storage', checkUser);
    return () => {
      window.removeEventListener('authChange', checkUser);
      window.removeEventListener('storage', checkUser);
    };
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of your session!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0B1F3A',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Logout!',
      background: '#0f172a',
      color: '#fff',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setShowUserDropdown(false);
        window.dispatchEvent(new Event('authChange'));
        navigate('/');
      }
    });
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isSpecialUser = user && user.role && user.role !== 'candidate' && user.role !== 'user';

  // Returns the correct dashboard path based on user role
  const getDashboardPath = () => {
    if (user?.role === 'b2b_partner') return '/b2b/dashboard';
    if (user?.role === 'employer') return '/employer/dashboard';
    return '/admin/dashboard';
  };

  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Visa', path: '/visa', icon: <PlaneTakeoff size={18} /> },
    { name: 'Citizenship', path: '/citizenship', icon: <ShieldCheck size={18} /> },
    { name: 'Travel', path: '/travel', icon: <Globe size={18} /> },
    { name: 'Flight', path: '/flight', icon: <Plane size={18} /> },
    { name: 'About Us', path: '/aboutus', icon: <Phone size={18} /> },
  ];

  return (
    <header className="fixed w-full z-[100] font-['Times_New_Roman',_serif]">
      {/* 1. TOP UTILITY BAR */}
      <div className={`hidden lg:block transition-all duration-500 bg-[#0B1F3A] text-slate-300 ${scrolled ? 'h-0 opacity-0 overflow-hidden' : 'h-10 opacity-100'}`}>
        <div className="max-w-[1440px] mx-auto px-8 h-full flex justify-between items-center text-[11px] font-bold tracking-widest uppercase">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 border-r border-white/10 pr-6">
              <Clock size={12} className="text-[#D4AF37]" /> 24 HRS AVAILABLE
            </div>
            <div className="flex items-center gap-4">
              <Facebook size={14} className="hover:text-blue-400 cursor-pointer transition-colors" />
              <Instagram size={14} className="hover:text-pink-400 cursor-pointer transition-colors" />
              <Twitter size={14} className="hover:text-sky-400 cursor-pointer transition-colors" />
              <Linkedin size={14} className="hover:text-blue-600 cursor-pointer transition-colors" />
              <TikTokIcon />
              <Youtube size={14} className="hover:text-red-500 cursor-pointer transition-colors" />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 border-r border-white/10 pr-6">
               <a href="tel:+8801348992268" className="hover:text-white transition-colors flex items-center gap-2">
                 <Phone size={12} className="text-[#D4AF37]" /> +880 1348-992268
               </a>
               <a href="tel:+601170269778" className="hover:text-white transition-colors flex items-center gap-2">
                 <Phone size={12} className="text-[#D4AF37]" /> +60 11-7026 9778
               </a>
            </div>

            <div className="relative" ref={langRef}>
              <div 
                onClick={() => setShowLangDropdown(!showLangDropdown)} 
                className="flex items-center gap-2 cursor-pointer group hover:text-white transition-all py-1"
              >
                <Globe size={12} className="text-[#D4AF37] group-hover:rotate-180 transition-transform duration-700" />
                <span className="font-bold tracking-normal">{currentLang.flag} {currentLang.name}</span>
                <ChevronDown size={10} className={`transition-transform ${showLangDropdown ? 'rotate-180' : ''}`} />
              </div>

              <AnimatePresence>
                {showLangDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: 10 }} 
                    className="absolute right-0 mt-3 w-72 bg-slate-900 border border-slate-800 rounded-3xl p-3 z-[110] grid grid-cols-2 gap-1 max-h-80 overflow-y-auto custom-scrollbar shadow-2xl"
                  >
                    {languages.map((lang) => (
                      <button 
                        key={lang.code} 
                        onClick={() => handleTranslate(lang)} 
                        className="flex items-center gap-2 px-3 py-2 text-[10px] font-black text-slate-300 hover:bg-[#0B1F3A] hover:text-[#D4AF37] rounded-xl transition-all uppercase"
                      >
                        <span className="text-sm language-flag">{lang.flag}</span>
                        <span className="truncate">{lang.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION */}
      <nav className={`transition-all duration-500 border-b ${
        scrolled 
        ? 'bg-slate-950/90 backdrop-blur-xl py-3 shadow-lg border-transparent' 
        : 'bg-slate-900 py-5 border-slate-800'
      }`}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-8 flex justify-between items-center">
          
          <Link to="/" className="flex items-center gap-4 group">
            <div className="bg-[#0B1F3A] p-2 rounded-xl transition-transform duration-700 group-hover:rotate-[360deg] border border-[#D4AF37]/20">
               <img src="/company_logo.png" className="w-12 h-12"></img>
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xl lg:text-2xl font-black tracking-tighter text-white uppercase leading-none">
                GLOBAL<span className="text-[#D4AF37]">ROUTES</span>
              </span>
              <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.4em] mt-1">SNJ OFFICIAL PORTAL</span>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center gap-2">
            <ul className="flex items-center bg-slate-800/50 p-1.5 rounded-2xl border border-slate-700/50">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.name}>
                    <Link to={item.path} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-wider transition-all relative ${
                      isActive ? 'text-white' : 'text-slate-300 hover:text-[#D4AF37]'
                    }`}>
                      {isActive && (
                        <motion.span layoutId="premiumActive" className="absolute inset-0 bg-[#0B1F3A] shadow-md rounded-xl z-[-1]" transition={{ type: 'spring', duration: 0.5 }} />
                      )}
                      {isActive && item.icon}
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-3 ml-4">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setShowUserDropdown(!showUserDropdown)} className="flex items-center gap-3 p-1.5 pr-4 bg-slate-800 rounded-2xl border border-slate-700 hover:shadow-lg transition-all text-white">
                    <div className="w-9 h-9 bg-[#0B1F3A] rounded-xl flex items-center justify-center text-[#D4AF37] font-bold border border-[#D4AF37]/30">
                      {user.name ? user.name.charAt(0).toUpperCase() : <User size={18}/>}
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black uppercase leading-tight truncate max-w-[80px]">{user.name || 'User'}</p>
                      <p className="text-[8px] font-bold text-[#D4AF37] uppercase tracking-widest">Active</p>
                    </div>
                    <ChevronDown size={14} className={`transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showUserDropdown && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-3 w-56 bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-800 p-3 z-[110]">
                        <div className="p-4 border-b border-slate-800 mb-2">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Account Details</p>
                          <p className="text-xs font-black text-white truncate">{user.email}</p>
                          <p className="text-[8px] font-black text-[#D4AF37] uppercase mt-1">Role: {user.role || 'User'}</p>
                        </div>

                        {isSpecialUser ? (
                          <button onClick={() => { navigate(getDashboardPath()); setShowUserDropdown(false); }} className="w-full flex items-center gap-3 p-3 hover:bg-blue-900/30 rounded-xl transition-all group">
                            <LayoutDashboard size={16} className="text-[#D4AF37]" />
                            <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">Dashboard</span>
                          </button>
                        ) : (
                          <Link to="/profile" onClick={() => setShowUserDropdown(false)} className="w-full flex items-center gap-3 p-3 hover:bg-slate-800 rounded-xl">
                            <User size={16} className="text-slate-300" />
                            <span className="text-xs font-bold uppercase text-slate-300">Profile</span>
                          </Link>
                        )}

                        <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 bg-red-900/20 hover:bg-red-900/40 rounded-xl transition-all group mt-2">
                          <LogOut size={16} className="text-red-500" />
                          <span className="text-xs font-black uppercase tracking-wider text-red-500">Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="relative" ref={joinRef}>
                  <button 
                    onClick={() => setShowJoinDropdown(!showJoinDropdown)} 
                    className="px-8 py-3 bg-[#0B1F3A] text-white text-[12px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-[#D4AF37] hover:text-[#0B1F3A] shadow-xl transition-all active:scale-95 border border-[#D4AF37]/30 flex items-center gap-2"
                  >
                    Join Us <ChevronDown size={14} className={`transition-transform ${showJoinDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showJoinDropdown && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: 10 }} 
                        className="absolute right-0 mt-3 w-48 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-2 z-[110]"
                      >
                        <button 
                          onClick={() => {navigate('/login'); setShowJoinDropdown(false)}} 
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-xl text-white transition-all group"
                        >
                          <LogIn size={16} className="text-[#D4AF37] group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-black uppercase tracking-widest">Login</span>
                        </button>
                        <button 
                          onClick={() => {navigate('/register/select'); setShowJoinDropdown(false)}}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-xl text-white transition-all group mt-1"
                        >
                          <UserPlus size={16} className="text-[#D4AF37] group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-black uppercase tracking-widest">Register</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* MOBILE TOGGLE */}
          <div className="lg:hidden flex items-center">
            <button onClick={() => setIsOpen(true)} className="p-2.5 bg-slate-800 rounded-xl text-white border border-slate-700">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE FULL-SCREEN MENU */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 bg-[#0B1F3A]/80 backdrop-blur-md z-[140]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed inset-y-0 right-0 z-[150] w-full max-w-sm bg-slate-950 flex flex-col p-8 shadow-2xl overflow-y-auto">
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-2 text-left">
                   <Globe size={24} className="text-[#D4AF37]" />
                   <span className="font-black text-xl text-white uppercase">GlobalRoutes</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-3 bg-slate-800 rounded-2xl text-white"><X size={28}/></button>
              </div>

              {/* Language Section in Mobile */}
              <div className="mb-8 p-4 bg-slate-900 rounded-2xl border border-slate-800">
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Site Language</p>
                 <div className="grid grid-cols-2 gap-2">
                    {languages.map(lang => (
                      <button key={lang.code} onClick={() => handleTranslate(lang)} className="flex items-center gap-2 p-2 bg-slate-800 hover:bg-[#0B1F3A] rounded-lg text-[10px] font-black uppercase text-slate-300 transition-colors">
                        <span className="language-flag">{lang.flag}</span> {lang.name}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="space-y-6 flex-grow">
                {navItems.map((item, idx) => (
                  <motion.div key={item.name} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}>
                    <Link to={item.path} onClick={() => setIsOpen(false)} className="group text-3xl font-black uppercase italic tracking-tighter text-white flex items-center gap-4">
                      <span className="text-[#D4AF37] text-xs not-italic font-bold tracking-widest">0{idx+1}</span> 
                      <span className="group-hover:pl-4 transition-all duration-300 group-hover:text-[#D4AF37]">{item.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-auto pt-10 border-t border-slate-800">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-slate-900 rounded-2xl text-white border border-slate-800">
                      <div className="w-12 h-12 bg-[#0B1F3A] rounded-xl flex items-center justify-center text-[#D4AF37] text-xl font-bold border border-[#D4AF37]/20">{user.name?.charAt(0).toUpperCase()}</div>
                      <div className="text-left">
                        <p className="font-black uppercase italic">{user.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">{user.role || 'User'}</p>
                      </div>
                    </div>
                    {isSpecialUser && (
                      <button onClick={() => { navigate(getDashboardPath()); setIsOpen(false); }} className="w-full py-4 border-2 border-[#D4AF37] text-[#D4AF37] font-black uppercase tracking-widest rounded-2xl bg-transparent">Dashboard</button>
                    )}
                    <button onClick={handleLogout} className="w-full py-5 bg-red-600 text-white font-black uppercase tracking-widest rounded-2xl text-xl shadow-lg hover:bg-red-700 transition-colors">Logout</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    <button onClick={() => {navigate('/login'); setIsOpen(false)}} className="w-full py-4 bg-[#0B1F3A] text-white font-black uppercase tracking-widest rounded-2xl text-lg shadow-lg border border-[#D4AF37]/30">Login</button>
                    <button onClick={() => {navigate('/registration'); setIsOpen(false)}} className="w-full py-4 bg-[#D4AF37] text-[#0B1F3A] font-black uppercase tracking-widest rounded-2xl text-lg shadow-lg border border-[#0B1F3A]/20">Register Now</button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;