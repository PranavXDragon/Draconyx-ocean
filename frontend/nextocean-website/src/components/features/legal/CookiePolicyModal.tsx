'use client';

import { motion } from 'framer-motion';
import { X, Cookie, Settings, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

interface CookiePolicyModalProps {
  onClose: () => void;
}

export default function CookiePolicyModal({ onClose }: CookiePolicyModalProps) {
  const [preferences, setPreferences] = useState({
    essential: true,
    functional: true,
    analytics: true,
    advertising: false,
  });

  const handleSavePreferences = () => {
    // Save preferences to localStorage
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    alert('Cookie preferences saved successfully!');
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 flex items-center justify-center z-[91] p-4"
      >
        <div className="w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-slate-900/95 to-blue-900/95 backdrop-blur-xl shadow-2xl rounded-2xl overflow-y-auto border border-white/10">
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Cookie className="w-8 h-8 text-cyan-400" />
                <h2 className="text-3xl sm:text-4xl font-bold text-gradient">Cookie Policy</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="space-y-6 text-gray-300">
              <p className="text-sm text-gray-400">
                <strong>Last Updated:</strong> January 18, 2026
              </p>

              {/* Introduction */}
              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">What Are Cookies?</h3>
                <p className="leading-relaxed">
                  Cookies are small text files that are stored on your device when you visit our platform. They help us provide you with a better experience by remembering your preferences, keeping you logged in, and understanding how you use our services.
                </p>
              </div>

              {/* Types of Cookies */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Settings className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-bold text-white">Types of Cookies We Use</h3>
                </div>

                <div className="space-y-4">
                  {/* Essential Cookies */}
                  <div className="glass rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        Essential Cookies (Required)
                      </h4>
                      <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                        Always Active
                      </span>
                    </div>
                    <p className="text-sm mb-2">
                      These cookies are necessary for the platform to function properly. They enable core functionality such as security, network management, and accessibility.
                    </p>
                    <p className="text-xs text-gray-400">
                      Examples: Authentication, session management, security tokens
                    </p>
                  </div>

                  {/* Functional Cookies */}
                  <div className="glass rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">Functional Cookies</h4>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.functional}
                          onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                      </label>
                    </div>
                    <p className="text-sm mb-2">
                      These cookies enable enhanced functionality and personalization, such as language preferences, theme settings, and remembering your choices.
                    </p>
                    <p className="text-xs text-gray-400">
                      Examples: Language selection, theme preferences, notification settings
                    </p>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="glass rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">Analytics Cookies</h4>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.analytics}
                          onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                      </label>
                    </div>
                    <p className="text-sm mb-2">
                      These cookies help us understand how visitors interact with our platform, which pages are visited most, and if users encounter errors. This helps us improve our services.
                    </p>
                    <p className="text-xs text-gray-400">
                      Examples: Google Analytics, page view tracking, error monitoring
                    </p>
                  </div>

                  {/* Advertising Cookies */}
                  <div className="glass rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">Advertising Cookies</h4>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.advertising}
                          onChange={(e) => setPreferences({ ...preferences, advertising: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                      </label>
                    </div>
                    <p className="text-sm mb-2">
                      These cookies are used to deliver relevant advertisements and track campaign effectiveness. We use these sparingly and only with your consent.
                    </p>
                    <p className="text-xs text-gray-400">
                      Examples: Ad targeting, conversion tracking, retargeting
                    </p>
                  </div>
                </div>

                {/* Save Preferences Button */}
                <button
                  onClick={handleSavePreferences}
                  className="w-full mt-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg font-bold text-white transition-all transform hover:scale-105"
                >
                  Save Preferences
                </button>
              </div>

              {/* Third-Party Cookies */}
              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">Third-Party Cookies</h3>
                <p className="leading-relaxed mb-3">
                  Some cookies are placed by third-party services that appear on our pages. We use the following third-party services:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Google Analytics:</strong> Website analytics and usage tracking</li>
                  <li><strong>Mapbox/Leaflet:</strong> Interactive maps and location services</li>
                  <li><strong>CDN Services:</strong> Fast content delivery and performance</li>
                </ul>
                <p className="mt-3 text-sm text-yellow-400">
                  These services have their own privacy policies governing cookie use.
                </p>
              </div>

              {/* Managing Cookies */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <XCircle className="w-6 h-6 text-orange-400" />
                  <h3 className="text-xl font-bold text-white">How to Manage Cookies</h3>
                </div>
                
                <p className="mb-3">You can control cookies through:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Browser Settings:</strong> Most browsers allow you to refuse or delete cookies</li>
                  <li><strong>Our Cookie Banner:</strong> When you first visit, you can customize preferences</li>
                  <li><strong>This Page:</strong> Use the toggles above to adjust settings at any time</li>
                  <li><strong>Opt-out Tools:</strong> Use tools like <a href="https://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Your Online Choices</a></li>
                </ul>
                
                <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                  <p className="text-sm text-orange-400">
                    <strong>Note:</strong> Disabling essential cookies may affect platform functionality and your user experience.
                  </p>
                </div>
              </div>

              {/* Browser Instructions */}
              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">Browser-Specific Instructions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="glass rounded-lg p-3 hover:bg-white/10 transition-colors">
                    <h4 className="font-semibold text-white mb-1">Google Chrome</h4>
                    <p className="text-gray-400">Manage cookies in Chrome →</p>
                  </a>
                  <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="glass rounded-lg p-3 hover:bg-white/10 transition-colors">
                    <h4 className="font-semibold text-white mb-1">Firefox</h4>
                    <p className="text-gray-400">Manage cookies in Firefox →</p>
                  </a>
                  <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="glass rounded-lg p-3 hover:bg-white/10 transition-colors">
                    <h4 className="font-semibold text-white mb-1">Safari</h4>
                    <p className="text-gray-400">Manage cookies in Safari →</p>
                  </a>
                  <a href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" className="glass rounded-lg p-3 hover:bg-white/10 transition-colors">
                    <h4 className="font-semibold text-white mb-1">Edge</h4>
                    <p className="text-gray-400">Manage cookies in Edge →</p>
                  </a>
                </div>
              </div>

              {/* Updates to Policy */}
              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">Updates to This Policy</h3>
                <p className="leading-relaxed">
                  We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated "Last Updated" date. We encourage you to review this policy periodically.
                </p>
              </div>

              {/* Contact Information */}
              <div className="glass rounded-xl p-6 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border-cyan-500/30">
                <h3 className="text-xl font-bold text-white mb-3">Questions About Cookies?</h3>
                <p className="mb-3">
                  If you have questions about our use of cookies:
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> <a href="mailto:privacy@samudrasathi.com" className="text-cyan-400 hover:underline">privacy@samudrasathi.com</a></p>
                  <p><strong>Phone:</strong> 1800-123-4567</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
