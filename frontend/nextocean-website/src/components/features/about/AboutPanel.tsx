'use client';

import { useEffect, useRef } from 'react';
import { X, Waves, Target, Users, Shield, Award } from 'lucide-react';
import { gsap } from 'gsap';

interface AboutPanelProps {
  onClose: () => void;
}

export default function AboutPanel({ onClose }: AboutPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' }
      );
    }
  }, []);

  const features = [
    {
      icon: Target,
      title: 'Real-Time Monitoring',
      description: 'Track ocean incidents as they happen with our advanced monitoring system and live map updates.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Powered by a global community of ocean watchers, researchers, and environmental advocates.',
    },
    {
      icon: Shield,
      title: 'Data Protection',
      description: 'Your reports are secure and anonymous. We prioritize privacy while ensuring data integrity.',
    },
    {
      icon: Award,
      title: 'Verified Reports',
      description: 'All incidents are reviewed and verified by our team of marine experts and analysts.',
    },
  ];

  const stats = [
    { value: '50K+', label: 'Reports Submitted' },
    { value: '120+', label: 'Countries' },
    { value: '98%', label: 'Accuracy Rate' },
    { value: '24/7', label: 'Monitoring' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
        onClick={onClose}
      />

      {/* Panel - Centered */}
      <div 
        ref={panelRef}
        className="fixed inset-0 flex items-center justify-center z-[91] p-4"
      >
        <div className="w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-slate-900/95 to-blue-900/95 backdrop-blur-xl shadow-2xl rounded-2xl overflow-y-auto border border-white/10">
          <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Waves className="w-10 h-10 text-cyan-400" />
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gradient">About SAMUDRASATHI</h2>
                <p className="text-gray-400 text-sm sm:text-base">Protecting our oceans together</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mission Statement */}
          <div className="glass rounded-2xl p-6 sm:p-8 mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              SAMUDRASATHI is dedicated to monitoring and protecting our planet's oceans through real-time incident reporting and community collaboration. We believe that by staying vigilant and informed, we can make a significant impact on marine conservation efforts.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Our platform empowers individuals, organizations, and governments to report and track abnormal ocean activities, from pollution and illegal fishing to wildlife disturbances and environmental hazards. Together, we're building a safer, healthier future for our oceans.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="glass rounded-xl p-4 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gradient mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-6">What We Offer</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="glass rounded-xl p-6 hover:glow transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team Section */}
          <div className="glass rounded-2xl p-6 sm:p-8 mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">Our Team</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              SAMUDRASATHI is powered by a diverse team of marine biologists, environmental scientists, software engineers, and passionate ocean advocates from around the world.
            </p>
            <p className="text-gray-300 leading-relaxed">
              We collaborate with research institutions, conservation organizations, and government agencies to ensure our data is accurate, actionable, and impactful.
            </p>
          </div>

          {/* Call to Action */}
          <div className="glass rounded-2xl p-6 sm:p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Get Involved</h3>
            <p className="text-gray-300 mb-6">
              Join thousands of ocean watchers worldwide. Report incidents, stay informed, and help us protect our planet's most precious resource.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-semibold hover:scale-105 transition-transform duration-300"
            >
              Start Reporting
            </button>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
