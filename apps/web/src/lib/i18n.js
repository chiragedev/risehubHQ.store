
/**
 * i18n Configuration Module
 * Initializes react-i18next with English, Arabic, and French translations.
 * Handles language persistence and RTL layout switching.
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from '../locales/en.json';
import arTranslations from '../locales/ar.json';
import frTranslations from '../locales/fr.json';

const resources = {
  en: { translation: enTranslations },
  ar: { translation: arTranslations },
  fr: { translation: frTranslations }
};

// Initialize i18next instance
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en', // Default to English or saved language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values to prevent XSS
    }
  });

// Set initial document direction based on loaded language
document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';

export default i18n;
