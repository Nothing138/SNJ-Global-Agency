//language switcher
import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'az', name: 'Azərbaycanca', flag: '🇦🇿' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' }, // Middle East / Arabic
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },    // Urdu
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' }, // German
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'mt', name: 'Malti', flag: '🇲🇹' },
  { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Melayu', flag: '🇸🇬' },    // Singapore / Malay
  { code: 'af', name: 'Afrikaans', flag: '🇿🇦' }, // Africa
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' }, // Africa / East Africa
  { code: 'fa', name: 'فارسی', flag: '🇮🇷' },    // Middle East / Persian
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
  { code: 'ne', name: 'नेपाली', flag: '🇳🇵' }
];

const GlobalLanguageSwitcher = () => {
  const [selectedLang, setSelectedLang] = useState('English');

  const changeLanguage = (langCode, langName) => {
    const selectEl = document.querySelector('.goog-te-combo');
    if (selectEl) {
      selectEl.value = langCode;
      selectEl.dispatchEvent(new Event('change'));
      setSelectedLang(langName);
    }
  };

  return (
    <div className="relative group font-['Times_New_Roman',_serif]">
      {/* Hidden Default Google Widget (Don't Remove) */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>

      <button className="flex items-center gap-2 px-4 py-2 bg-slate-900/10 dark:bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 rounded-full transition-all duration-300">
        <Globe size={16} className="text-[#D4AF37]" />
        <span className="text-xs font-black uppercase text-slate-700 dark:text-white">{selectedLang}</span>
        <ChevronDown size={14} className="text-slate-400" />
      </button>

      {/* Grid Style Dropdown - Expanded for more languages */}
      <div className="absolute right-0 mt-3 w-80 p-4 origin-top-right rounded-[2rem] bg-white dark:bg-zinc-900 shadow-2xl border border-slate-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[9999] grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto custom-scrollbar">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code, lang.name)}
            className="flex items-center gap-3 px-3 py-2 text-[10px] font-bold text-slate-600 dark:text-gray-300 hover:bg-[#0B1F3A] hover:text-white rounded-xl transition-all border border-transparent"
          >
            <span className="text-base">{lang.flag}</span>
            <span className="truncate">{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GlobalLanguageSwitcher;