
/**
 * Footer Component
 * Displays site information, quick links, social media links, and a newsletter subscription form.
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, Instagram, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import pb from '@/lib/pocketbaseClient.js';

function Footer() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handles newsletter form submission.
   * Saves the email to the 'newsletterSubscribers' collection in PocketBase.
   * 
   * @param {React.FormEvent} e - Form submission event
   */
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    try {
      await pb.collection('newsletterSubscribers').create({ email }, { $autoCancel: false });
      toast({
        title: `${t('common.success')}! 🎉`,
        description: "You've been subscribed to our newsletter."
      });
      setEmail('');
    } catch (error) {
      toast({
        title: t('common.error'),
        description: "You might already be subscribed or an error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Social media links configuration
  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/risehub.hq/', label: 'Instagram' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:contact@risehubhq.store', label: 'Email' }
  ];

  // Quick links configuration using translations
  const quickLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/shop', label: t('nav.shop') },
    { path: '/about', label: t('nav.about') },
    { path: '/contact', label: t('nav.contact') }
  ];

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">RiseHub</h3>
            <p className="text-muted-foreground text-sm mb-4">
              {t('footer.about')}
            </p>
            <div className="flex space-x-2 rtl:space-x-reverse">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:text-primary transition-colors"
                  asChild
                >
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.newsletter')}</h3>
            <p className="text-muted-foreground text-sm mb-4">
              {t('footer.newsletterDesc')}
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex space-x-2 rtl:space-x-reverse">
              <Input
                type="email"
                placeholder={t('home.newsletterPlaceholder')}
                className="flex-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : t('home.newsletterBtn')}
              </Button>
            </form>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-border pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            {t('footer.rights', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
