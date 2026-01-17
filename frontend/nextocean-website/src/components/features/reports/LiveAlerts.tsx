'use client';

import { useEffect, useRef } from 'react';
import { IncidentReport } from '@/types';
import { AlertCircle, Clock, TrendingUp } from 'lucide-react';
import { gsap } from 'gsap';

interface LiveAlertsProps {
  reports: IncidentReport[];
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

export default function LiveAlerts({ reports }: LiveAlertsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.from(containerRef.current.children, {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out'
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
    <div>
      <div className="flex items-center gap-4 mb-8">
        <AlertCircle className="w-10 h-10 text-red-500 animate-pulse" />
        <div>
          <h2 className="text-4xl font-bold text-gradient">Live Alerts</h2>
          <p className="text-gray-400">Real-time ocean incident updates</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="glass rounded-xl p-4">
          <div className="text-sm text-gray-400 mb-1">Total Active</div>
          <div className="text-3xl font-bold text-white">{reports.length}</div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="text-sm text-gray-400 mb-1">Critical</div>
          <div className="text-3xl font-bold text-purple-500">
            {reports.filter(r => r.severity === 'critical').length}
          </div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="text-sm text-gray-400 mb-1">High Priority</div>
          <div className="text-3xl font-bold text-red-500">
            {reports.filter(r => r.severity === 'high').length}
          </div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="text-sm text-gray-400 mb-1">Under Investigation</div>
          <div className="text-3xl font-bold text-yellow-500">
            {reports.filter(r => r.status === 'investigating').length}
          </div>
        </div>
      </div>

      {/* Alert Cards */}
      <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedReports.map((report) => (
          <div
            key={report.id}
            className="glass rounded-xl p-6 hover:scale-105 transition-all duration-300 hover:glow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{typeIcons[report.type]}</span>
                <div>
                  <h3 className="font-bold text-lg capitalize">{report.type.replace('-', ' ')}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-3 h-3" />
                    {getTimeAgo(report.timestamp)}
                  </div>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${
                  severityColors[report.severity]
                } text-white`}
              >
                {report.severity.toUpperCase()}
              </span>
            </div>

            <p className="text-gray-300 mb-4 line-clamp-2">{report.description}</p>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Location:</span>
                <span className="text-cyan-400 font-mono">
                  {report.latitude.toFixed(2)}, {report.longitude.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className={`font-semibold ${
                  report.status === 'active' ? 'text-red-400' :
                  report.status === 'investigating' ? 'text-yellow-400' :
                  'text-green-400'
                }`}>
                  {report.status.toUpperCase()}
                </span>
              </div>
            </div>

            <button className="mt-4 w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors">
              View Details
            </button>
          </div>
        ))}
      </div>

      {reports.length === 0 && (
        <div className="text-center py-20 glass rounded-2xl">
          <TrendingUp className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">All Clear!</h3>
          <p className="text-gray-400">No active incidents reported at this time.</p>
        </div>
      )}
    </div>
  );
}
