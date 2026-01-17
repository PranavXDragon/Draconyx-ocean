'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Waves, Settings, Globe, ShieldOff, ShieldCheck } from 'lucide-react';
import { gsap } from 'gsap';
import NavbarCustomizationPanel, { NavbarCustomization } from './NavbarCustomizationPanel';
import { useLanguage, languages } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

interface NavigationProps {
  onReportClick: () => void;
  onAlertsClick: () => void;
  onAboutClick: () => void;
  onCustomizingChange?: (isCustomizing: boolean) => void;
}

export default function Navigation({ onReportClick, onAlertsClick, onAboutClick, onCustomizingChange }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { bypassMode, toggleBypassMode } = useAuth();
  const [customization, setCustomization] = useState<NavbarCustomization>({
    height: 64,
    horizontalPadding: 24,
    logoSize: 32,
    logoTextSize: 24,
    navLinkSize: 16,
    navLinkSpacing: 32,
    buttonPadding: 24,
    buttonTextSize: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    textColor: '#ffffff',
    accentColor: '#39CCCC',
    fontFamily: 'Inter',
    fontWeight: '600',
    glassEffect: true,
    showShadow: true,
    logoText: 'SAMUDRASATHI',
    showLogo: true,
    showLogoIcon: true,
    showLogoText: true,
    buttonText: 'Report Now',
    showButton: true,
    navLinks: [
      { id: '1', href: '#home', label: 'Home', enabled: true },
      { id: '2', href: '#map', label: 'Map', enabled: true },
      { id: '3', href: '#guide', label: 'Guide', enabled: true },
      { id: '4', href: '#alerts', label: 'Alerts', enabled: true },
      { id: '5', href: '#about', label: 'About', enabled: true },
    ],
    logoPosition: 'left',
    navPosition: 'right',
    elementOrder: ['logo', 'nav', 'button'],
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    onCustomizingChange?.(showCustomization);
  }, [showCustomization, onCustomizingChange]);

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showLanguageMenu) {
        const target = event.target as HTMLElement;
        if (!target.closest('.language-selector')) {
          setShowLanguageMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLanguageMenu]);

  const enabledNavLinks = customization.navLinks.filter(link => link.enabled);

  // Helper to translate nav link labels
  const translateNavLabel = (label: string) => {
    const labelMap: { [key: string]: string } = {
      'Home': t('nav.home'),
      'Map': 'Map',
      'Guide': 'Guide',
      'Alerts': t('nav.viewAlerts'),
      'About': t('nav.about'),
    };
    return labelMap[label] || label;
  };

  // Generate dynamic styles
  const navStyle = {
    height: `${customization.height}px`,
    fontFamily: customization.fontFamily,
    fontWeight: customization.fontWeight,
  };

  const containerStyle = {
    paddingLeft: `${customization.horizontalPadding}px`,
    paddingRight: `${customization.horizontalPadding}px`,
  };

  const logoIconStyle = {
    width: `${customization.logoSize}px`,
    height: `${customization.logoSize}px`,
    color: customization.accentColor,
  };

  const logoTextStyle = {
    fontSize: `${customization.logoTextSize}px`,
    fontWeight: customization.fontWeight,
  };

  const navLinkStyle = {
    fontSize: `${customization.navLinkSize}px`,
    color: customization.textColor,
    fontWeight: customization.fontWeight,
  };

  const navLinkHoverStyle = {
    '--hover-color': customization.accentColor,
  } as React.CSSProperties;

  const buttonStyle = {
    paddingLeft: `${customization.buttonPadding}px`,
    paddingRight: `${customization.buttonPadding}px`,
    fontSize: `${customization.buttonTextSize}px`,
  };

  const navClassNames = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    scrolled 
      ? `${customization.glassEffect ? 'glass' : ''} ${customization.showShadow ? 'shadow-lg' : ''}`
      : 'bg-transparent'
  }`;

  // Render elements based on order
  const renderLogo = () => {
    if (!customization.showLogo) return null;
    
    return (
      <div className="flex items-center flex-shrink-0" style={{ gap: '12px' }}>
        {/* Logo Image - Add your logo here */}
        <img 
          src="/logo.png" 
          alt="SAMUDRASATHI Logo" 
          className="h-10 w-auto object-contain"
          onError={(e) => {
            // Hide image if logo.png doesn't exist
            e.currentTarget.style.display = 'none';
          }}
        />
        
        {customization.showLogoText && (
          <span className="text-gradient whitespace-nowrap" style={logoTextStyle}>
            {customization.logoText}
          </span>
        )}
      </div>
    );
  };

  const renderNavLinks = () => {
    if (enabledNavLinks.length === 0) return null;

    return (
      <div className="hidden md:flex items-center" style={{ gap: `${customization.navLinkSpacing}px` }}>
        {enabledNavLinks.map((link) => (
          <a
            key={link.id}
            href={link.href}
            onClick={(e) => {
              if (link.href === '#alerts') {
                e.preventDefault();
                onAlertsClick();
              } else if (link.href === '#about') {
                e.preventDefault();
                onAboutClick();
              }
            }}
            className="transition-all duration-300 hover-accent relative group hover:scale-110"
            style={{ ...navLinkStyle, ...navLinkHoverStyle }}
          >
            {translateNavLabel(link.label)}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300 ease-out" />
          </a>
        ))}
      </div>
    );
  };

  const renderButton = () => {
    if (!customization.showButton) return null;

    return (
      <button
        onClick={onReportClick}
        className="py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-semibold hover:scale-105 transition-transform duration-300 whitespace-nowrap hidden md:block"
        style={buttonStyle}
      >
        {t('nav.reportIncident')}
      </button>
    );
  };

  const renderElements = () => {
    const elements: { [key: string]: React.ReactNode } = {
      logo: renderLogo(),
      nav: renderNavLinks(),
      button: renderButton(),
    };

    return customization.elementOrder.map((key, index) => (
      <div key={key} className={index === 0 ? '' : 'flex items-center'}>
        {elements[key]}
      </div>
    ));
  };

  return (
    <>
      <nav className={navClassNames} style={navStyle}>
        <div className="max-w-7xl mx-auto" style={containerStyle}>
          <div className="flex items-center justify-between w-full" style={{ height: `${customization.height}px` }}>
            {/* Left Side: Logo */}
            <div className="flex items-center flex-shrink-0">
              {renderLogo()}
            </div>

            {/* Right Side: Nav Links, Button, Language, Settings, Mobile Menu */}
            <div className="flex items-center gap-6 ml-auto">
              {renderNavLinks()}
              {renderButton()}
              
              {/* Language Selector */}
              <div className="relative language-selector">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 flex-shrink-0"
                  style={{ color: customization.accentColor }}
                  title="Change Language"
                >
                  <Globe className="w-5 h-5" />
                  <span className="text-sm font-medium hidden lg:block" style={{ color: customization.textColor }}>
                    {languages.find(l => l.code === language)?.code.toUpperCase()}
                  </span>
                </button>
                
                {/* Language Dropdown */}
                {showLanguageMenu && (
                  <div className="absolute right-0 mt-2 w-64 glass rounded-xl overflow-hidden shadow-2xl z-50">
                    <div className="max-h-96 overflow-y-auto">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setShowLanguageMenu(false);
                          }}
                          className={`w-full text-left px-4 py-3 hover:bg-white/10 transition-colors flex items-center justify-between ${
                            language === lang.code ? 'bg-white/20' : ''
                          }`}
                          style={{ color: customization.textColor }}
                        >
                          <div>
                            <div className="font-medium">{lang.nativeName}</div>
                            <div className="text-xs opacity-70">{lang.name}</div>
                          </div>
                          {language === lang.code && (
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: customization.accentColor }} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Bypass Mode Toggle (Dev Tool) */}
              <button
                onClick={toggleBypassMode}
                className={`p-2 rounded-lg transition-all flex-shrink-0 ${
                  bypassMode 
                    ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400' 
                    : 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                }`}
                title={bypassMode ? 'Bypass Mode: ON (Click to disable)' : 'Bypass Mode: OFF (Click to enable)'}
              >
                {bypassMode ? <ShieldOff className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
              </button>
              
              {/* Settings Button */}
              <button
                onClick={() => setShowCustomization(true)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                style={{ color: customization.accentColor }}
                title="Customize Navbar"
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
                style={{ color: customization.textColor }}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden glass mt-2 mx-4 rounded-xl overflow-hidden">
            <div className="px-4 py-2 space-y-1">
              {enabledNavLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  className="block px-4 py-3 hover:bg-white/10 rounded-lg transition-all duration-300 relative group hover:scale-105"
                  style={{ ...navLinkStyle, fontSize: '16px' }}
                  onClick={(e) => {
                    if (link.href === '#alerts') {
                      e.preventDefault();
                      onAlertsClick();
                    } else if (link.href === '#about') {
                      e.preventDefault();
                      onAboutClick();
                    }
                    setIsOpen(false);
                  }}
                >
                  {translateNavLabel(link.label)}
                  <span className="absolute bottom-2 left-4 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-[calc(100%-2rem)] transition-all duration-300 ease-out" />
                </a>
              ))}
              {customization.showButton && (
                <button
                  onClick={() => {
                    onReportClick();
                    setIsOpen(false);
                  }}
                  className="w-full mt-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-semibold"
                  style={{ fontSize: `${customization.buttonTextSize}px` }}
                >
                  {t('nav.reportIncident')}
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Customization Panel */}
      {showCustomization && (
        <NavbarCustomizationPanel
          customization={customization}
          onChange={setCustomization}
          onClose={() => setShowCustomization(false)}
        />
      )}

      {/* Custom Styles for Hover Effects */}
      <style jsx>{`
        .hover-accent:hover {
          color: ${customization.accentColor} !important;
        }
      `}</style>
    </>
  );
}
