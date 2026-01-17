'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { ShieldOff, CheckCircle } from 'lucide-react';
import Hero from '@/components/features/hero/Hero';
import ReportForm from '@/components/features/reports/ReportForm';
import AlertsPanel from '@/components/features/reports/AlertsPanel';
import AboutPanel from '@/components/features/about/AboutPanel';
import AuthModal from '@/components/features/auth/AuthModal';
import Dashboard from '@/components/features/dashboard/Dashboard';
import AuthorityDashboard from '@/components/features/authority/AuthorityDashboard';
import EmergencyBroadcast from '@/components/features/emergency/EmergencyBroadcast';
import ContactModal from '@/components/features/legal/ContactModal';
import FAQModal from '@/components/features/legal/FAQModal';
import PrivacyPolicyModal from '@/components/features/legal/PrivacyPolicyModal';
import TermsOfServiceModal from '@/components/features/legal/TermsOfServiceModal';
import CookiePolicyModal from '@/components/features/legal/CookiePolicyModal';
import Footer from '@/components/layout/Footer';
import Navigation from '@/components/layout/Navigation';
import ParticlesBackground from '@/components/ui/ParticlesBackground';
import OceanBackground from '@/components/ui/OceanBackground';
import { IncidentReport } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

// Dynamically import OceanMap to avoid SSR issues with Leaflet
const OceanMap = dynamic(() => import('@/components/features/map/OceanMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] glass rounded-2xl flex items-center justify-center">
      <div className="text-cyan-400 text-xl">Loading map...</div>
    </div>
  ),
});

export default function Home() {
  const { isAuthenticated, bypassMode, toggleBypassMode } = useAuth();
  const { t } = useLanguage();
  const [reports, setReports] = useState<IncidentReport[]>([
    {
      id: '1',
      latitude: 25.7617,
      longitude: -80.1918,
      type: 'pollution',
      severity: 'high',
      description: 'Oil spill detected near Miami coast',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'active'
    },
    {
      id: '2',
      latitude: 34.0522,
      longitude: -118.2437,
      type: 'wildlife',
      severity: 'medium',
      description: 'Unusual whale behavior observed',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: 'active'
    },
    {
      id: '3',
      latitude: 40.7128,
      longitude: -74.0060,
      type: 'debris',
      severity: 'low',
      description: 'Large debris field spotted',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      status: 'active'
    },
  ]);

  const [showReportForm, setShowReportForm] = useState(false);
  const [showAlertsPanel, setShowAlertsPanel] = useState(false);
  const [showAboutPanel, setShowAboutPanel] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAuthorityDashboard, setShowAuthorityDashboard] = useState(false);
  const [showEmergencyBroadcast, setShowEmergencyBroadcast] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showCookiesModal, setShowCookiesModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'report' | 'alerts' | null>(null);
  const [isNavCustomizing, setIsNavCustomizing] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [generatedReportId, setGeneratedReportId] = useState('');

  // Keyboard shortcut for bypass mode (Ctrl+Shift+B)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'B') {
        e.preventDefault();
        toggleBypassMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleBypassMode]);

  const handleReportClick = () => {
    if (isAuthenticated) {
      setShowReportForm(true);
    } else {
      setPendingAction('report');
      setShowAuthModal(true);
    }
  };

  const handleAlertsClick = () => {
    if (isAuthenticated) {
      setShowAlertsPanel(true);
    } else {
      setPendingAction('alerts');
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    if (pendingAction === 'report') {
      setShowReportForm(true);
    } else if (pendingAction === 'alerts') {
      setShowAlertsPanel(true);
    }
    setPendingAction(null);
  };

  const handleNewReport = (report: Omit<IncidentReport, 'id' | 'timestamp' | 'status'>) => {
    // Generate unique report ID
    const uniqueId = `OCN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    const newReport: IncidentReport = {
      ...report,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      status: 'active'
    };
    setReports([newReport, ...reports]);
    setShowReportForm(false);
    
    // Store the generated report ID and show success notification
    setGeneratedReportId(uniqueId);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 5000);
  };

  return (
    <>
      <div className={`transition-all duration-300 ${isNavCustomizing ? 'blur-sm' : ''}`}>
        <OceanBackground />
        <ParticlesBackground />
      </div>
      <Navigation 
        onReportClick={handleReportClick}
        onAlertsClick={handleAlertsClick}
        onAboutClick={() => setShowAboutPanel(true)}
        onDashboardClick={() => setShowDashboard(true)}
        onAuthorityClick={() => setShowAuthorityDashboard(true)}
        onEmergencyClick={() => setShowEmergencyBroadcast(true)}
        onCustomizingChange={setIsNavCustomizing}
      />
      
      {/* Bypass Mode Banner */}
      {bypassMode && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-gradient-to-r from-green-500/90 to-emerald-600/90 backdrop-blur-sm py-2 px-4 shadow-lg border-b-2 border-green-400 animate-pulse">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-white font-semibold text-sm sm:text-base">
            <ShieldOff className="w-5 h-5 animate-bounce" />
            <span>🔓 BYPASS MODE ACTIVE - Authentication disabled</span>
            <span className="hidden sm:inline text-xs opacity-80">(Press Ctrl+Shift+B to toggle)</span>
          </div>
        </div>
      )}
      
      <main className={`relative z-10 transition-all duration-300 ${isNavCustomizing ? 'blur-sm pointer-events-none' : ''} ${bypassMode ? 'pt-12' : ''}`}>
        <Hero onReportClick={handleReportClick} />
        
        <section id="map" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-gradient">
                Live Ocean Monitoring
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                Real-time incident tracking across global waters
              </p>
            </div>
            <OceanMap reports={reports} />
          </div>
        </section>

        {/* How to Use Section */}
        <section id="guide" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-gradient">
                {t('guide.title')}
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                {t('hero.description')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="flip-card h-80 sm:h-96">
                <div className="flip-card-inner">
                  {/* Front - Image */}
                  <div className="flip-card-front rounded-2xl overflow-hidden">
                    <Image 
                      src="/Step 1.png" 
                      alt="Step 1" 
                      fill
                      className="object-cover"
                    />
                  </div>
                  {/* Back - Card Content */}
                  <div className="flip-card-back glass rounded-2xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-bl-full" />
                    <div className="relative z-10">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-6">
                        <span className="text-3xl font-bold text-white">1</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">{t('guide.step1.title')}</h3>
                      <p className="text-gray-300 leading-relaxed">
                        {t('guide.step1.desc')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flip-card h-80 sm:h-96">
                <div className="flip-card-inner">
                  {/* Front - Image */}
                  <div className="flip-card-front rounded-2xl overflow-hidden">
                    <Image 
                      src="/Step 2.png" 
                      alt="Step 2" 
                      fill
                      className="object-cover"
                    />
                  </div>
                  {/* Back - Card Content */}
                  <div className="flip-card-back glass rounded-2xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-bl-full" />
                    <div className="relative z-10">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6">
                        <span className="text-3xl font-bold text-white">2</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">{t('guide.step2.title')}</h3>
                      <p className="text-gray-300 leading-relaxed">
                        {t('guide.step2.desc')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flip-card h-80 sm:h-96">
                <div className="flip-card-inner">
                  {/* Front - Image */}
                  <div className="flip-card-front rounded-2xl overflow-hidden">
                    <Image 
                      src="/Step 3.png" 
                      alt="Step 3" 
                      fill
                      className="object-cover"
                    />
                  </div>
                  {/* Back - Card Content */}
                  <div className="flip-card-back glass rounded-2xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-bl-full" />
                    <div className="relative z-10">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-6">
                        <span className="text-3xl font-bold text-white">3</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">{t('guide.step4.title')}</h3>
                      <p className="text-gray-300 leading-relaxed">
                        {t('guide.step4.desc')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flip-card h-80 sm:h-96">
                <div className="flip-card-inner">
                  {/* Front - Image */}
                  <div className="flip-card-front rounded-2xl overflow-hidden">
                    <Image 
                      src="/Step 4.png" 
                      alt="Step 4" 
                      fill
                      className="object-cover"
                    />
                  </div>
                  {/* Back - Card Content */}
                  <div className="flip-card-back glass rounded-2xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-bl-full" />
                    <div className="relative z-10">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mb-6">
                        <span className="text-3xl font-bold text-white">4</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">{t('guide.step3.title')}</h3>
                      <p className="text-gray-300 leading-relaxed">
                        {t('guide.step3.desc')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center mt-12">
              <button
                onClick={handleReportClick}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-semibold text-lg hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-cyan-500/50"
              >
                Report Now
              </button>
            </div>
          </div>
        </section>
      </main>

      {showAlertsPanel && (
        <AlertsPanel 
          reports={reports}
          onClose={() => setShowAlertsPanel(false)}
        />
      )}

      {showAboutPanel && (
        <AboutPanel 
          onClose={() => setShowAboutPanel(false)}
        />
      )}

      {showDashboard && (
        <Dashboard
          onClose={() => setShowDashboard(false)}
          userReports={reports}
        />
      )}

      {showAuthorityDashboard && (
        <AuthorityDashboard
          onClose={() => setShowAuthorityDashboard(false)}
          allReports={reports}
        />
      )}

      {showEmergencyBroadcast && (
        <EmergencyBroadcast
          onClose={() => setShowEmergencyBroadcast(false)}
        />
      )}

      {showReportForm && (
        <ReportForm
          onClose={() => setShowReportForm(false)}
          onSubmit={handleNewReport}
        />
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => {
            setShowAuthModal(false);
            setPendingAction(null);
          }}
          onSuccess={handleAuthSuccess}
        />
      )}

      {/* Success Toast Notification */}
      {showSuccessToast && (
        <>
          {/* Backdrop Blur Overlay */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-[99] animate-in fade-in" />
          
          {/* Notification */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] animate-in zoom-in w-[90vw] sm:w-auto max-w-md px-4 sm:px-0">
            <div className="glass rounded-xl p-4 sm:p-6 shadow-2xl border border-green-400/30 backdrop-blur-xl bg-gradient-to-r from-green-500/20 to-emerald-600/20 w-full sm:min-w-[400px]">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold text-base sm:text-lg mb-1">
                    Report Submitted Successfully
                  </h4>
                  <p className="text-gray-300 text-xs sm:text-sm mb-2">
                    Your report has been received and authorities have been notified.
                  </p>
                  <div className="bg-black/30 rounded px-2 sm:px-3 py-1.5 sm:py-2 border border-green-400/30">
                    <p className="text-[10px] sm:text-xs text-gray-400 mb-0.5">Report ID:</p>
                    <p className="text-green-400 font-mono text-xs sm:text-sm font-semibold break-all">{generatedReportId}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowSuccessToast(false)}
                  className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                >
                  <span className="text-xl sm:text-2xl">×</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Legal Modals */}
      {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} />}
      {showFAQModal && <FAQModal onClose={() => setShowFAQModal(false)} />}
      {showPrivacyModal && <PrivacyPolicyModal onClose={() => setShowPrivacyModal(false)} />}
      {showTermsModal && <TermsOfServiceModal onClose={() => setShowTermsModal(false)} />}
      {showCookiesModal && <CookiePolicyModal onClose={() => setShowCookiesModal(false)} />}

      {/* Footer */}
      <Footer 
        onReportClick={handleReportClick}
        onAlertsClick={handleAlertsClick}
        onAboutClick={() => setShowAboutPanel(true)}
        onContactClick={() => setShowContactModal(true)}
        onFAQClick={() => setShowFAQModal(true)}
        onPrivacyClick={() => setShowPrivacyModal(true)}
        onTermsClick={() => setShowTermsModal(true)}
        onCookiesClick={() => setShowCookiesModal(true)}
      />
    </>
  );
}
