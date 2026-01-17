'use client';

import { motion } from 'framer-motion';
import { X, Shield, Lock, Eye, Database, UserCheck, AlertTriangle } from 'lucide-react';

interface PrivacyPolicyModalProps {
  onClose: () => void;
}

export default function PrivacyPolicyModal({ onClose }: PrivacyPolicyModalProps) {
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
                <Shield className="w-8 h-8 text-cyan-400" />
                <h2 className="text-3xl sm:text-4xl font-bold text-gradient">Privacy Policy</h2>
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
                <h3 className="text-xl font-bold text-white mb-3">Introduction</h3>
                <p className="leading-relaxed">
                  Welcome to SAMUDRASATHI. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our coastal hazard reporting platform.
                </p>
              </div>

              {/* Information We Collect */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Database className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-bold text-white">Information We Collect</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">1. Information You Provide</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Account information (name, email, phone number)</li>
                      <li>Report details (incident descriptions, photos, videos)</li>
                      <li>Location data when submitting reports</li>
                      <li>Communication preferences and feedback</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-2">2. Automatically Collected Information</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Device information (type, operating system, browser)</li>
                      <li>IP address and general location</li>
                      <li>Usage data and interaction patterns</li>
                      <li>Cookies and similar tracking technologies</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-2">3. Geolocation Data</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Precise GPS coordinates when reporting hazards</li>
                      <li>General location for nearby alerts</li>
                      <li>You can disable location services in your device settings</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* How We Use Your Information */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-bold text-white">How We Use Your Information</h3>
                </div>
                
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Process and verify hazard reports</li>
                  <li>Notify relevant authorities about incidents</li>
                  <li>Send you alerts about nearby hazards</li>
                  <li>Maintain and improve platform functionality</li>
                  <li>Calculate trust scores and gamification features</li>
                  <li>Communicate updates and safety information</li>
                  <li>Analyze trends for predictive forecasting</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>

              {/* Information Sharing */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <UserCheck className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-bold text-white">Information Sharing</h3>
                </div>
                
                <p className="mb-3">We share your information only in the following circumstances:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Government Authorities:</strong> Coast Guard, Marine Police, Environmental agencies for emergency response</li>
                  <li><strong>Service Providers:</strong> Cloud hosting, AI processing, map services (under strict confidentiality agreements)</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect rights and safety</li>
                  <li><strong>Anonymous Data:</strong> Aggregated, de-identified data for research and public awareness</li>
                </ul>
                <p className="mt-3 text-sm text-yellow-400">
                  We never sell your personal information to third parties.
                </p>
              </div>

              {/* Data Security */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-bold text-white">Data Security</h3>
                </div>
                
                <p className="mb-3">We implement industry-standard security measures:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>End-to-end encryption for data transmission</li>
                  <li>Secure cloud storage with access controls</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Employee training on data protection</li>
                  <li>Multi-factor authentication for sensitive operations</li>
                </ul>
              </div>

              {/* Your Rights */}
              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">Your Rights</h3>
                
                <p className="mb-3">You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your data (subject to legal retention requirements)</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                  <li><strong>Data Portability:</strong> Receive your data in a machine-readable format</li>
                  <li><strong>Withdraw Consent:</strong> Revoke permissions for data processing</li>
                </ul>
                
                <p className="mt-4 text-sm">
                  To exercise these rights, contact us at <a href="mailto:privacy@samudrasathi.com" className="text-cyan-400 hover:underline">privacy@samudrasathi.com</a>
                </p>
              </div>

              {/* Children's Privacy */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-orange-400" />
                  <h3 className="text-xl font-bold text-white">Children's Privacy</h3>
                </div>
                
                <p className="leading-relaxed">
                  Our platform is not intended for children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately.
                </p>
              </div>

              {/* International Users */}
              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">International Users</h3>
                <p className="leading-relaxed">
                  If you access our platform from outside India, your information may be transferred to and processed in India. By using our services, you consent to this transfer and processing in accordance with this Privacy Policy and Indian data protection laws.
                </p>
              </div>

              {/* Changes to Policy */}
              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">Changes to This Policy</h3>
                <p className="leading-relaxed">
                  We may update this Privacy Policy periodically. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date. Your continued use of the platform after changes constitutes acceptance of the updated policy.
                </p>
              </div>

              {/* Contact Information */}
              <div className="glass rounded-xl p-6 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border-cyan-500/30">
                <h3 className="text-xl font-bold text-white mb-3">Contact Us</h3>
                <p className="mb-3">
                  For questions about this Privacy Policy or our data practices:
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> <a href="mailto:privacy@samudrasathi.com" className="text-cyan-400 hover:underline">privacy@samudrasathi.com</a></p>
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
