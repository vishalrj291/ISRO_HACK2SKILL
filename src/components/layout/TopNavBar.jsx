import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Download, ChevronDown, MapPin } from 'lucide-react';

/* ── Route → title map ──────────────────────────────────── */
const PAGE_TITLES = {
  '/':               { title: 'Mission Dashboard',      sub: 'CHANDRAYAAN-4 · LUNAR SOUTH POLE ICE SURVEY' },
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

export default function TopNavBar() {
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

      {/* ── Mission identity ─────────────────────────────── */}
      <div className="topnav-mission">
        <div>
          <div style={{
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--text-primary)',
            fontFamily: 'Space Grotesk, sans-serif',
            lineHeight: 1.2,
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

      {/* ── Search ──────────────────────────────────────── */}
      <div className="topnav-search">
        <Search size={12} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
        <input placeholder="Search coordinates, layers, analysis…" />
      </div>

      {/* ── Spacer ──────────────────────────────────────── */}
      <div style={{ flex: 1 }} />

      {/* ── Region selector ─────────────────────────────── */}
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
            background: 'var(--bg-secondary)',
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
                  color: r === region ? 'var(--orange-deep)' : 'var(--text-secondary)',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: r === region ? 600 : 400,
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => { if (r !== region) e.target.style.background = 'var(--bg-tertiary)'; }}
                onMouseLeave={e => { if (r !== region) e.target.style.background = 'none'; }}
              >
                {r}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="topnav-divider" />

      {/* ── API status ──────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <div
          className={`pulse-dot ${apiLive === true ? 'green' : apiLive === false ? '' : ''}`}
          style={{
            background: apiLive === true
              ? 'var(--green)'
              : apiLive === false
                ? 'var(--red)'
                : 'var(--text-dim)',
            boxShadow: apiLive === true
              ? '0 0 0 0 rgba(79,127,95,0.4)'
              : 'none',
          }}
        />
        <span style={{
          fontSize: 10,
          color: apiLive === true ? 'var(--green)' : 'var(--text-dim)',
          fontFamily: 'JetBrains Mono, monospace',
          fontWeight: 600,
          letterSpacing: '0.05em',
        }}>
          {apiLive === true ? 'API LIVE' : apiLive === false ? 'OFFLINE' : '…'}
        </span>
      </div>

      <div className="topnav-divider" />

      {/* ── Export button ────────────────────────────────── */}
      <button className="btn btn-primary" style={{ padding: '5px 12px', fontSize: 11 }}>
        <Download size={12} />
        Export
      </button>
    </div>
  );
}
