'use client';

import { useEffect, useRef } from 'react';
import { IncidentReport } from '@/types';
import { AlertCircle, Clock, X, TrendingUp } from 'lucide-react';
import { gsap } from 'gsap';

interface AlertsPanelProps {
  reports: IncidentReport[];
  onClose: () => void;
}

const severityColors: Record<string, string> = {
  low: 'from-green-500 to-emerald-600',
  medium: 'from-orange-500 to-amber-600',
  high: 'from-red-500 to-rose-600',
  critical: 'from-purple-500 to-pink-600',
};

const typeIcons: Record<string, string> = {
  pollution: '🛢️',
  wildlife: '🐋',
  debris: '🗑️',
  'illegal-activity': '⚠️',
  weather: '🌊',
  other: '📍',
};

export default function AlertsPanel({ reports, onClose }: AlertsPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { x: 500, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
      );
    }
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      gsap.from(containerRef.current.children, {
        y: 30,
        opacity: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.2
      });
    }
  }, [reports]);

  const sortedReports = [...reports].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const getTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
        onClick={onClose}
      />

      {/* Panel */}
      <div 
        ref={panelRef}
        className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-gradient-to-br from-slate-900/95 to-blue-900/95 backdrop-blur-xl shadow-2xl z-[91] overflow-y-auto border-l border-white/10"
      >
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <AlertCircle className="w-10 h-10 text-red-500 animate-pulse" />
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gradient">Live Alerts</h2>
                <p className="text-gray-400 text-sm sm:text-base">Real-time ocean incident updates</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <div className="glass rounded-xl p-4">
              <div className="text-xs sm:text-sm text-gray-400 mb-1">Total Active</div>
              <div className="text-2xl sm:text-3xl font-bold text-white">{reports.length}</div>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="text-xs sm:text-sm text-gray-400 mb-1">Critical</div>
              <div className="text-2xl sm:text-3xl font-bold text-purple-500">
                {reports.filter(r => r.severity === 'critical').length}
              </div>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="text-xs sm:text-sm text-gray-400 mb-1">High Priority</div>
              <div className="text-2xl sm:text-3xl font-bold text-red-500">
                {reports.filter(r => r.severity === 'high').length}
              </div>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="text-xs sm:text-sm text-gray-400 mb-1">Last Hour</div>
              <div className="text-2xl sm:text-3xl font-bold text-cyan-400">
                {reports.filter(r => 
                  Date.now() - new Date(r.timestamp).getTime() < 3600000
                ).length}
              </div>
            </div>
          </div>

          {/* Alert Cards */}
          <div className="space-y-4" ref={containerRef}>
            {sortedReports.map((report) => {
              const colorGradient = severityColors[report.severity] || severityColors.low;
              const icon = typeIcons[report.type] || typeIcons.other;

              return (
                <div
                  key={report.id}
                  className="glass rounded-xl p-6 hover:glow transition-all duration-300 border border-white/5"
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${colorGradient} flex items-center justify-center text-3xl shadow-lg`}>
                      {icon}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-white capitalize mb-1">
                            {report.type.replace('-', ' ')}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>{getTimeAgo(report.timestamp)}</span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full bg-gradient-to-r ${colorGradient} text-white text-xs font-bold shadow-lg`}>
                          {report.severity.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-gray-300 mb-4 leading-relaxed">
                        {report.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-cyan-400">
                          <TrendingUp className="w-4 h-4" />
                          <span className="font-mono">
                            {report.latitude.toFixed(4)}°N, {report.longitude.toFixed(4)}°W
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          report.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {reports.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No active alerts at this time</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
