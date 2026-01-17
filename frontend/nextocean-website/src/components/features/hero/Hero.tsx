'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Waves, AlertTriangle, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeroProps {
  onReportClick: () => void;
}

export default function Hero({ onReportClick }: HeroProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);  const logoRef = useRef<HTMLImageElement>(null);  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.from(titleRef.current, {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power4.out'
    })
    .from(subtitleRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.5')
    .from(buttonRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.7)'
    }, '-=0.3');

    // Floating animation
    gsap.to(titleRef.current, {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // Floating animation for logo
    if (logoRef.current) {
      gsap.to(logoRef.current, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }

    // Floating animation for tagline (same as logo)
    if (subtitleRef.current) {
      gsap.to(subtitleRef.current, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden pt-16">
      {/* Animated background waves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-cyan-500/20 to-transparent animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        {/* Logo with Tagline - No spacing */}
        <div className="flex flex-col items-center mb-12">
          <img 
            ref={logoRef}
            src="/logo-large.png" 
            alt="SAMUDRASATHI Logo" 
            className="h-[240px] sm:h-[312px] md:h-[384px] lg:h-[480px] w-auto object-contain max-w-full"
            onError={(e) => {
              // Hide image if logo-large.png doesn't exist
              e.currentTarget.style.display = 'none';
            }}
          />
          {/* Tagline - directly below logo with same animation */}
          <p 
            ref={subtitleRef}
            className="text-lg sm:text-xl md:text-2xl text-gray-300 text-center max-w-3xl mx-auto leading-relaxed px-4 mt-0"
          >
            {t('hero.tagline')}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
          <button
            ref={buttonRef}
            onClick={onReportClick}
            className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-semibold text-base sm:text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              {t('hero.reportNow')}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>

        {/* Stats Cards - Equal Width & Height */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-8 hover:glow transition-all duration-300 flex flex-col items-center justify-center text-center h-full min-h-[160px]">
            <div className="text-4xl sm:text-5xl font-bold text-cyan-400 mb-3">24/7</div>
            <div className="text-base sm:text-lg text-gray-300 font-medium">Active Service</div>
          </div>
          <div className="glass rounded-2xl p-8 hover:glow transition-all duration-300 flex flex-col items-center justify-center text-center h-full min-h-[160px]">
            <div className="text-4xl sm:text-5xl font-bold text-green-400 mb-3">12k+</div>
            <div className="text-base sm:text-lg text-gray-300 font-medium">Active Contributors</div>
          </div>
          <div className="glass rounded-2xl p-8 hover:glow transition-all duration-300 flex flex-col items-center justify-center text-center h-full min-h-[160px]">
            <div className="text-4xl sm:text-5xl font-bold text-yellow-400 mb-3">98%</div>
            <div className="text-base sm:text-lg text-gray-300 font-medium">Response Efficiency</div>
          </div>
        </div>
      </div>
    </section>
  );
}
