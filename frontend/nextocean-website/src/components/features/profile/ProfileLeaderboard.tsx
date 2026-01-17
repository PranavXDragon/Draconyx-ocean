'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, User, Mail, MapPin, Globe, Save, Edit2, Trophy, 
  Medal, Award, Star, TrendingUp, Crown, ChevronUp, ChevronDown
} from 'lucide-react';
import { useLanguage, languages } from '@/contexts/LanguageContext';

interface ProfileLeaderboardProps {
  onClose: () => void;
}

interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  points: number;
  badges: number;
  reportsCount: number;
  trustScore: number;
  trend: 'up' | 'down' | 'same';
}

export default function ProfileLeaderboard({ onClose }: ProfileLeaderboardProps) {
  const { language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<'profile' | 'leaderboard'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: 'Marine Guardian',
    email: 'guardian@oceanwatch.com',
    phone: '+91 98765 43210',
    location: 'Mumbai, Maharashtra',
    bio: 'Passionate about protecting our oceans and marine life. Active coastal reporter.',
    avatar: '🌊',
    points: 2850,
    badges: 4,
    rank: 12,
    trustScore: 92,
  });

  const [editForm, setEditForm] = useState({ ...profileData });

  const leaderboardData: LeaderboardUser[] = [
    { rank: 1, name: 'Ocean Guardian', avatar: '👑', points: 15420, badges: 12, reportsCount: 156, trustScore: 98, trend: 'same' },
    { rank: 2, name: 'Wave Watcher', avatar: '🌊', points: 14850, badges: 11, reportsCount: 142, trustScore: 97, trend: 'up' },
    { rank: 3, name: 'Coral Protector', avatar: '🪸', points: 13920, badges: 10, reportsCount: 135, trustScore: 96, trend: 'down' },
    { rank: 4, name: 'Marine Sentinel', avatar: '🦈', points: 12450, badges: 10, reportsCount: 128, trustScore: 95, trend: 'up' },
    { rank: 5, name: 'Sea Guardian', avatar: '🐋', points: 11280, badges: 9, reportsCount: 115, trustScore: 94, trend: 'same' },
    { rank: 6, name: 'Coast Defender', avatar: '🏖️', points: 10500, badges: 9, reportsCount: 108, trustScore: 93, trend: 'up' },
    { rank: 7, name: 'Tide Tracker', avatar: '🌴', points: 9850, badges: 8, reportsCount: 98, trustScore: 92, trend: 'down' },
    { rank: 8, name: 'Bay Monitor', avatar: '⚓', points: 8920, badges: 8, reportsCount: 89, trustScore: 91, trend: 'up' },
    { rank: 9, name: 'Shore Keeper', avatar: '🐚', points: 7650, badges: 7, reportsCount: 76, trustScore: 90, trend: 'same' },
    { rank: 10, name: 'Reef Ranger', avatar: '🐠', points: 6850, badges: 7, reportsCount: 68, trustScore: 89, trend: 'up' },
    { rank: 11, name: 'Harbor Watch', avatar: '⛵', points: 5920, badges: 6, reportsCount: 59, trustScore: 88, trend: 'down' },
    { rank: 12, name: 'Marine Guardian', avatar: '🌊', points: 2850, badges: 4, reportsCount: 24, trustScore: 92, trend: 'up' },
  ];

  const handleSave = () => {
    setProfileData({ ...editForm });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({ ...profileData });
    setIsEditing(false);
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />;
    return <span className="text-gray-400 font-bold text-sm sm:text-base">#{rank}</span>;
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <ChevronUp className="w-4 h-4 text-green-400" />;
    if (trend === 'down') return <ChevronDown className="w-4 h-4 text-red-400" />;
    return <span className="text-gray-500">-</span>;
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[95]"
        onClick={onClose}
      />

      {/* Profile Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30 }}
        className="fixed right-0 top-0 bottom-0 w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] bg-gradient-to-br from-slate-900/95 to-blue-900/95 backdrop-blur-xl shadow-2xl z-[96] overflow-y-auto border-l border-white/10"
      >
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gradient">Profile & Leaderboard</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 hover:text-white" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all text-sm sm:text-base ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              My Profile
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all text-sm sm:text-base ${
                activeTab === 'leaderboard'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Leaderboard
            </button>
          </div>

          {/* Profile Tab */}
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Profile Card */}
                <div className="glass rounded-2xl p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0">
                        {profileData.avatar}
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-white">{profileData.name}</h3>
                        <p className="text-gray-400 text-sm">{profileData.email}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-400 font-semibold text-sm">{profileData.points} pts</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Trophy className="w-4 h-4 text-cyan-400" />
                            <span className="text-cyan-400 font-semibold text-sm">{profileData.badges} badges</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-5 h-5 text-cyan-400" />
                      </button>
                    )}
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-cyan-400">#{profileData.rank}</div>
                      <div className="text-xs sm:text-sm text-gray-400 mt-1">Global Rank</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-green-400">{profileData.trustScore}%</div>
                      <div className="text-xs sm:text-sm text-gray-400 mt-1">Trust Score</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-yellow-400">{profileData.points}</div>
                      <div className="text-xs sm:text-sm text-gray-400 mt-1">Total Points</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-purple-400">{profileData.badges}</div>
                      <div className="text-xs sm:text-sm text-gray-400 mt-1">Badges</div>
                    </div>
                  </div>

                  {/* Edit Form or Display */}
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-200 mb-2">Full Name</label>
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-200 mb-2">Email</label>
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-200 mb-2">Phone</label>
                          <input
                            type="tel"
                            value={editForm.phone}
                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-200 mb-2">Location</label>
                          <input
                            type="text"
                            value={editForm.location}
                            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">Bio</label>
                        <textarea
                          value={editForm.bio}
                          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white text-sm resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">Language Preference</label>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white text-sm"
                        >
                          {languages.map((lang) => (
                            <option key={lang.code} value={lang.code} className="bg-gray-900">
                              {lang.nativeName} ({lang.name})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button
                          onClick={handleSave}
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-white font-semibold hover:scale-105 transition-transform flex items-center justify-center gap-2 text-sm"
                        >
                          <Save className="w-4 h-4" />
                          Save Changes
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 font-semibold transition-all text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                        <Mail className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-400 mb-1">Email</p>
                          <p className="text-white text-sm break-all">{profileData.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                        <User className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-400 mb-1">Phone</p>
                          <p className="text-white text-sm">{profileData.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                        <MapPin className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-400 mb-1">Location</p>
                          <p className="text-white text-sm">{profileData.location}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                        <Globe className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-400 mb-1">Language</p>
                          <p className="text-white text-sm">
                            {languages.find(l => l.code === language)?.nativeName}
                          </p>
                        </div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg">
                        <p className="text-xs text-gray-400 mb-2">Bio</p>
                        <p className="text-white text-sm leading-relaxed">{profileData.bio}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Leaderboard Tab */}
            {activeTab === 'leaderboard' && (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {/* Leaderboard Header */}
                <div className="glass rounded-xl p-4 sm:p-6 mb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white">Global Leaderboard</h3>
                      <p className="text-sm text-gray-400">Top ocean guardians worldwide</p>
                    </div>
                  </div>
                </div>

                {/* Leaderboard Table */}
                <div className="glass rounded-xl overflow-hidden">
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white/5">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Rank</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Points</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Badges</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Reports</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Trust</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Trend</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {leaderboardData.map((user, index) => (
                          <motion.tr
                            key={user.rank}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`hover:bg-white/5 transition-colors ${
                              user.rank === profileData.rank ? 'bg-cyan-500/10 border-l-4 border-cyan-500' : ''
                            }`}
                          >
                            <td className="px-4 py-4">
                              <div className="flex items-center justify-center w-10">
                                {getRankIcon(user.rank)}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl flex-shrink-0">
                                  {user.avatar}
                                </div>
                                <span className="text-white font-medium">{user.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <span className="text-yellow-400 font-semibold">{user.points.toLocaleString()}</span>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <span className="text-purple-400 font-semibold">{user.badges}</span>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <span className="text-cyan-400 font-semibold">{user.reportsCount}</span>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <span className="text-green-400 font-semibold">{user.trustScore}%</span>
                            </td>
                            <td className="px-4 py-4 text-center">
                              {getTrendIcon(user.trend)}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden divide-y divide-white/5">
                    {leaderboardData.map((user, index) => (
                      <motion.div
                        key={user.rank}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 ${
                          user.rank === profileData.rank ? 'bg-cyan-500/10 border-l-4 border-cyan-500' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8">
                              {getRankIcon(user.rank)}
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl">
                              {user.avatar}
                            </div>
                            <div>
                              <p className="text-white font-semibold text-sm">{user.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-yellow-400 text-xs font-semibold">{user.points.toLocaleString()} pts</span>
                                {getTrendIcon(user.trend)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="bg-white/5 rounded p-2">
                            <p className="text-purple-400 font-semibold text-sm">{user.badges}</p>
                            <p className="text-[10px] text-gray-400">Badges</p>
                          </div>
                          <div className="bg-white/5 rounded p-2">
                            <p className="text-cyan-400 font-semibold text-sm">{user.reportsCount}</p>
                            <p className="text-[10px] text-gray-400">Reports</p>
                          </div>
                          <div className="bg-white/5 rounded p-2">
                            <p className="text-green-400 font-semibold text-sm">{user.trustScore}%</p>
                            <p className="text-[10px] text-gray-400">Trust</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}
