'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { IncidentReport } from '@/types';
import { gsap } from 'gsap';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface OceanMapProps {
  reports: IncidentReport[];
}

const severityColors: Record<string, string> = {
  low: '#2ECC40',
  medium: '#FF851B',
  high: '#FF4136',
  critical: '#85144b',
};

const severityRadius: Record<string, number> = {
  low: 50000,
  medium: 100000,
  high: 150000,
  critical: 200000,
};

export default function OceanMap({ reports }: OceanMapProps) {
  const [mounted, setMounted] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    if (mapRef.current) {
      gsap.from(mapRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 1,
        ease: 'power3.out'
      });
    }
  }, []);

  // Create custom icons based on severity
  const createCustomIcon = (severity: string) => {
    const color = severityColors[severity] || '#39CCCC';
    return L.divIcon({
      className: 'custom-icon',
      html: `
        <div style="
          width: 30px;
          height: 30px;
          background: ${color};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 0 20px ${color};
          animation: pulse 2s infinite;
        "></div>
        <style>
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.7; }
          }
        </style>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
  };

  if (!mounted) {
    return (
      <div className="w-full h-[600px] glass rounded-2xl flex items-center justify-center">
        <div className="text-cyan-400 text-xl">Loading map...</div>
      </div>
    );
  }

  return (
    <div ref={mapRef} className="w-full h-[600px] glass rounded-2xl overflow-hidden">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        className="w-full h-full"
        style={{ background: 'transparent' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {reports.map((report) => (
          <div key={report.id}>
            <Circle
              center={[report.latitude, report.longitude]}
              radius={severityRadius[report.severity]}
              pathOptions={{
                color: severityColors[report.severity],
                fillColor: severityColors[report.severity],
                fillOpacity: 0.2,
                weight: 2,
              }}
            />
            <Marker
              position={[report.latitude, report.longitude]}
              icon={createCustomIcon(report.severity)}
            >
              <Popup>
                <div className="text-gray-900 p-2">
                  <h3 className="font-bold text-lg mb-2">{report.type.toUpperCase()}</h3>
                  <p className="mb-2">{report.description}</p>
                  <div className="text-sm">
                    <div className="font-semibold">
                      Severity: <span style={{ color: severityColors[report.severity] }}>
                        {report.severity.toUpperCase()}
                      </span>
                    </div>
                    <div>Status: {report.status}</div>
                    <div>Time: {new Date(report.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          </div>
        ))}
      </MapContainer>
    </div>
  );
}
