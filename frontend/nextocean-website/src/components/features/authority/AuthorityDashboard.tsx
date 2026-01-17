'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, X, Eye, AlertTriangle, CheckCircle, XCircle, MapPin, 
  Clock, TrendingUp, TrendingDown, BarChart3, PieChart, Activity,
  Bell, Phone, ArrowUpCircle, Ban, Search, Filter, Download,
  Users, Waves, AlertOctagon, ShieldAlert, Radio
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { IncidentReport } from '@/types';

// Dynamic import for map to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);
const Circle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
);

interface AuthorityDashboardProps {
  onClose: () => void;
  allReports: IncidentReport[];
}

interface AnalyticsData {
  totalReports: number;
  verifiedReports: number;
  pendingReports: number;
  falseReports: number;
  criticalZones: number;
  todayReports: number;
  responseTime: string;
  accuracyRate: number;
}

interface CriticalZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  severity: 'high' | 'medium' | 'low';
  reportCount: number;
  radius: number;
}

export default function AuthorityDashboard({ onClose, allReports }: AuthorityDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authId, setAuthId] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [authError, setAuthError] = useState('');
  const [selectedReport, setSelectedReport] = useState<IncidentReport | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'verified' | 'critical'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMapView, setIsMapView] = useState(false);

  // Mock analytics data
  const [analytics] = useState<AnalyticsData>({
    totalReports: 247,
    verifiedReports: 189,
    pendingReports: 42,
    falseReports: 16,
    criticalZones: 8,
    todayReports: 23,
    responseTime: '12 min',
    accuracyRate: 94.2,
  });

  // Mock critical zones
  const [criticalZones] = useState<CriticalZone[]>([
    { id: 'cz1', name: 'Mumbai Harbor', lat: 18.9220, lng: 72.8347, severity: 'high', reportCount: 15, radius: 3000 },
    { id: 'cz2', name: 'Juhu Beach', lat: 19.0990, lng: 72.8265, severity: 'high', reportCount: 12, radius: 2500 },
    { id: 'cz3', name: 'Gateway Area', lat: 18.9217, lng: 72.8347, severity: 'medium', reportCount: 8, radius: 2000 },
    { id: 'cz4', name: 'Versova Beach', lat: 19.1355, lng: 72.8114, severity: 'medium', reportCount: 7, radius: 1800 },
    { id: 'cz5', name: 'Worli Sea Link', lat: 19.0297, lng: 72.8176, severity: 'low', reportCount: 4, radius: 1500 },
  ]);

  const handleAuth = () => {
    // Simple mock authentication - in production, this would be secure backend API
    if (authId === 'AUTHORITY001' && authPass === 'CoastGuard@2026') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid Authority ID or Password');
    }
  };

  const handleAction = (reportId: string, action: 'notify' | 'escalate' | 'false') => {
    const actionMessages = {
      notify: '🚢 Coast Guard notified successfully',
      escalate: '⚠️ Report escalated to emergency response team',
      false: '❌ Report marked as false and removed from critical list',
    };

    // In production, this would call backend API
    alert(actionMessages[action]);
  };

  const getFilteredReports = () => {
    let filtered = allReports;

    if (filterStatus !== 'all') {
      if (filterStatus === 'critical') {
        filtered = filtered.filter(r => r.type === 'oil-spill' || r.type === 'shark' || r.type === 'storm');
      } else {
        filtered = filtered.filter(r => r.status === filterStatus);
      }
    }

    if (searchQuery) {
      filtered = filtered.filter(r => 
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const getSeverityColor = (zone: CriticalZone) => {
    switch (zone.severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#3b82f6';
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Clock },
      verified: { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle },
      rejected: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: XCircle },
    };
    
    const badge = badges[status as keyof typeof badges] || badges.pending;
    const Icon = badge.icon;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${badge.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  if (!isAuthenticated) {
    return (
      <>
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[95]" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 flex items-center justify-center z-[96] p-4"
        >
          <div className="glass rounded-2xl p-8 max-w-md w-full border border-red-500/30">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Authority Access</h2>
                  <p className="text-sm text-gray-400">Restricted Area</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Authority ID</label>
                <input
                  type="text"
                  value={authId}
                  onChange={(e) => setAuthId(e.target.value)}
                  placeholder="Enter Authority ID"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  value={authPass}
                  onChange={(e) => setAuthPass(e.target.value)}
                  placeholder="Enter Password"
                  onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors"
                />
              </div>

              {authError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-red-400">{authError}</span>
                </motion.div>
              )}

              <button
                onClick={handleAuth}
                className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 rounded-lg font-bold text-white transition-all transform hover:scale-105"
              >
                Access Dashboard
              </button>

              <div className="mt-6 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-xs text-blue-400 text-center">
                  🔐 Demo Credentials: <br />
                  <span className="font-mono font-semibold">ID: AUTHORITY001</span> <br />
                  <span className="font-mono font-semibold">Pass: CoastGuard@2026</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]" onClick={onClose} />
      
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30 }}
        className="fixed inset-0 bg-gradient-to-br from-red-900/95 to-orange-900/95 backdrop-blur-xl shadow-2xl z-[91] overflow-y-auto"
      >
        <div className="p-4 lg:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Authority Dashboard</h2>
                <p className="text-sm text-gray-300">Government Command Center</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMapView(!isMapView)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                <span className="hidden sm:inline">{isMapView ? 'Table View' : 'Map View'}</span>
              </button>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Analytics Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <p className="text-xs text-gray-400">Total</p>
              </div>
              <p className="text-2xl font-bold text-white">{analytics.totalReports}</p>
              <p className="text-xs text-gray-500 mt-1">All Reports</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-xl p-4 border border-green-500/30"
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <p className="text-xs text-gray-400">Verified</p>
              </div>
              <p className="text-2xl font-bold text-green-400">{analytics.verifiedReports}</p>
              <p className="text-xs text-gray-500 mt-1">Confirmed</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-xl p-4 border border-yellow-500/30"
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-yellow-400" />
                <p className="text-xs text-gray-400">Pending</p>
              </div>
              <p className="text-2xl font-bold text-yellow-400">{analytics.pendingReports}</p>
              <p className="text-xs text-gray-500 mt-1">Processing</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-xl p-4 border border-red-500/30"
            >
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-red-400" />
                <p className="text-xs text-gray-400">False</p>
              </div>
              <p className="text-2xl font-bold text-red-400">{analytics.falseReports}</p>
              <p className="text-xs text-gray-500 mt-1">Rejected</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-xl p-4 border border-orange-500/30"
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertOctagon className="w-4 h-4 text-orange-400" />
                <p className="text-xs text-gray-400">Critical</p>
              </div>
              <p className="text-2xl font-bold text-orange-400">{criticalZones.length}</p>
              <p className="text-xs text-gray-500 mt-1">Hot Zones</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass rounded-xl p-4 border border-cyan-500/30"
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <p className="text-xs text-gray-400">Today</p>
              </div>
              <p className="text-2xl font-bold text-cyan-400">{analytics.todayReports}</p>
              <p className="text-xs text-gray-500 mt-1">New Reports</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="glass rounded-xl p-4 border border-purple-500/30"
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <p className="text-xs text-gray-400">Avg Time</p>
              </div>
              <p className="text-2xl font-bold text-purple-400">{analytics.responseTime}</p>
              <p className="text-xs text-gray-500 mt-1">Response</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="glass rounded-xl p-4 border border-green-500/30"
            >
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-green-400" />
                <p className="text-xs text-gray-400">Accuracy</p>
              </div>
              <p className="text-2xl font-bold text-green-400">{analytics.accuracyRate}%</p>
              <p className="text-xs text-gray-500 mt-1">AI Score</p>
            </motion.div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Report ID, Location, or Type..."
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                  filterStatus === 'all' ? 'bg-red-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                  filterStatus === 'pending' ? 'bg-yellow-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilterStatus('verified')}
                className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                  filterStatus === 'verified' ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                Verified
              </button>
              <button
                onClick={() => setFilterStatus('critical')}
                className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                  filterStatus === 'critical' ? 'bg-orange-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                Critical
              </button>
            </div>
          </div>

          {/* Map or Table View */}
          {isMapView ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-2xl p-4 border border-white/10 mb-6"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-400" />
                Critical Zones Map
              </h3>
              <div className="h-[500px] rounded-xl overflow-hidden">
                {typeof window !== 'undefined' && (
                  <MapContainer
                    center={[19.0760, 72.8777]}
                    zoom={11}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    {criticalZones.map(zone => (
                      <Circle
                        key={zone.id}
                        center={[zone.lat, zone.lng]}
                        radius={zone.radius}
                        pathOptions={{
                          color: getSeverityColor(zone),
                          fillColor: getSeverityColor(zone),
                          fillOpacity: 0.3,
                        }}
                      >
                        <Popup>
                          <div className="p-2">
                            <p className="font-bold text-gray-900">{zone.name}</p>
                            <p className="text-sm text-gray-600">Severity: {zone.severity}</p>
                            <p className="text-sm text-gray-600">Reports: {zone.reportCount}</p>
                          </div>
                        </Popup>
                      </Circle>
                    ))}
                  </MapContainer>
                )}
              </div>

              {/* Critical Zones Legend */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {criticalZones.map(zone => (
                  <div key={zone.id} className="glass rounded-lg p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: getSeverityColor(zone) }}
                      />
                      <p className="text-sm font-semibold text-white">{zone.name}</p>
                    </div>
                    <p className="text-xs text-gray-400">{zone.reportCount} reports</p>
                    <p className="text-xs text-gray-500 capitalize">{zone.severity} risk</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-2xl p-4 border border-white/10 mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-red-400" />
                  Live Reports Table
                </h3>
                <button className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2 text-sm">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Report ID</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Location</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Time</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredReports().slice(0, 10).map((report, index) => (
                      <motion.tr
                        key={report.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <span className="text-sm font-mono text-cyan-400">{report.id}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-white capitalize">{report.type.replace('-', ' ')}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-400">{report.location}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-400">{report.timestamp}</span>
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(report.status)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleAction(report.id, 'notify')}
                              className="p-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-all group"
                              title="Notify Coast Guard"
                            >
                              <Phone className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                            </button>
                            <button
                              onClick={() => handleAction(report.id, 'escalate')}
                              className="p-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-lg transition-all group"
                              title="Escalate"
                            >
                              <ArrowUpCircle className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
                            </button>
                            <button
                              onClick={() => handleAction(report.id, 'false')}
                              className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg transition-all group"
                              title="Mark as False"
                            >
                              <Ban className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
                            </button>
                            <button
                              onClick={() => setSelectedReport(report)}
                              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all group"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Predictive Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Predictive Forecast
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white">High Risk: Mumbai Harbor</span>
                    <span className="text-xs text-red-400 font-bold">87% Probability</span>
                  </div>
                  <p className="text-xs text-gray-400">Expected in next 6-12 hours based on weather patterns and historical data</p>
                </div>
                <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white">Medium Risk: Juhu Beach</span>
                    <span className="text-xs text-orange-400 font-bold">64% Probability</span>
                  </div>
                  <p className="text-xs text-gray-400">Possible incidents due to increased tourist activity</p>
                </div>
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white">Moderate: Worli Sea Link</span>
                    <span className="text-xs text-yellow-400 font-bold">42% Probability</span>
                  </div>
                  <p className="text-xs text-gray-400">Monitor for next 24 hours - weather dependent</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-400" />
                Report Distribution
              </h3>
              <div className="space-y-3">
                {[
                  { type: 'Oil Spill', count: 45, color: 'bg-red-500', percentage: 18 },
                  { type: 'Debris', count: 82, color: 'bg-orange-500', percentage: 33 },
                  { type: 'Marine Life', count: 38, color: 'bg-yellow-500', percentage: 15 },
                  { type: 'Weather', count: 54, color: 'bg-blue-500', percentage: 22 },
                  { type: 'Others', count: 28, color: 'bg-purple-500', percentage: 12 },
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-300">{item.type}</span>
                      <span className="text-sm font-semibold text-white">{item.count}</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                        className={`h-full ${item.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Report Details Modal */}
      <AnimatePresence>
        {selectedReport && (
          <>
            <div 
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[95]" 
              onClick={() => setSelectedReport(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center z-[96] p-4"
            >
              <div className="glass rounded-2xl p-6 max-w-2xl w-full border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Report Details</h3>
                  <button onClick={() => setSelectedReport(null)} className="p-2 hover:bg-white/10 rounded-lg">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400">Report ID</label>
                    <p className="text-white font-mono">{selectedReport.id}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Type</label>
                    <p className="text-white capitalize">{selectedReport.type.replace('-', ' ')}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Location</label>
                    <p className="text-white">{selectedReport.location}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Timestamp</label>
                    <p className="text-white">{selectedReport.timestamp}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedReport.status)}</div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => {
                        handleAction(selectedReport.id, 'notify');
                        setSelectedReport(null);
                      }}
                      className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Notify Coast Guard
                    </button>
                    <button
                      onClick={() => {
                        handleAction(selectedReport.id, 'escalate');
                        setSelectedReport(null);
                      }}
                      className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      <ArrowUpCircle className="w-4 h-4" />
                      Escalate
                    </button>
                    <button
                      onClick={() => {
                        handleAction(selectedReport.id, 'false');
                        setSelectedReport(null);
                      }}
                      className="flex-1 py-3 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      <Ban className="w-4 h-4" />
                      Mark False
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
