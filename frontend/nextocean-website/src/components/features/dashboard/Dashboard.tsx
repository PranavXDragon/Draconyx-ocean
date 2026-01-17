'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Award, TrendingUp, Shield, Bell, Search, 
  MapPin, Clock, CheckCircle, AlertCircle, XCircle,
  Star, Trophy, Target, Eye, X
} from 'lucide-react';
import { IncidentReport } from '@/types';
import ProfileLeaderboard from '../profile/ProfileLeaderboard';

interface UserData {
  name: string;
  email: string;
  avatar: string;
  points: number;
  maxPoints: number;
  reputation: number;
  trustScore: number;
  currentBadge: string;
  reportsCount: number;
  verifiedReports: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

interface Notification {
  id: string;
  type: 'alert' | 'badge' | 'report';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface DashboardProps {
  onClose: () => void;
  userReports: IncidentReport[];
}

export default function Dashboard({ onClose, userReports }: DashboardProps) {
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState<IncidentReport | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileLeaderboard, setShowProfileLeaderboard] = useState(false);

  const [userData] = useState<UserData>({
    name: 'Marine Guardian',
    email: 'guardian@oceanwatch.com',
    avatar: '🌊',
    points: 2850,
    maxPoints: 5000,
    reputation: 87,
    trustScore: 92,
    currentBadge: 'Ocean Protector',
    reportsCount: 24,
    verifiedReports: 21,
  });

  const [badges] = useState<Badge[]>([
    {
      id: '1',
      name: 'First Reporter',
      description: 'Submitted your first report',
      icon: '🎯',
      unlocked: true,
      unlockedAt: '2025-12-15',
    },
    {
      id: '2',
      name: 'Ocean Guardian',
      description: 'Submitted 10 verified reports',
      icon: '🛡️',
      unlocked: true,
      unlockedAt: '2026-01-05',
    },
    {
      id: '3',
      name: 'Marine Protector',
      description: 'Earned 2000+ points',
      icon: '⭐',
      unlocked: true,
      unlockedAt: '2026-01-10',
    },
    {
      id: '4',
      name: 'Trusted Contributor',
      description: 'Achieved 90% trust score',
      icon: '🏆',
      unlocked: true,
      unlockedAt: '2026-01-15',
    },
    {
      id: '5',
      name: 'Elite Watcher',
      description: 'Submit 50 verified reports',
      icon: '👁️',
      unlocked: false,
    },
  ]);

  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'alert',
      title: 'New Alert Nearby',
      message: 'Oil spill reported 2.5 km from your location',
      time: '5m ago',
      read: false,
    },
    {
      id: '2',
      type: 'badge',
      title: 'New Badge Unlocked!',
      message: 'You earned the "Trusted Contributor" badge',
      time: '2h ago',
      read: false,
    },
    {
      id: '3',
      type: 'report',
      title: 'Report Verified',
      message: 'Your report #OCN-12345 has been verified',
      time: '5h ago',
      read: true,
    },
  ]);

  const handleSearchReport = () => {
    if (!searchId.trim()) return;
    
    // Mock search - in real app, this would query the backend
    const found = userReports.find(report => 
      report.id.toLowerCase().includes(searchId.toLowerCase())
    );
    
    setSearchResult(found || null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'from-green-500 to-emerald-600';
      case 'pending': return 'from-yellow-500 to-orange-600';
      case 'rejected': return 'from-red-500 to-rose-600';
      default: return 'from-blue-500 to-cyan-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
        onClick={onClose}
      />

      {/* Dashboard Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30 }}
        className="fixed right-0 top-0 bottom-0 w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] bg-gradient-to-br from-slate-900/95 to-blue-900/95 backdrop-blur-xl shadow-2xl z-[91] overflow-y-auto border-l border-white/10"
      >
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gradient">My Dashboard</h2>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 hover:text-white" />
              </button>
            </div>
          </div>

          {/* Notifications Panel */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="glass rounded-xl p-4 space-y-3">
                  <h3 className="font-semibold text-white mb-3">Notifications</h3>
                  {notifications.map(notif => (
                    <div
                      key={notif.id}
                      className={`p-3 rounded-lg transition-all ${
                        notif.read ? 'bg-white/5' : 'bg-cyan-500/10 border border-cyan-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-white font-medium text-sm">{notif.title}</p>
                          <p className="text-gray-400 text-xs mt-1">{notif.message}</p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">{notif.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Welcome Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-4 sm:p-6 mb-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0">
                {userData.avatar}
              </div>
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{userData.name}</h3>
                <p className="text-gray-400 text-sm mb-2">{userData.email}</p>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-semibold text-sm">{userData.currentBadge}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowProfileLeaderboard(true)}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>View Profile</span>
                </button>
                <div className="flex items-center gap-2 text-cyan-400">
                  <Target className="w-4 h-4" />
                  <span className="text-sm font-semibold">{userData.reportsCount} Reports</span>
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-semibold">{userData.verifiedReports} Verified</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* Points & Reputation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-xl p-4 sm:p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-yellow-400" />
                <h4 className="text-white font-semibold text-sm sm:text-base">Points</h4>
              </div>
              <div className="mb-2">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-2xl sm:text-3xl font-bold text-cyan-400">{userData.points}</span>
                  <span className="text-xs sm:text-sm text-gray-400">/ {userData.maxPoints}</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(userData.points / userData.maxPoints) * 100}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {userData.maxPoints - userData.points} points to next level
              </p>
            </motion.div>

            {/* Reputation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-xl p-4 sm:p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <h4 className="text-white font-semibold text-sm sm:text-base">Reputation</h4>
              </div>
              <div className="mb-2">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-2xl sm:text-3xl font-bold text-green-400">{userData.reputation}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${userData.reputation}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">Based on verified reports</p>
            </motion.div>

            {/* Trust Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-xl p-4 sm:p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-blue-400" />
                <h4 className="text-white font-semibold text-sm sm:text-base">Trust Score</h4>
              </div>
              <div className="mb-2">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-2xl sm:text-3xl font-bold text-blue-400">{userData.trustScore}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${userData.trustScore}%` }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="h-full bg-gradient-to-r from-blue-400 to-cyan-500"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">Community trust rating</p>
            </motion.div>
          </div>

          {/* Report Tracking */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-xl p-4 sm:p-6 mb-6"
          >
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-cyan-400" />
              Track Report by ID
            </h3>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchReport()}
                placeholder="Enter Report ID (e.g., OCN-123...)"
                className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white text-sm"
              />
              <button
                onClick={handleSearchReport}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-white font-semibold hover:scale-105 transition-transform text-sm whitespace-nowrap"
              >
                Search
              </button>
            </div>

            {/* Search Result */}
            <AnimatePresence>
              {searchResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 bg-white/5 rounded-lg border border-cyan-500/30"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-cyan-400 font-mono text-xs sm:text-sm font-semibold">{searchResult.id}</span>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r ${getStatusColor(searchResult.status)} text-white text-xs`}>
                      {getStatusIcon(searchResult.status)}
                      <span>{searchResult.status}</span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{searchResult.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {searchResult.latitude.toFixed(4)}, {searchResult.longitude.toFixed(4)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(searchResult.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              )}
              {searchId && !searchResult && searchResult !== null && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
                >
                  No report found with ID: {searchId}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* My Reports */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-xl p-4 sm:p-6 mb-6"
          >
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4">My Reports</h3>
            <div className="space-y-3">
              {userReports.slice(0, 5).map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-3 sm:p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{report.type === 'pollution' ? '🛢️' : report.type === 'wildlife' ? '🐋' : '🗑️'}</span>
                        <span className="text-white font-semibold text-sm truncate">{report.type.toUpperCase()}</span>
                      </div>
                      <p className="text-gray-300 text-xs sm:text-sm mb-2 line-clamp-2">{report.description}</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {report.latitude.toFixed(2)}, {report.longitude.toFixed(2)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(report.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r ${getStatusColor(report.status)} text-white text-xs font-medium whitespace-nowrap self-start sm:self-center`}>
                      {getStatusIcon(report.status)}
                      <span>{report.status}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Badge Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-xl p-4 sm:p-6"
          >
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Badge Gallery
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
              {badges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className={`p-3 sm:p-4 rounded-xl text-center transition-all ${
                    badge.unlocked
                      ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 hover:scale-105 cursor-pointer'
                      : 'bg-white/5 border border-white/10 opacity-50'
                  }`}
                  title={badge.description}
                >
                  <div className="text-3xl sm:text-4xl mb-2">{badge.icon}</div>
                  <p className="text-white font-semibold text-xs sm:text-sm mb-1">{badge.name}</p>
                  {badge.unlocked && badge.unlockedAt && (
                    <p className="text-[10px] sm:text-xs text-gray-400">
                      {new Date(badge.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                  {!badge.unlocked && (
                    <p className="text-[10px] sm:text-xs text-gray-500">Locked</p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Profile/Leaderboard Modal */}
      <AnimatePresence>
        {showProfileLeaderboard && (
          <ProfileLeaderboard onClose={() => setShowProfileLeaderboard(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
