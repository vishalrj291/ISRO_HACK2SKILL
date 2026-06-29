import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Download, ChevronDown, MapPin, Menu, Clock } from 'lucide-react';
import { MISSION_META } from '../../data/missionData';

/* ── Route → title map ──────────────────────────────────── */
const PAGE_TITLES = {
  '/':               { title: 'Mission Dashboard',      sub: 'POLARIS · AI-BASED LUNAR MISSION CONTROL' },
  '/terrain':        { title: 'Terrain Analysis',       sub: 'DEM · SLOPE · TRI · LANDING SITES' },
  '/ice-detection':  { title: 'Ice Detection',          sub: 'RADAR · PSR · TEMPERATURE · ILLUMINATION' },
  '/hazard':         { title: 'Hazard Assessment',      sub: 'SLOPE RISK · SHADOW ZONES · TRI CLASSIFICATION' },
  '/path-planning':  { title: 'Path Planning',          sub: 'A* ALGORITHM · COST SURFACE · WAYPOINTS' },
  '/data-layers':    { title: 'Data Layers',            sub: 'GIS LAYER CATALOGUE · RASTER DATASETS' },
  '/model-insights': { title: 'Model Insights',         sub: 'LUNARNET-V2.1 · ICE CLASSIFIER · ACCURACY 91.4%' },
  '/reports':        { title: 'Mission Reports',        sub: 'AUTOMATED ANALYSIS · EXPORT · ARCHIVE' },
  '/upload':         { title: 'Upload Dataset',         sub: 'GEOTIFF RASTER INGESTION · LOLA · MINI-RF · DIVINER' },
  '/team':           { title: 'Team',                   sub: 'BHARATIYA ANTARIKSH HACKATHON 2024' },
  '/settings':       { title: 'Settings',               sub: 'API CONFIGURATION · ANALYSIS PARAMETERS' },
};

const REGIONS = [
  'Shackleton Complex',
  'Haworth Region',
  'de Gerlache',
  'Nobile Region',
  'Amundsen Crater',
];

function UTCClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const h = String(now.getUTCHours()).padStart(2,'0');
      const m = String(now.getUTCMinutes()).padStart(2,'0');
      const s = String(now.getUTCSeconds()).padStart(2,'0');
      setTime(`${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
      <Clock size={10} style={{ color: 'var(--text-dim)' }} />
      <span style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--text-muted)',
        letterSpacing: '0.05em',
      }}>
        {time} <span style={{ opacity: 0.6, fontSize: 9 }}>UTC</span>
      </span>
    </div>
  );
}

export default function TopNavBar({ onHamburger }) {
  const { pathname } = useLocation();
  const { title, sub } = PAGE_TITLES[pathname] ?? PAGE_TITLES['/'];
  const [region, setRegion] = useState('Shackleton Complex');
  const [showRegions, setShowRegions] = useState(false);
  const [apiLive, setApiLive] = useState(null);

  // Health check
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/health`)
      .then(r => r.ok ? setApiLive(true) : setApiLive(false))
      .catch(() => setApiLive(false));
  }, []);

  return (
    <div className="topnav">

      {/* ── Hamburger (mobile only) ──────────────────── */}
      <button className="hamburger-btn" onClick={onHamburger} aria-label="Open navigation">
        <Menu size={16} />
      </button>

      {/* ── Mission identity ─────────────────────────── */}
      <div className="topnav-mission">
        <div>
          <div style={{
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--text-primary)',
            fontFamily: 'Space Grotesk, sans-serif',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
          }}>
            {title}
          </div>
          <div style={{
            fontSize: 9,
            color: 'var(--text-dim)',
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '0.08em',
            marginTop: 1,
          }}>
            {sub}
          </div>
        </div>
      </div>

      <div className="topnav-divider" />

      {/* ── Search ──────────────────────────────────── */}
      <div className="topnav-search">
        <Search size={12} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
        <input placeholder="Search coordinates, layers, analysis…" />
      </div>

      {/* ── Spacer ──────────────────────────────────── */}
      <div style={{ flex: 1 }} />

      {/* ── SOL Counter ─────────────────────────────── */}
      <div className="sol-badge">
        <span className="sol-label">SOL</span>
        <span className="sol-value">{MISSION_META.sol}</span>
      </div>

      <div className="topnav-divider" />

      {/* ── UTC Clock ───────────────────────────────── */}
      <UTCClock />

      <div className="topnav-divider" />

      {/* ── Region selector ─────────────────────────── */}
      <div style={{ position: 'relative' }}>
        <button
          className="topnav-region"
          onClick={() => setShowRegions(v => !v)}
        >
          <MapPin size={11} style={{ color: 'var(--orange)', flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)' }}>
            {region}
          </span>
          <ChevronDown size={11} style={{ color: 'var(--text-dim)' }} />
        </button>

        {showRegions && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 200,
            minWidth: 180,
            overflow: 'hidden',
          }}>
            {REGIONS.map(r => (
              <button
                key={r}
                onClick={() => { setRegion(r); setShowRegions(false); }}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '8px 14px',
                  textAlign: 'left',
                  background: r === region ? 'var(--orange-dim)' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 12,
                  color: r === region ? 'var(--orange)' : 'var(--text-secondary)',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: r === region ? 600 : 400,
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => { if (r !== region) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                onMouseLeave={e => { if (r !== region) e.currentTarget.style.background = 'none'; }}
              >
                {r}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="topnav-divider" />

      {/* ── API status ──────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
        <div
          className={`pulse-dot ${apiLive === true ? 'green' : ''}`}
          style={{
            background: apiLive === true
              ? 'var(--green)'
              : apiLive === false
                ? 'var(--red)'
                : 'var(--text-dim)',
          }}
        />
        <span style={{
          fontSize: 10,
          color: apiLive === true ? 'var(--green)' : apiLive === false ? 'var(--red)' : 'var(--text-dim)',
          fontFamily: 'JetBrains Mono, monospace',
          fontWeight: 700,
          letterSpacing: '0.06em',
        }}>
          {apiLive === true ? 'API LIVE' : apiLive === false ? 'OFFLINE' : '···'}
        </span>
      </div>

      <div className="topnav-divider" />

      {/* ── Export button ───────────────────────────── */}
      <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: 11 }}>
        <Download size={12} />
        Export
      </button>
    </div>
  );
}
