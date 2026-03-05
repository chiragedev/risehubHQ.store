
/**
 * LanguageSelector Component
 * A floating button that allows users to switch between available languages.
 * Handles RTL layout switching and persists selection in localStorage.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // Available languages configuration
  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'ar', label: 'AR' },
    { code: 'fr', label: 'FR' }
  ];

  /**
   * Handles language change, updates localStorage, and sets document direction.
   * 
   * @param {string} lng - Language code (e.g., 'en', 'ar')
   */
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
    setIsOpen(false);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  // Ensure document direction is correct on mount and language change
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return (
    <div className="fixed bottom-4 right-4 z-50 md:bottom-8 md:right-8" dir="ltr">
      <div className="relative">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute bottom-full right-0 mb-2 bg-background border border-border rounded-lg shadow-lg overflow-hidden flex flex-col"
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`px-4 py-2 text-sm font-medium hover:bg-muted transition-colors ${
                    i18n.language === lang.code ? 'bg-primary/10 text-primary' : 'text-foreground'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        <Button
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Select Language"
        >
          <Globe className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
