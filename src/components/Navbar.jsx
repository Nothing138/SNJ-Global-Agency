import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { 
  Globe, Phone, Clock, Menu, X, 
  Plane, ShieldCheck, 
  ChevronDown, User, LogOut, LayoutDashboard,
  Facebook, Instagram, Youtube, Linkedin,
  LogIn, UserPlus, Briefcase,
  Home, Compass, Landmark, Map
} from 'lucide-react';

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
    { code: 'en', name: 'English',    flag: '🇺🇸' },
    { code: 'az', name: 'Azerbaijan', flag: '🇦🇿' },
    { code: 'bn', name: 'বাংলা',      flag: '🇧🇩' },
    { code: 'ar', name: 'Arabian',    flag: '🇸🇦' },
    { code: 'ur', name: 'Urdu',       flag: '🇵🇰' },
    { code: 'de', name: 'German',     flag: '🇩🇪' },
    { code: 'fr', name: 'French',     flag: '🇫🇷' },
    { code: 'es', name: 'Spanish',    flag: '🇪🇸' },
    { code: 'pl', name: 'Poland',     flag: '🇵🇱' },
    { code: 'mt', name: 'Malta',      flag: '🇲🇹' },
    { code: 'id', name: 'Indonesia',  flag: '🇮🇩' },
    { code: 'ms', name: 'Singapore',  flag: '🇸🇬' },
    { code: 'af', name: 'Afrikaans',  flag: '🇿🇦' },
    { code: 'sw', name: 'Swahili',    flag: '🇰🇪' },
    { code: 'tr', name: 'Türkiye',    flag: '🇹🇷' },
  ];

  const navItems = [
    { name: 'Home',        path: '/',           Icon: Home },
    { name: 'Visa',        path: '/visa',        Icon: Landmark },
    { name: 'Citizenship', path: '/citizenship', Icon: ShieldCheck },
    { name: 'Travel',      path: '/travel',      Icon: Compass },
    { name: 'Flight',      path: '/flight',      Icon: Plane },
    { name: 'Employer',    path: '/employer',    Icon: Briefcase },
    { name: 'About Us',    path: '/aboutus',     Icon: Globe },
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
        color: '#fff',
      });
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (langRef.current    && !langRef.current.contains(e.target))    setShowLangDropdown(false);
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowUserDropdown(false);
      if (joinRef.current    && !joinRef.current.contains(e.target))    setShowJoinDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined') {
        try { setUser(JSON.parse(storedUser)); } catch { setUser(null); }
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
      text: 'You will be logged out of your session.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0B1F3A',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Logout',
      background: '#ffffff',
      color: '#1a1a1a',
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
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isSpecialUser = user && user.role && user.role !== 'candidate' && user.role !== 'user';

  const getDashboardPath = () => {
    if (user?.role === 'b2b_partner') return '/b2b/dashboard';
    if (user?.role === 'employer')    return '/employer/dashboard';
    return '/admin/dashboard';
  };

  return (
    <header className="fixed w-full z-[100]" style={{ fontFamily: "'Times New Roman', Times, serif" }}>

      {/* ── TOP UTILITY BAR — always navy ───────────────────────────────── */}
      <div className={`hidden lg:block transition-all duration-500 bg-[#0B1F3A] text-gray-300 ${scrolled ? 'h-0 opacity-0 overflow-hidden' : 'h-10 opacity-100'}`}>
        <div className="max-w-[1440px] mx-auto px-8 h-full flex justify-between items-center text-[11px] font-bold tracking-widest uppercase">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 border-r border-white/10 pr-6">
              <Clock size={14} className="text-[#D4AF37]" /> 24 / 7 Support
            </div>
            <div className="flex items-center gap-4">
              <Facebook size={13} className="hover:text-blue-400 cursor-pointer transition-colors" />
              <Instagram size={13} className="hover:text-pink-400 cursor-pointer transition-colors" />
              <Linkedin size={13} className="hover:text-blue-500 cursor-pointer transition-colors" />
              <Youtube size={13} className="hover:text-red-500 cursor-pointer transition-colors" />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 border-r border-white/10 pr-6">
              <a href="tel:+8801348992268" className="hover:text-white transition-colors flex items-center gap-2">
                <Phone size={11} className="text-[#D4AF37]" /> +880 1348-992268
              </a>
            </div>

            {/* Language Dropdown */}
            <div className="relative" ref={langRef}>
              <div
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center gap-2 cursor-pointer hover:text-white transition-all py-1"
              >
                <Globe size={11} className="text-[#D4AF37]" />
                <span>{currentLang.flag} {currentLang.name}</span>
                <ChevronDown size={10} className={`transition-transform ${showLangDropdown ? 'rotate-180' : ''}`} />
              </div>

              <AnimatePresence>
                {showLangDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-3 w-72 bg-white border border-gray-200 shadow-xl p-3 z-[110] grid grid-cols-2 gap-1 max-h-80 overflow-y-auto"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleTranslate(lang)}
                        className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-gray-700 hover:bg-gray-100 hover:text-[#0B1F3A] transition-all uppercase"
                      >
                        <span className="text-sm">{lang.flag}</span>
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

      {/* ── MAIN NAVIGATION — NAVY BLUE background always ───────────────── */}
      <nav className={`transition-all duration-400 border-b ${
        scrolled
          ? 'bg-[#0B1F3A]/98 backdrop-blur-md py-3 shadow-lg border-[#D4AF37]/20'
          : 'bg-[#0B1F3A] py-4 border-[#D4AF37]/10'
      }`}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-8 flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="border border-[#D4AF37]/40 p-1.5 transition-all group-hover:border-[#D4AF37]">
              <img src="/company_logo.png" className="w-10 h-10" alt="SNJ GlobalRoutes Logo" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-lg lg:text-xl font-bold tracking-tight text-white uppercase leading-none">
                GLOBAL<span className="text-[#D4AF37]">ROUTES</span>
              </span>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.35em] mt-0.5">SNJ Official Portal</span>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-3">
            <ul className="flex items-center gap-0.5 bg-[#0a1b33] border border-[#D4AF37]/15 p-1">
              {navItems.map(({ name, path, Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <li key={name}>
                    <Link
                      to={path}
                      className={`flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider transition-all duration-200 ${
                        isActive
                          ? 'text-[#0B1F3A] bg-[#D4AF37]'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {isActive && (
                        <Icon size={13} className="text-[#0B1F3A]" />
                      )}
                      {name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Auth controls */}
            <div className="flex items-center gap-2 ml-2">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2.5 p-1.5 pr-3 bg-white/10 border border-white/20 hover:border-[#D4AF37] transition-all text-white"
                  >
                    <div className="w-8 h-8 bg-[#D4AF37] flex items-center justify-center text-[#0B1F3A] font-bold text-sm">
                      {user.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-bold uppercase leading-tight truncate max-w-[80px] text-white">{user.name || 'User'}</p>
                      <p className="text-[8px] font-bold text-[#D4AF37] uppercase tracking-widest">Active</p>
                    </div>
                    <ChevronDown size={13} className={`transition-transform text-gray-400 ${showUserDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showUserDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 shadow-xl p-2 z-[110]"
                      >
                        <div className="p-3 border-b border-gray-100 mb-1">
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Account</p>
                          <p className="text-xs font-bold text-[#0B1F3A] truncate mt-0.5">{user.email}</p>
                          <p className="text-[9px] font-bold text-[#D4AF37] uppercase mt-0.5">Role: {user.role || 'User'}</p>
                        </div>

                        {isSpecialUser ? (
                          <button
                            onClick={() => { navigate(getDashboardPath()); setShowUserDropdown(false); }}
                            className="w-full flex items-center gap-3 p-2.5 hover:bg-gray-50 transition-all text-left"
                          >
                            <LayoutDashboard size={15} className="text-[#D4AF37]" />
                            <span className="text-xs font-bold uppercase tracking-wider text-[#0B1F3A]">Dashboard</span>
                          </button>
                        ) : (
                          <Link
                            to="/profile"
                            onClick={() => setShowUserDropdown(false)}
                            className="w-full flex items-center gap-3 p-2.5 hover:bg-gray-50 transition-all"
                          >
                            <User size={15} className="text-gray-500" />
                            <span className="text-xs font-bold uppercase text-gray-600">My Profile</span>
                          </Link>
                        )}

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 p-2.5 bg-red-50 hover:bg-red-100 transition-all mt-1"
                        >
                          <LogOut size={15} className="text-red-500" />
                          <span className="text-xs font-bold uppercase tracking-wider text-red-500">Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="relative" ref={joinRef}>
                  <button
                    onClick={() => setShowJoinDropdown(!showJoinDropdown)}
                    className="px-6 py-2.5 bg-[#D4AF37] text-[#0B1F3A] text-[12px] font-bold uppercase tracking-[0.15em] hover:bg-yellow-400 transition-all flex items-center gap-2 border border-[#D4AF37]"
                  >
                    Join Us <ChevronDown size={13} className={`transition-transform ${showJoinDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showJoinDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 shadow-xl p-2 z-[110]"
                      >
                        <button
                          onClick={() => { navigate('/login'); setShowJoinDropdown(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all group"
                        >
                          <LogIn size={15} className="text-[#D4AF37]" />
                          <span className="text-xs font-bold uppercase tracking-wide text-[#0B1F3A]">Login</span>
                        </button>
                        <button
                          onClick={() => { navigate('/register/select'); setShowJoinDropdown(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all mt-0.5"
                        >
                          <UserPlus size={15} className="text-[#D4AF37]" />
                          <span className="text-xs font-bold uppercase tracking-wide text-[#0B1F3A]">Register</span>
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
            <button onClick={() => setIsOpen(true)} className="p-2 bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all">
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── MOBILE MENU ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-[#0B1F3A]/70 backdrop-blur-sm z-[140]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed inset-y-0 right-0 z-[150] w-full max-w-sm bg-[#0B1F3A] flex flex-col p-8 shadow-2xl overflow-y-auto border-l border-[#D4AF37]/20"
              style={{ fontFamily: "'Times New Roman', Times, serif" }}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-2">
                  <img src="/company_logo.png" className="w-10 h-10" alt="Logo" />
                  <span className="font-bold text-lg text-white uppercase">
                    GLOBAL<span className="text-[#D4AF37]">ROUTES</span>
                  </span>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 border border-white/20 text-white hover:bg-white/10">
                  <X size={22} />
                </button>
              </div>

              {/* Language Selector */}
              <div className="mb-8 p-4 bg-white/5 border border-white/10">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Site Language</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => handleTranslate(lang)}
                      className="flex items-center gap-2 p-2 bg-white/10 border border-white/10 hover:border-[#D4AF37] text-[10px] font-bold uppercase text-gray-300 transition-colors"
                    >
                      <span>{lang.flag}</span> {lang.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nav Links */}
              <div className="space-y-1 flex-grow">
                {navItems.map(({ name, path, Icon }, idx) => {
                  const isActive = location.pathname === path;
                  return (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.06 }}
                    >
                      <Link
                        to={path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-4 py-3.5 px-4 border-b border-white/10 font-bold uppercase tracking-wide text-sm transition-all ${
                          isActive
                            ? 'text-[#0B1F3A] bg-[#D4AF37]'
                            : 'text-gray-300 hover:text-[#D4AF37] hover:bg-white/5'
                        }`}
                      >
                        <span className={`text-[10px] font-bold tracking-widest opacity-60 ${isActive ? 'text-[#0B1F3A]' : 'text-[#D4AF37]'}`}>
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        {isActive && <Icon size={15} className="text-[#0B1F3A]" />}
                        {name}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Auth */}
              <div className="mt-8 pt-8 border-t border-white/10">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10">
                      <div className="w-11 h-11 bg-[#D4AF37] flex items-center justify-center text-[#0B1F3A] text-lg font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold uppercase text-white text-sm">{user.name}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">{user.role || 'User'}</p>
                      </div>
                    </div>
                    {isSpecialUser && (
                      <button
                        onClick={() => { navigate(getDashboardPath()); setIsOpen(false); }}
                        className="w-full py-3.5 border-2 border-[#D4AF37] text-[#D4AF37] font-bold uppercase tracking-widest text-sm hover:bg-[#D4AF37] hover:text-[#0B1F3A] transition-all"
                      >
                        Dashboard
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full py-3.5 bg-red-600 text-white font-bold uppercase tracking-widest text-sm hover:bg-red-700 transition-all"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      onClick={() => { navigate('/login'); setIsOpen(false); }}
                      className="w-full py-3.5 border-2 border-[#D4AF37] text-[#D4AF37] font-bold uppercase tracking-widest text-sm hover:bg-[#D4AF37] hover:text-[#0B1F3A] transition-all"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => { navigate('/register/select'); setIsOpen(false); }}
                      className="w-full py-3.5 bg-[#D4AF37] text-[#0B1F3A] font-bold uppercase tracking-widest text-sm hover:bg-yellow-400 transition-all"
                    >
                      Register Now
                    </button>
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