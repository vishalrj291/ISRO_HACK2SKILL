import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Snowflake, MapPin, AlertTriangle, Route, BrainCircuit,
  Layers, Eye, EyeOff, Navigation, Thermometer, Radio, Sun,
  Activity, TrendingUp, Zap, Shield, Cpu, Satellite,
} from 'lucide-react';

import LunarMap from '../components/map/LunarMap';
import IceProbabilityChart from '../components/charts/IceProbabilityChart';
import FeatureImportanceChart from '../components/charts/FeatureImportanceChart';
import ConfidenceDistribution from '../components/charts/ConfidenceDistribution';
import ElevationProfile from '../components/charts/ElevationProfile';

import {
  MISSION_META,
  ICE_DETECTION,
  HAZARD_DATA,
  NAVIGATION_DATA,
  MODEL_METRICS,
} from '../data/missionData';

/* ─────────────────────────────────────────────────────────
   UTILITY HELPERS
───────────────────────────────────────────────────────── */
function SectionHead({ label }) {
  return (
    <div className="section-head">
      <div className="section-head__pip" />
      <span className="section-head__label">{label}</span>
      <div className="section-head__rule" />
    </div>
  );
}

function RiskBadge({ level }) {
  const map = {
    LOW:      'badge-low',
    MED:      'badge-med',
    MODERATE: 'badge-med',
    HIGH:     'badge-high',
    SAFE:     'badge-green',
  };
  return (
    <span className={`badge ${map[level?.toUpperCase()] ?? 'badge-silver'}`}>
      {level ?? '—'}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────
   HERO SECTION  — Landing cinematic section
───────────────────────────────────────────────────────── */

/** Animated rover dot moving along the SVG path */
function RoverPathAnimation() {
  const dotRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0, angle: 0 });
  const progressRef = useRef(0);

  // Waypoints mapped to a rough SVG coordinate space (800×220 canvas)
  // Derived from NAVIGATION_DATA.waypoints lat/lon offsets
  const waypoints = [
    { x: 80,  y: 170 },
    { x: 180, y: 148 },
    { x: 295, y: 132 },
    { x: 410, y: 118 },
    { x: 540, y: 105 },
    { x: 660, y: 94  },
    { x: 760, y: 80  },
  ];

  const pathD = `M ${waypoints.map(p => `${p.x},${p.y}`).join(' L ')}`;

  useEffect(() => {
    let rafId;
    let t = 0;
    const speed = 0.00018; // very slow, ~55s full traversal

    function lerp(a, b, f) { return a + (b - a) * f; }

    function animate() {
      t = (t + speed) % 1;
      const totalSegs = waypoints.length - 1;
      const seg = Math.min(Math.floor(t * totalSegs), totalSegs - 1);
      const segT = (t * totalSegs) - seg;

      const p0 = waypoints[seg];
      const p1 = waypoints[seg + 1];
      const x = lerp(p0.x, p1.x, segT);
      const y = lerp(p0.y, p1.y, segT);
      const angle = Math.atan2(p1.y - p0.y, p1.x - p0.x) * (180 / Math.PI);

      setPos({ x, y, angle });
      rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <svg
      className="hero-path-canvas"
      viewBox="0 0 860 230"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Traversed path (dashed, faint) */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(244,124,32,0.20)"
        strokeWidth="1.5"
        strokeDasharray="6 4"
      />

      {/* Planned path (solid line) */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(244,124,32,0.45)"
        strokeWidth="1"
        strokeDasharray="3 6"
        strokeLinecap="round"
      />

      {/* Waypoint markers */}
      {waypoints.map((wp, i) => (
        <g key={i}>
          <circle cx={wp.x} cy={wp.y} r={3} fill="none" stroke="rgba(244,124,32,0.5)" strokeWidth="1" />
          <circle cx={wp.x} cy={wp.y} r={1.5} fill="rgba(244,124,32,0.7)" />
        </g>
      ))}

      {/* Start / End labels */}
      <text x={waypoints[0].x} y={waypoints[0].y - 8} fontSize="7" fill="rgba(61,154,106,0.8)"
        fontFamily="JetBrains Mono, monospace" letterSpacing="0.08em">START</text>
      <text x={waypoints[waypoints.length-1].x - 12} y={waypoints[waypoints.length-1].y - 8}
        fontSize="7" fill="rgba(244,124,32,0.8)" fontFamily="JetBrains Mono, monospace" letterSpacing="0.08em">TARGET</text>

      {/* Animated rover dot */}
      <g transform={`translate(${pos.x},${pos.y}) rotate(${pos.angle})`}>
        {/* Glow */}
        <circle cx={0} cy={0} r={8} fill="rgba(244,124,32,0.08)" />
        {/* Body */}
        <rect x={-6} y={-4} width={12} height={8} rx={2} fill="#F47C20" opacity={0.90} />
        {/* Solar panels */}
        <rect x={-10} y={-5.5} width={5} height={3} rx={0.5} fill="rgba(74,144,217,0.8)" />
        <rect x={5} y={-5.5} width={5} height={3} rx={0.5} fill="rgba(74,144,217,0.8)" />
        <rect x={-10} y={2.5} width={5} height={3} rx={0.5} fill="rgba(74,144,217,0.8)" />
        <rect x={5} y={2.5} width={5} height={3} rx={0.5} fill="rgba(74,144,217,0.8)" />
        {/* Antenna */}
        <line x1={0} y1={-4} x2={0} y2={-10} stroke="rgba(255,255,255,0.6)" strokeWidth={1} />
        <circle cx={0} cy={-10} r={1.5} fill="rgba(244,124,32,0.9)" />
      </g>
    </svg>
  );
}

function HeroSection() {
  const statusItems = [
    { label: 'Mission Status',    value: 'ACTIVE',       color: 'var(--green)' },
    { label: 'Rover Health',      value: 'NOMINAL',      color: 'var(--green)' },
    { label: 'Navigation Mode',   value: 'AUTONOMOUS',   color: 'var(--ice)' },
    { label: 'Ice Detection',     value: '78.4% PROB.',  color: 'var(--ice)' },
  ];

  return (
    <div className="hero-section">
      {/* Background layers */}
      <div className="hero-bg" />
      <div className="hero-stars" />
      <div className="hero-moon" />

      {/* Rover path animation overlay */}
      <RoverPathAnimation />

      {/* Content */}
      <div className="hero-content">
        {/* Mission badge */}
        <div className="hero-mission-badge">
          <Satellite size={10} />
          {MISSION_META.missionId} &nbsp;·&nbsp; {MISSION_META.region}
        </div>

        {/* Main title */}
        <h1 className="hero-title">
          AI-Based Subsurface Ice Detection &amp; Autonomous Navigation<br />
          for Lunar Polar Regions
        </h1>

        <div className="hero-subtitle">
          POLARIS AI · LUNAR POLAR EXPLORATION · SHACKLETON–HAWORTH COMPLEX · SOL {MISSION_META.sol}
        </div>

        {/* Mission status mini-panel */}
        <div className="hero-status-grid">
          {statusItems.map(s => (
            <div key={s.label} className="hero-status-cell">
              <span className="hero-status-label">{s.label}</span>
              <span className="hero-status-value" style={{ color: s.color }}>
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MISSION KPI CARDS (6 cards)
───────────────────────────────────────────────────────── */
const KPI_ITEMS = [
  {
    label:  'Total Area Scanned',
    value:  '2,847',
    unit:   'km²',
    icon:   Layers,
    color:  'var(--ice)',
    sub:    `${MISSION_META.region}`,
  },
  {
    label:  'Ice Probability',
    value:  ICE_DETECTION.overallProbability,
    unit:   '%',
    icon:   Snowflake,
    color:  'var(--ice)',
    sub:    `${ICE_DETECTION.candidateRegions} candidate · ${ICE_DETECTION.confirmedRegions} confirmed`,
  },
  {
    label:  'Safe Navigation Score',
    value:  NAVIGATION_DATA.safetyScore,
    unit:   '%',
    icon:   Shield,
    color:  'var(--green)',
    sub:    `${NAVIGATION_DATA.routeDistance} km · ${NAVIGATION_DATA.routeDifficulty}`,
  },
  {
    label:  'Hazard Level',
    value:  HAZARD_DATA.severityScore,
    unit:   '/100',
    icon:   AlertTriangle,
    color:  'var(--amber)',
    sub:    `${HAZARD_DATA.highRisk} high · ${HAZARD_DATA.moderateRisk} moderate`,
  },
  {
    label:  'Energy Consumption',
    value:  NAVIGATION_DATA.energyConsumption,
    unit:   'Wh',
    icon:   Zap,
    color:  'var(--orange)',
    sub:    `Est. for ${NAVIGATION_DATA.routeDistance} km route`,
  },
  {
    label:  'Rover Health',
    value:  98,
    unit:   '%',
    icon:   Cpu,
    color:  'var(--green)',
    sub:    `Systems nominal · SOL ${MISSION_META.sol}`,
  },
];

function KpiGrid() {
  return (
    <div className="kpi-grid">
      {KPI_ITEMS.map(k => (
        <div key={k.label} className="kpi-card" style={{ '--kpi-color': k.color }}>
          <div className="kpi-icon">
            <k.icon size={12} style={{ color: k.color }} />
            <span className="kpi-label">{k.label}</span>
          </div>
          <div>
            <span className="kpi-value">{k.value}</span>
            <span className="kpi-unit">{k.unit}</span>
          </div>
          <div className="kpi-sub">{k.sub}</div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MAP FLOATING PANELS (dark glassmorphism)
───────────────────────────────────────────────────────── */

/** Top-left: Mission Workspace */
function MissionWorkspacePanel() {
  return (
    <div className="float-panel float-panel--tl" style={{ minWidth: 200, padding: '10px 14px' }}>
      <div className="float-panel-label">Mission Workspace</div>

      <div style={{
        fontSize: 11, fontWeight: 700, color: 'var(--text-primary)',
        fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1.25, marginBottom: 10,
        letterSpacing: '-0.01em',
      }}>
        {MISSION_META.name}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {[
          { label: 'MID',    value: MISSION_META.missionId },
          { label: 'REGION', value: 'Lunar South Pole' },
          { label: 'SOL',    value: MISSION_META.sol.toString() },
          { label: 'STATUS', value: MISSION_META.status },
        ].map(({ label, value }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <span style={{
              fontSize: 8, color: 'var(--text-dim)',
              fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
              letterSpacing: '0.10em', textTransform: 'uppercase',
            }}>
              {label}
            </span>
            <span className="float-panel-value" style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 10, paddingTop: 8,
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          background: 'var(--green)', flexShrink: 0,
          animation: 'pulse-ring-green 2s infinite',
        }} />
        <span style={{
          fontSize: 9, fontWeight: 700, color: 'var(--green)',
          fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em',
        }}>
          SYSTEMS NOMINAL
        </span>
      </div>
    </div>
  );
}

/** Bottom-left: Active Layers */
const LAYER_STATUS = [
  { id: 'dem',   label: 'DEM',         color: '#F47C20', active: true  },
  { id: 'psr',   label: 'PSR Mask',    color: '#4A90D9', active: true  },
  { id: 'illum', label: 'Illumination',color: '#F5C542', active: true  },
  { id: 'radar', label: 'Radar CPR',   color: '#7AA874', active: false },
  { id: 'temp',  label: 'Temperature', color: '#C24D4D', active: false },
  { id: 'slope', label: 'Slope Map',   color: '#9B59B6', active: false },
];

function ActiveLayersPanel({ layers, onToggle }) {
  return (
    <div className="float-panel float-panel--bl" style={{ minWidth: 172, padding: '10px 14px' }}>
      <div className="float-panel-label" style={{ marginBottom: 6 }}>Active Layers</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {layers.map(l => (
          <div
            key={l.id}
            style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}
            onClick={() => onToggle(l.id)}
          >
            {l.active
              ? <Eye size={10} style={{ color: l.color, flexShrink: 0 }} />
              : <EyeOff size={10} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
            }
            <span style={{
              width: 6, height: 6, borderRadius: '1px', flexShrink: 0,
              background: l.active ? l.color : 'var(--border)',
            }} />
            <span style={{
              fontSize: 10, fontFamily: 'Inter, sans-serif',
              color: l.active ? 'var(--text-secondary)' : 'var(--text-dim)',
              fontWeight: l.active ? 500 : 400,
            }}>
              {l.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Bottom-center: Route Status */
function RouteStatusPanel() {
  const stats = [
    { label: 'ROUTE',  value: `${NAVIGATION_DATA.routeDistance} km` },
    { label: 'SAFETY', value: `${NAVIGATION_DATA.safetyScore}%`      },
    { label: 'ENERGY', value: `${NAVIGATION_DATA.energyConsumption} Wh` },
    { label: 'STATUS', value: NAVIGATION_DATA.routeDifficulty        },
  ];

  return (
    <div className="float-panel float-panel--bc" style={{ padding: '8px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {stats.map((s, i) => (
          <React.Fragment key={s.label}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 8, fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: 'var(--text-dim)',
                fontFamily: 'JetBrains Mono, monospace', marginBottom: 2,
              }}>
                {s.label}
              </div>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 12, fontWeight: 700, color: 'var(--text-primary)',
              }}>
                {s.value}
              </div>
            </div>
            {i < stats.length - 1 && (
              <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.06)' }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/** Bottom-right: Mission Status */
function MissionStatusPanel() {
  return (
    <div className="float-panel float-panel--br" style={{ minWidth: 160, padding: '10px 14px' }}>
      <div className="float-panel-label" style={{ marginBottom: 6 }}>Mission Status</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'Inter, sans-serif' }}>
            Ice Score
          </span>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 700,
            color: 'var(--ice)',
          }}>
            {ICE_DETECTION.overallProbability}%
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'Inter, sans-serif' }}>
            Candidates
          </span>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 600,
            color: 'var(--text-primary)',
          }}>
            {ICE_DETECTION.candidateRegions}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'Inter, sans-serif' }}>
            Confirmed
          </span>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 600,
            color: 'var(--green)',
          }}>
            {ICE_DETECTION.confirmedRegions}
          </span>
        </div>

        <div style={{ marginTop: 2 }}>
          <span className="badge badge-amber" style={{ fontSize: 8 }}>MODERATE HAZARD</span>
        </div>
      </div>
    </div>
  );
}

/** Right-side: Layer toggle strip */
const LAYER_ICONS = [
  { id: 'dem',   icon: Activity,    label: 'DEM'          },
  { id: 'psr',   icon: Navigation,  label: 'PSR Mask'     },
  { id: 'illum', icon: Sun,         label: 'Illumination' },
  { id: 'radar', icon: Radio,       label: 'Radar CPR'    },
  { id: 'temp',  icon: Thermometer, label: 'Temperature'  },
];

function LayerTogglePanel({ activeLayers, onToggle }) {
  return (
    <div className="float-panel float-panel--rm" style={{ padding: 6 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {LAYER_ICONS.map(({ id, icon: Icon, label }) => {
          const isActive = activeLayers.find(l => l.id === id)?.active;
          return (
            <button
              key={id}
              title={label}
              onClick={() => onToggle(id)}
              style={{
                width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 5,
                border: '1px solid',
                borderColor: isActive ? 'rgba(244,124,32,0.40)' : 'var(--border)',
                background: isActive ? 'rgba(244,124,32,0.10)' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.15s',
                color: isActive ? 'var(--orange)' : 'var(--text-dim)',
              }}
            >
              <Icon size={13} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SCIENTIFIC LAYER PANEL (switchable visualization layers)
───────────────────────────────────────────────────────── */
const SCI_LAYERS = [
  { id: 'elevation', label: 'Terrain Elevation',    color: '#F47C20', active: true  },
  { id: 'ice_prob',  label: 'Ice Probability',      color: '#4A90D9', active: true  },
  { id: 'hazard',    label: 'Hazard / Crater',      color: '#C24D4D', active: false },
  { id: 'slope',     label: 'Slope Analysis',       color: '#9B59B6', active: false },
  { id: 'travers',   label: 'Traversability',       color: '#7AA874', active: false },
  { id: 'safe_route',label: 'Safe Route',           color: '#3DD6A0', active: true  },
];

function ScientificLayerPanel({ layers, onToggle }) {
  return (
    <div className="layer-panel">
      <div className="layer-panel-header">
        <Layers size={12} style={{ color: 'var(--ice)' }} />
        <span className="layer-panel-title">Scientific Visualization Layers</span>
      </div>
      {layers.map(l => (
        <div key={l.id} className="layer-toggle-item" onClick={() => onToggle(l.id)}>
          <div
            className="layer-toggle-dot"
            style={{ background: l.active ? l.color : 'var(--border)', opacity: l.active ? 1 : 0.4 }}
          />
          <span className="layer-toggle-label" style={{ color: l.active ? 'var(--text-primary)' : 'var(--text-dim)' }}>
            {l.label}
          </span>
          {l.active
            ? <Eye size={10} style={{ color: 'var(--text-dim)' }} />
            : <EyeOff size={10} style={{ color: 'var(--text-dim)', opacity: 0.4 }} />
          }
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   HAZARD DISTRIBUTION CHART (inline SVG bar)
───────────────────────────────────────────────────────── */
function HazardBarChart() {
  const cats = HAZARD_DATA.categories;
  const max = Math.max(...cats.map(c => c.count));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {cats.map(c => (
        <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 80, fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif', flexShrink: 0 }}>
            {c.name}
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 2, height: 6, overflow: 'hidden' }}>
            <div style={{
              width: `${(c.count / max) * 100}%`,
              height: '100%',
              background: c.fill,
              borderRadius: 2,
              transition: 'width 0.5s ease',
            }} />
          </div>
          <div style={{
            width: 28, textAlign: 'right',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11, fontWeight: 700,
            color: c.fill,
            flexShrink: 0,
          }}>
            {c.count}
          </div>
        </div>
      ))}
      <div style={{
        fontSize: 9, color: 'var(--text-dim)',
        fontFamily: 'JetBrains Mono, monospace',
        letterSpacing: '0.04em', marginTop: 4,
      }}>
        SOURCE: LRO LROC CRATER DATABASE · SOUTH 84°–90°S
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SLOPE DISTRIBUTION (inline bar)
───────────────────────────────────────────────────────── */
function SlopeDistributionChart() {
  const data = HAZARD_DATA.slopeDistribution;
  const max = Math.max(...data.map(d => d.area));
  const SAFE_THRESHOLD = 15; // degrees for rover traversal
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      {data.map(d => {
        const isSafe = ['0–5°','5–10°'].includes(d.range);
        const color = isSafe ? 'var(--green)' : d.range === '10–20°' ? 'var(--amber)' : 'var(--red)';
        return (
          <div key={d.range} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 52, fontSize: 10, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 }}>
              {d.range}
            </div>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 2, height: 6, overflow: 'hidden' }}>
              <div style={{
                width: `${(d.area / max) * 100}%`,
                height: '100%',
                background: color,
                borderRadius: 2,
              }} />
            </div>
            <div style={{
              width: 36, textAlign: 'right',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 11, fontWeight: 700,
              color,
              flexShrink: 0,
            }}>
              {d.area}%
            </div>
          </div>
        );
      })}
      <div style={{
        fontSize: 9, color: 'var(--text-dim)',
        fontFamily: 'JetBrains Mono, monospace',
        letterSpacing: '0.04em', marginTop: 4,
      }}>
        SOURCE: LOLA SLOPE MAP · HORN'S METHOD · AREA %
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   LANDING CANDIDATES TABLE
───────────────────────────────────────────────────────── */
function LandingCandidatesTable() {
  const sites = ICE_DETECTION.candidateTable ?? [];
  return (
    <div className="sci-card">
      <div className="sci-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <MapPin size={12} style={{ color: 'var(--orange)' }} />
          <span className="sci-card-title">Safe Landing Candidates</span>
        </div>
        <span style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>
          {sites.length} SITES
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Region Name</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Area (km²)</th>
              <th>Ice Prob.</th>
              <th>Conf.</th>
            </tr>
          </thead>
          <tbody>
            {sites.map(site => (
              <tr key={site.id}>
                <td>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 600, color: 'var(--text-dim)' }}>
                    {site.id}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{site.name}</span>
                </td>
                <td>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-secondary)' }}>
                    {site.lat.toFixed(2)}°
                  </span>
                </td>
                <td>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-secondary)' }}>
                    {site.lon.toFixed(1)}°
                  </span>
                </td>
                <td>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10 }}>{site.area}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700,
                      color: site.prob >= 80 ? 'var(--green)' : site.prob >= 60 ? 'var(--amber)' : 'var(--text-muted)',
                    }}>
                      {site.prob}%
                    </span>
                    <div className="prog-bar-track" style={{ width: 40 }}>
                      <div className="prog-bar-fill" style={{
                        width: `${site.prob}%`,
                        background: site.prob >= 80 ? 'var(--green)' : site.prob >= 60 ? 'var(--amber)' : 'var(--text-dim)',
                      }} />
                    </div>
                  </div>
                </td>
                <td><RiskBadge level={site.conf} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   ICE CANDIDATES TABLE
───────────────────────────────────────────────────────── */
function IceCandidatesTable() {
  const regions = ICE_DETECTION.candidateTable ?? [];
  return (
    <div className="sci-card">
      <div className="sci-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Snowflake size={12} style={{ color: 'var(--ice)' }} />
          <span className="sci-card-title">Candidate Ice-Rich Regions</span>
        </div>
        <span style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>
          {regions.length} REGIONS
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Region Name</th>
              <th>Coordinates</th>
              <th>Ice Prob.</th>
              <th>Area</th>
              <th>Depth</th>
              <th>Conf.</th>
            </tr>
          </thead>
          <tbody>
            {regions.slice(0, 7).map(region => (
              <tr key={region.id}>
                <td>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 600, color: 'var(--orange)' }}>
                    #{region.id.replace('R-', '')}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{region.name}</span>
                </td>
                <td>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-muted)' }}>
                    {region.lat.toFixed(2)}°, {region.lon.toFixed(1)}°
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700,
                      color: region.prob >= 80 ? 'var(--ice)' : 'var(--text-secondary)',
                    }}>
                      {region.prob}%
                    </span>
                    <div className="prog-bar-track" style={{ width: 40 }}>
                      <div className="prog-bar-fill" style={{ width: `${region.prob}%`, background: 'var(--ice)' }} />
                    </div>
                  </div>
                </td>
                <td>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10 }}>{region.area} km²</span>
                </td>
                <td>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10 }}>~{region.depth} m</span>
                </td>
                <td><RiskBadge level={region.conf} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   GIS LAYER CARDS
───────────────────────────────────────────────────────── */
const LAYER_CARDS = [
  { id: 'dem',    name: 'Digital Elevation Model', source: 'LRO LOLA',           unit: 'meters',  color: '#F47C20', statusLabel: 'DEM',   status: 'LOADED'   },
  { id: 'slope',  name: 'Slope Map',               source: "Horn's Method",       unit: 'degrees', color: '#9B59B6', statusLabel: 'SLOPE', status: 'COMPUTED' },
  { id: 'illum',  name: 'Illumination Map',        source: 'LRO LROC WAC',       unit: 'percent', color: '#F5C542', statusLabel: 'ILLUM', status: 'LOADED'   },
  { id: 'psr',    name: 'PSR Mask',                source: 'LRO LROC',           unit: 'binary',  color: '#4A90D9', statusLabel: 'PSR',   status: 'LOADED'   },
  { id: 'radar',  name: 'Radar CPR Layer',         source: 'Mini-RF / Chand.-1', unit: 'ratio',   color: '#7AA874', statusLabel: 'CPR',   status: 'PENDING'  },
  { id: 'crater', name: 'Crater Density',          source: 'LRO LROC Catalog',   unit: 'km⁻²',   color: '#E07B54', statusLabel: 'CDM',   status: 'PENDING'  },
];

const THUMB_GRADIENTS = {
  dem:    'linear-gradient(135deg, #0F1E30 0%, #070D18 40%, rgba(244,124,32,0.10) 100%)',
  slope:  'linear-gradient(135deg, #0F0F22 0%, #070714 40%, rgba(155,89,182,0.10) 100%)',
  illum:  'linear-gradient(135deg, #1A1A08 0%, #0D0D04 40%, rgba(245,197,66,0.10) 100%)',
  psr:    'linear-gradient(135deg, #0A1222 0%, #050910 40%, rgba(74,144,217,0.10) 100%)',
  radar:  'linear-gradient(135deg, #0A1A0A 0%, #050D05 40%, rgba(122,168,116,0.10) 100%)',
  crater: 'linear-gradient(135deg, #1A0D08 0%, #0D0604 40%, rgba(224,123,84,0.10) 100%)',
};

function LayerCard({ layer }) {
  const [active, setActive] = useState(false);

  return (
    <div
      className={`layer-card${active ? ' active' : ''}`}
      onClick={() => setActive(v => !v)}
    >
      {/* Thumbnail */}
      <div className="layer-card__thumb" style={{ background: THUMB_GRADIENTS[layer.id] }}>
        {/* Decorative raster grid lines */}
        <svg
          width="100%" height="100%"
          viewBox="0 0 160 72"
          style={{ position: 'absolute', inset: 0, opacity: 0.20 }}
        >
          {[20,40,60,80,100,120,140].map(x => (
            <line key={x} x1={x} y1={0} x2={x} y2={72} stroke={layer.color} strokeWidth="0.5" />
          ))}
          {[18,36,54].map(y => (
            <line key={y} x1={0} y1={y} x2={160} y2={y} stroke={layer.color} strokeWidth="0.5" />
          ))}
          {Array.from({ length: 24 }).map((_, i) => (
            <rect
              key={i}
              x={(i % 8) * 20} y={Math.floor(i / 8) * 24}
              width={20} height={24}
              fill={layer.color}
              opacity={0.03 + (i % 5) * 0.025}
            />
          ))}
        </svg>

        {/* Status dot */}
        <div style={{ position: 'absolute', top: 6, right: 8 }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: layer.status === 'LOADED' || layer.status === 'COMPUTED'
              ? 'var(--green)' : 'var(--border)',
          }} />
        </div>

        {/* Active overlay */}
        {active && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(244,124,32,0.06)',
            borderRadius: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Eye size={16} style={{ color: 'var(--orange)' }} />
          </div>
        )}
      </div>

      <div className="layer-card__body">
        <div className="layer-card__name">{layer.name}</div>
        <div className="layer-card__meta">{layer.source} · {layer.unit}</div>
        <span className={`layer-card__badge ${
          layer.status === 'LOADED' || layer.status === 'COMPUTED'
            ? 'badge-green' : 'badge-silver'
        }`}>
          {layer.statusLabel} · {layer.status}
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   CHART WRAPPER — research-paper style with source note
───────────────────────────────────────────────────────── */
function ChartCard({ title, source, children }) {
  return (
    <div className="sci-card">
      <div className="sci-card-header">
        <span className="sci-card-title">{title}</span>
      </div>
      <div className="sci-card-body" style={{ padding: '12px 12px 10px' }}>
        {children}
        {source && (
          <div className="chart-source-note" style={{ marginTop: 6 }}>
            SOURCE: {source}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   DASHBOARD PAGE
───────────────────────────────────────────────────────── */
export default function Dashboard() {
  const [activeLayers, setActiveLayers] = useState(LAYER_STATUS);
  const [sciLayers, setSciLayers] = useState(SCI_LAYERS);

  const toggleLayer = useCallback(id => {
    setActiveLayers(prev => prev.map(l => l.id === id ? { ...l, active: !l.active } : l));
  }, []);

  const toggleSciLayer = useCallback(id => {
    setSciLayers(prev => prev.map(l => l.id === id ? { ...l, active: !l.active } : l));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>

      {/* ── 1. Hero / Landing Section ───────────────── */}
      <HeroSection />

      {/* ── 2. Mission KPI Cards ─────────────────────── */}
      <KpiGrid />

      {/* ── 3. Map + Scientific Layer Panel ─────────── */}
      <div className="map-hero-section">
        <div className="map-hero-container">
          <LunarMap height={480} showLayerPanel={false} />

          {/* Floating HUD Panels */}
          <MissionWorkspacePanel />
          <ActiveLayersPanel layers={activeLayers} onToggle={toggleLayer} />
          <RouteStatusPanel />
          <MissionStatusPanel />
          <LayerTogglePanel activeLayers={activeLayers} onToggle={toggleLayer} />
        </div>
      </div>

      {/* ── 4. Content below map ─────────────────────── */}
      <div style={{ padding: '0 24px 32px' }}>

        {/* Scientific Layer Panel + Charts side-by-side */}
        <SectionHead label="Scientific Visualization Layers" />
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16, alignItems: 'start' }}>
          <ScientificLayerPanel layers={sciLayers} onToggle={toggleSciLayer} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <ChartCard
              title="Slope Distribution · Terrain Analysis"
              source="LOLA SLOPE MAP · HORN'S METHOD · SOUTH POLAR REGION"
            >
              <SlopeDistributionChart />
            </ChartCard>
            <ChartCard
              title="Hazard Score Distribution"
              source="LRO LROC CRATER DB · DIVINER PSR · 84°–90°S"
            >
              <HazardBarChart />
            </ChartCard>
          </div>
        </div>

        {/* Mission Decision */}
        <SectionHead label="Mission Decision — Landing & Ice Candidates" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <LandingCandidatesTable />
          <IceCandidatesTable />
        </div>

        {/* Scientific Analytics */}
        <SectionHead label="Scientific Analytics — Model & Navigation" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <ChartCard
            title="Ice Probability Distribution · Sol Trend"
            source="LUNARICENET-V2.1 · MINI-RF S2 · LROC NAC · SOL 280–312"
          >
            <IceProbabilityChart data={ICE_DETECTION.trend} height={200} />
          </ChartCard>

          <ChartCard
            title="Feature Importance · Ice Detection Model"
            source="LUNARICENET-V2.1 · RF CLASSIFIER · TRAINING: LROC+MINI-RF+LCROSS"
          >
            <FeatureImportanceChart data={ICE_DETECTION.featureImportance} height={200} />
          </ChartCard>

          <ChartCard
            title="Model Confidence Distribution"
            source="LUNARICENET-V2.1 · AUC = 0.964 · n=500 VALIDATION SAMPLES"
          >
            <ConfidenceDistribution data={ICE_DETECTION.confidenceDistribution} height={200} />
          </ChartCard>

          <ChartCard
            title="Terrain Elevation Profile · Navigation Route"
            source="LRO LOLA DEM · ROUTE: START→WP6 · TOTAL DIST: 14.73 km"
          >
            <ElevationProfile data={NAVIGATION_DATA.elevationProfile} height={200} />
          </ChartCard>
        </div>

        {/* GIS Data Layers */}
        <SectionHead label="GIS Data Layers" />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
          gap: 12,
        }}>
          {LAYER_CARDS.map(layer => (
            <LayerCard key={layer.id} layer={layer} />
          ))}
        </div>
      </div>
    </div>
  );
}
