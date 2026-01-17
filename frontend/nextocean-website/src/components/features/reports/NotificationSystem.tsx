'use client';

import { useEffect, useState } from 'react';
import { IncidentReport } from '@/types';
import { AlertCircle, X } from 'lucide-react';
import { gsap } from 'gsap';

interface NotificationSystemProps {
  reports: IncidentReport[];
}

interface Notification {
  id: string;
  report: IncidentReport;
  timestamp: number;
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

export default function NotificationSystem({ reports }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [previousReportCount, setPreviousReportCount] = useState(reports.length);

  useEffect(() => {
    // Check for new reports
    if (reports.length > previousReportCount) {
      const newReports = reports.slice(0, reports.length - previousReportCount);
      
      newReports.forEach(report => {
        const notification: Notification = {
          id: `${report.id}-${Date.now()}`,
          report,
          timestamp: Date.now(),
        };

        setNotifications(prev => [...prev, notification]);

        // Auto-remove notification after 5 seconds
        setTimeout(() => {
          removeNotification(notification.id);
        }, 5000);
      });
    }

    setPreviousReportCount(reports.length);
  }, [reports, previousReportCount]);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  useEffect(() => {
    // Animate in new notifications
    notifications.forEach((notification, index) => {
      const element = document.getElementById(`notification-${notification.id}`);
      if (element) {
        gsap.fromTo(
          element,
          { x: 400, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
        );
      }
    });
  }, [notifications]);

  return (
    <div className="fixed top-20 right-4 z-[100] space-y-3 max-w-md">
      {notifications.map((notification) => {
        const { report } = notification;
        const colorGradient = severityColors[report.severity] || severityColors.low;
        const icon = typeIcons[report.type] || typeIcons.other;

        return (
          <div
            key={notification.id}
            id={`notification-${notification.id}`}
            className="glass rounded-lg p-4 shadow-2xl border border-white/10 backdrop-blur-xl"
          >
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${colorGradient} flex items-center justify-center text-2xl`}>
                {icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="text-white font-semibold text-sm">New {report.type} Alert</h4>
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <p className="text-gray-300 text-xs mb-2 line-clamp-2">
                  {report.description}
                </p>
                
                <div className="flex items-center gap-2 text-xs">
                  <span className={`px-2 py-0.5 rounded-full bg-gradient-to-r ${colorGradient} text-white font-medium`}>
                    {report.severity.toUpperCase()}
                  </span>
                  <span className="text-gray-400">
                    {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
