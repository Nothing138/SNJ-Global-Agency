// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "welcome": "Global Career Starts Here",
      "services": "Services",
      "find_jobs": "Find Jobs",
      "visa": "Visa Services",
      "login": "Login",
      "portal": "Client Portal"
    }
  },
  bn: {
    translation: {
      "welcome": "আপনার বৈশ্বিক ক্যারিয়ার শুরু হোক এখান থেকেই",
      "services": "সেবাসমূহ",
      "find_jobs": "চাকরি খুঁজুন",
      "visa": "ভিসা প্রসেসিং",
      "login": "লগইন",
      "portal": "ক্লায়েন্ট পোর্টাল"
    }
  }
};

i18n
  .use(LanguageDetector) // User-er browser language detect korbe
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en', // Language na paile default English hobe
    interpolation: { escapeValue: false }
  });

export default i18n;