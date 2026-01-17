'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, X, Shield, MapPin, Clock, Phone, Radio,
  Navigation as NavigationIcon, AlertOctagon, Ban, Info
} from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic import for map to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Circle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface EmergencyBroadcastProps {
  onClose: () => void;
}

interface AffectedArea {
  id: string;
  name: string;
  lat: number;
  lng: number;
  severity: 'extreme' | 'high' | 'medium';
  restriction: string;
  radius: number;
  lastUpdate: string;
}

export default function EmergencyBroadcast({ onClose }: EmergencyBroadcastProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authId, setAuthId] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [authError, setAuthError] = useState('');

  const [affectedAreas] = useState<AffectedArea[]>([
    {
      id: 'ea1',
      name: 'Mumbai Coastal Zone',
      lat: 19.0760,
      lng: 72.8777,
      severity: 'extreme',
      restriction: 'NO ENTRY - Cyclone Warning',
      radius: 5000,
      lastUpdate: '2 hours ago'
    },
    {
      id: 'ea2',
      name: 'Juhu Beach Area',
      lat: 19.0990,
      lng: 72.8265,
      severity: 'extreme',
      restriction: 'RESTRICTED - High Tide Alert',
      radius: 3000,
      lastUpdate: '3 hours ago'
    },
    {
      id: 'ea3',
      name: 'Gateway of India',
      lat: 18.9220,
      lng: 72.8347,
      severity: 'high',
      restriction: 'LIMITED ACCESS - Storm Surge',
      radius: 2500,
      lastUpdate: '1 hour ago'
    },
    {
      id: 'ea4',
      name: 'Worli Sea Face',
      lat: 19.0144,
      lng: 72.8160,
      severity: 'high',
      restriction: 'CAUTION - Strong Currents',
      radius: 2000,
      lastUpdate: '4 hours ago'
    },
    {
      id: 'ea5',
      name: 'Versova Beach',
      lat: 19.1355,
      lng: 72.8114,
      severity: 'medium',
      restriction: 'ADVISORY - Monitor Conditions',
      radius: 1500,
      lastUpdate: '5 hours ago'
    },
  ]);

  const handleAuth = () => {
    // Simple mock authentication - trim whitespace
    const trimmedId = authId.trim();
    const trimmedPass = authPass.trim();
    
    if (trimmedId === 'EMERGENCY001' && trimmedPass === 'Broadcast@2026') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid Emergency ID or Password');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'extreme': return '#dc2626';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getSeverityBadge = (severity: string) => {
    const colors = {
      extreme: 'bg-red-500/20 text-red-400 border-red-500/30',
      high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      medium: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    };
    
    return colors[severity as keyof typeof colors] || colors.medium;
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
          <div className="glass rounded-2xl p-8 max-w-md w-full border border-orange-500/30">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <Radio className="w-6 h-6 text-white animate-pulse" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Emergency Broadcast</h2>
                  <p className="text-sm text-gray-400">Authorized Personnel Only</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Emergency ID</label>
                <input
                  type="text"
                  value={authId}
                  onChange={(e) => setAuthId(e.target.value)}
                  placeholder="Enter Emergency ID"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-colors"
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
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-colors"
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
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 rounded-lg font-bold text-white transition-all transform hover:scale-105"
              >
                Access Emergency Broadcast
              </button>

              <div className="mt-6 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <p className="text-xs text-orange-400 text-center">
                  🔐 Demo Credentials: <br />
                  <span className="font-mono font-semibold">ID: EMERGENCY001</span> <br />
                  <span className="font-mono font-semibold">Pass: Broadcast@2026</span>
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
        initial={{ y: '-100%' }}
        animate={{ y: 0 }}
        exit={{ y: '-100%' }}
        transition={{ type: 'spring', damping: 30 }}
        className="fixed inset-0 bg-gradient-to-br from-red-900/95 to-orange-900/95 backdrop-blur-xl shadow-2xl z-[91] overflow-y-auto"
      >
        <div className="p-4 lg:p-6">
          {/* Emergency Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-6 border-4 border-red-400 shadow-2xl"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center animate-pulse">
                  <AlertTriangle className="w-10 h-10 text-red-600" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">⚠️ EMERGENCY BROADCAST</h1>
                  <p className="text-lg text-white/90 font-semibold">SEA ENTRY RESTRICTED - IMMEDIATE ACTION REQUIRED</p>
                  <p className="text-sm text-white/80 mt-1">Updated: {new Date().toLocaleString()}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </motion.div>

          {/* Government Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6 mb-6 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-bold text-white">Government Instructions</h2>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <h3 className="text-lg font-bold text-red-400 mb-2 flex items-center gap-2">
                  <Ban className="w-5 h-5" />
                  IMMEDIATE RESTRICTIONS
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span>All coastal activities are PROHIBITED until further notice</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span>Fishing vessels must return to harbor immediately</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span>Beach access is CLOSED - violators will face legal action</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span>Swimming, water sports, and recreational activities are BANNED</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <h3 className="text-lg font-bold text-orange-400 mb-2 flex items-center gap-2">
                  <AlertOctagon className="w-5 h-5" />
                  SAFETY INSTRUCTIONS
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>Stay at least 500 meters away from the coastline</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>Secure all boats and marine equipment properly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>Monitor weather updates and government advisories continuously</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>Evacuate low-lying coastal areas if instructed by authorities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>Keep emergency supplies ready: water, food, first aid, flashlights</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h3 className="text-lg font-bold text-blue-400 mb-2 flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  EMERGENCY CONTACTS
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-300">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-blue-400">Coast Guard:</span>
                    <span className="font-mono">1554</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-blue-400">Emergency:</span>
                    <span className="font-mono">108</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-blue-400">Police:</span>
                    <span className="font-mono">100</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-blue-400">Disaster Mgmt:</span>
                    <span className="font-mono">1070</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Affected Areas Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6 mb-6 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-red-400" />
              <h2 className="text-2xl font-bold text-white">Affected Areas Map</h2>
            </div>
            
            <div className="h-[400px] rounded-xl overflow-hidden mb-4">
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
                  {affectedAreas.map(area => (
                    <Circle
                      key={area.id}
                      center={[area.lat, area.lng]}
                      radius={area.radius}
                      pathOptions={{
                        color: getSeverityColor(area.severity),
                        fillColor: getSeverityColor(area.severity),
                        fillOpacity: 0.4,
                        weight: 3,
                      }}
                    >
                      <Popup>
                        <div className="p-2">
                          <p className="font-bold text-gray-900">{area.name}</p>
                          <p className="text-sm text-red-600 font-semibold">{area.restriction}</p>
                          <p className="text-xs text-gray-600 mt-1">Updated: {area.lastUpdate}</p>
                        </div>
                      </Popup>
                    </Circle>
                  ))}
                </MapContainer>
              )}
            </div>
          </motion.div>

          {/* Affected Areas List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-orange-400" />
              <h2 className="text-2xl font-bold text-white">Restricted Zones</h2>
            </div>
            
            <div className="space-y-3">
              {affectedAreas.map((area, index) => (
                <motion.div
                  key={area.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-white">{area.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityBadge(area.severity)} uppercase`}>
                          {area.severity}
                        </span>
                      </div>
                      <p className="text-red-400 font-semibold mb-2">{area.restriction}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>Updated {area.lastUpdate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <NavigationIcon className="w-4 h-4" />
                          <span>Radius: {(area.radius / 1000).toFixed(1)} km</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
