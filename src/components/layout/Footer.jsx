import React from 'react';
import { Radio, Satellite } from 'lucide-react';
import { MISSION_META } from '../../data/missionData';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="flex items-center gap-4">
        <span className="pulse-dot green" />
        <span>BACKEND: CONNECTED</span>
        <span style={{ color: 'var(--border)' }}>|</span>
        <span>API: http://localhost:8000</span>
      </div>
      <div className="flex items-center gap-2">
        <Satellite size={11} style={{ color: 'var(--orange)' }} />
        <span style={{ color: 'var(--orange)' }}>ISRO LSPS v1.0.0</span>
        <span style={{ color: 'var(--border)' }}>|</span>
        <span>Bharatiya Antariksh Hackathon 2024</span>
      </div>
      <div>
        <span>LAT: {MISSION_META.roverPosition.lat}°</span>
        <span style={{ margin: '0 6px', color: 'var(--border)' }}>|</span>
        <span>LON: {MISSION_META.roverPosition.lon}°</span>
      </div>
    </footer>
  );
}
