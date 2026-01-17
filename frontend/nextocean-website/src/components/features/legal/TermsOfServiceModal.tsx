'use client';

import { motion } from 'framer-motion';
import { X, FileText, AlertCircle, Scale, Ban } from 'lucide-react';

interface TermsOfServiceModalProps {
  onClose: () => void;
}

export default function TermsOfServiceModal({ onClose }: TermsOfServiceModalProps) {
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
                <FileText className="w-8 h-8 text-cyan-400" />
                <h2 className="text-3xl sm:text-4xl font-bold text-gradient">Terms of Service</h2>
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
                <h3 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h3>
                <p className="leading-relaxed">
                  By accessing or using SAMUDRASATHI ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. These terms constitute a legally binding agreement between you and SAMUDRASATHI.
                </p>
              </div>

              {/* Service Description */}
              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">2. Service Description</h3>
                <p className="leading-relaxed mb-3">
                  SAMUDRASATHI provides a platform for:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Reporting coastal and marine hazards</li>
                  <li>Real-time incident tracking and verification</li>
                  <li>Alerting authorities and nearby users</li>
                  <li>Community-driven ocean monitoring</li>
                  <li>Educational resources about marine safety</li>
                </ul>
                <p className="mt-3 text-sm text-yellow-400">
                  We reserve the right to modify, suspend, or discontinue any part of the service at any time.
                </p>
              </div>

              {/* User Obligations */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-bold text-white">3. User Obligations</h3>
                </div>
                
                <p className="mb-3">You agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate and truthful information</li>
                  <li>Submit only genuine hazard reports</li>
                  <li>Maintain the confidentiality of your account credentials</li>
                  <li>Use the platform only for lawful purposes</li>
                  <li>Respect intellectual property rights</li>
                  <li>Not interfere with platform security or functionality</li>
                  <li>Not impersonate others or create fake accounts</li>
                  <li>Follow community guidelines and ethical standards</li>
                </ul>
              </div>

              {/* Prohibited Activities */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Ban className="w-6 h-6 text-red-400" />
                  <h3 className="text-xl font-bold text-white">4. Prohibited Activities</h3>
                </div>
                
                <p className="mb-3 text-red-400">You must NOT:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Submit false, misleading, or fraudulent reports</li>
                  <li>Abuse the platform to cause public panic</li>
                  <li>Harass, threaten, or harm other users</li>
                  <li>Upload malicious content or viruses</li>
                  <li>Attempt to gain unauthorized access to systems</li>
                  <li>Scrape, mine, or extract data without permission</li>
                  <li>Use automated bots or scripts</li>
                  <li>Violate any applicable laws or regulations</li>
                </ul>
                <p className="mt-3 text-sm text-orange-400">
                  Violations may result in account suspension, legal action, and liability for damages.
                </p>
              </div>

              {/* Content and Intellectual Property */}
              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">5. Content and Intellectual Property</h3>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Your Content</h4>
                    <p>
                      You retain ownership of content you submit (photos, videos, reports). By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and distribute it for platform operations and public safety purposes.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-2">Our Content</h4>
                    <p>
                      All platform content, design, logos, and technology are owned by SAMUDRASATHI and protected by intellectual property laws. You may not copy, modify, or distribute our content without written permission.
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Verification Disclaimer */}
              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">6. AI Verification Disclaimer</h3>
                <p className="leading-relaxed">
                  Our AI verification system analyzes reports to determine authenticity and severity. While we strive for accuracy, AI systems are not perfect. We do not guarantee 100% accuracy in verification results. Reports should not be solely relied upon for critical safety decisions. Always follow official government advisories and use common sense.
                </p>
              </div>

              {/* Liability and Indemnification */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Scale className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-bold text-white">7. Limitation of Liability</h3>
                </div>
                
                <p className="leading-relaxed mb-3">
                  SAMUDRASATHI is provided "as is" without warranties of any kind. To the fullest extent permitted by law:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>We are not liable for damages arising from platform use</li>
                  <li>We are not responsible for third-party content or actions</li>
                  <li>We do not guarantee uninterrupted or error-free service</li>
                  <li>Our maximum liability is limited to the amount you paid us (if any)</li>
                </ul>
                <p className="mt-3 font-semibold text-yellow-400">
                  You use this platform at your own risk. In emergencies, always contact official authorities directly.
                </p>
              </div>

              {/* Indemnification */}
              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">8. Indemnification</h3>
                <p className="leading-relaxed">
                  You agree to indemnify and hold harmless SAMUDRASATHI, its affiliates, officers, and employees from any claims, losses, damages, or expenses (including legal fees) arising from your use of the platform, violation of these terms, or infringement of rights.
                </p>
              </div>

              {/* Account Termination */}
              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">9. Account Termination</h3>
                <p className="leading-relaxed mb-3">
                  We reserve the right to suspend or terminate your account:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>For violation of these terms</li>
                  <li>For fraudulent or abusive behavior</li>
                  <li>If your account poses security risks</li>
                  <li>At our discretion for any reason</li>
                </ul>
                <p className="mt-3">
                  You may terminate your account at any time by contacting us. Upon termination, you lose access to your account and associated data.
                </p>
              </div>

              {/* Governing Law */}
              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">10. Governing Law</h3>
                <p className="leading-relaxed">
                  These Terms are governed by the laws of India. Any disputes shall be resolved in the courts of Mumbai, Maharashtra. If any provision is found unenforceable, the remaining provisions remain in full effect.
                </p>
              </div>

              {/* Changes to Terms */}
              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">11. Changes to Terms</h3>
                <p className="leading-relaxed">
                  We may update these Terms of Service at any time. We will notify you of significant changes via email or platform notification. Your continued use after changes indicates acceptance of the new terms.
                </p>
              </div>

              {/* Emergency Disclaimer */}
              <div className="glass rounded-xl p-6 bg-red-500/10 border-red-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                  <h3 className="text-xl font-bold text-red-400">Emergency Disclaimer</h3>
                </div>
                <p className="leading-relaxed font-semibold">
                  SAMUDRASATHI is NOT a substitute for emergency services. In life-threatening situations, immediately call:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                  <li>Coast Guard: 1554</li>
                  <li>Emergency Services: 108</li>
                  <li>Police: 100</li>
                </ul>
              </div>

              {/* Contact Information */}
              <div className="glass rounded-xl p-6 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border-cyan-500/30">
                <h3 className="text-xl font-bold text-white mb-3">Contact Us</h3>
                <p className="mb-3">
                  For questions about these Terms of Service:
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> <a href="mailto:legal@samudrasathi.com" className="text-cyan-400 hover:underline">legal@samudrasathi.com</a></p>
                  <p><strong>Phone:</strong> 1800-123-4567</p>
                  <p><strong>Address:</strong> Marine Conservation Center, Mumbai, Maharashtra 400001</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
