'use client';

import { Waves, Mail, Phone, MapPin, Github, Twitter, Linkedin, Facebook } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FooterProps {
  onReportClick: () => void;
  onAlertsClick: () => void;
  onAboutClick: () => void;
  onContactClick: () => void;
  onFAQClick: () => void;
  onPrivacyClick: () => void;
  onTermsClick: () => void;
  onCookiesClick: () => void;
}

export default function Footer({ 
  onReportClick, 
  onAlertsClick, 
  onAboutClick,
  onContactClick,
  onFAQClick,
  onPrivacyClick,
  onTermsClick,
  onCookiesClick 
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    if (href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href === '#report') {
      onReportClick();
    } else if (href === '#alerts') {
      onAlertsClick();
    } else if (href === '#about') {
      onAboutClick();
    } else if (href === '#contact') {
      onContactClick();
    } else if (href === '#faq') {
      onFAQClick();
    } else if (href === '#privacy') {
      onPrivacyClick();
    } else if (href === '#terms') {
      onTermsClick();
    } else if (href === '#cookies') {
      onCookiesClick();
    } else if (href.startsWith('#')) {
      // Scroll to section
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const quickLinks = [
    { label: t('footer.home'), href: '#home' },
    { label: 'Map', href: '#map' },
    { label: t('footer.viewAlerts'), href: '#alerts' },
    { label: t('footer.reportIncident'), href: '#report' },
  ];

  const resources = [
    { label: t('footer.about'), href: '#about' },
    { label: t('footer.contact'), href: '#contact' },
    { label: t('footer.faq'), href: '#faq' },
    { label: t('footer.howToUse'), href: '#guide' },
  ];

  const legal = [
    { label: t('footer.privacy'), href: '#privacy' },
    { label: t('footer.terms'), href: '#terms' },
    { label: t('footer.cookies'), href: '#cookies' },
  ];

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Github, href: '#', label: 'GitHub' },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-transparent to-black/50 border-t border-white/10 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            {/* Logo Image */}
            <div className="mb-4">
              <img 
                src="/logo.png" 
                alt="Ocean Watch Logo" 
                className="h-16 w-auto object-contain"
                onError={(e) => {
                  // Hide image if logo.png doesn't exist
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <Waves className="w-8 h-8 text-cyan-400" />
              <span className="text-2xl font-bold text-gradient">SAMUDRASATHI</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
              Monitor and report abnormal ocean activities in real-time. Together, we protect our oceans and marine ecosystems.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400" />
                <a href="mailto:info@oceanwatch.com" className="hover:text-cyan-400 transition-colors">
                  info@oceanwatch.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400" />
                <a href="tel:+1234567890" className="hover:text-cyan-400 transition-colors">
                  +1 (234) 567-890
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 mt-0.5" />
                <span>123 Ocean Drive, Coastal City, CA 90210</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-gray-400 hover:text-cyan-400 transition-colors text-sm block cursor-pointer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">{t('footer.resources')}</h3>
            <ul className="space-y-2">
              {resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-gray-400 hover:text-cyan-400 transition-colors text-sm block cursor-pointer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">{t('footer.legal')}</h3>
            <ul className="space-y-2">
              {legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-gray-400 hover:text-cyan-400 transition-colors text-sm block cursor-pointer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-gray-400 text-sm text-center md:text-left">
              {t('footer.copyright')}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="p-2 glass rounded-lg hover:bg-cyan-500/20 transition-all duration-300 group"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
