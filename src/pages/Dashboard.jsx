import React, { useState, useCallback } from 'react';
import {
  Snowflake,
  MapPin,
  AlertTriangle,
  Route,
  BrainCircuit,
  Layers,
  Eye,
  EyeOff,
  Navigation,
  Thermometer,
  Radio,
  Sun,
  Activity,
  TrendingUp,
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
    LOW:      'badge-green',
    MODERATE: 'badge-amber',
    HIGH:     'badge-red',
    SAFE:     'badge-green',
  };
  return (
    <span className={`badge ${map[level?.toUpperCase()] ?? 'badge-silver'}`}>
      {level ?? '—'}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────
   MISSION OVERVIEW STRIP (5 KPIs)
───────────────────────────────────────────────────────── */
const METRICS = [
  {
    label: 'Ice Score',
    value: ICE_DETECTION.overallProbability,
    unit:  '%',
    icon:  Snowflake,
    color: '#4A90D9',
    sub:   `${ICE_DETECTION.candidateRegions} candidate regions`,
  },
  {
    label: 'Safe Sites',
    value: 5,
    unit:  '',
    icon:  MapPin,
    color: 'var(--green)',
    sub:   'Candidate landing zones',
  },
  {
    label: 'Hazard Index',
    value: HAZARD_DATA.severityScore,
    unit:  '/100',
    icon:  AlertTriangle,
    color: 'var(--amber)',
    sub:   `${HAZARD_DATA.highRisk} high-risk zones`,
  },
  {
    label: 'Route Safety',
    value: NAVIGATION_DATA.safetyScore,
    unit:  '%',
    icon:  Route,
    color: 'var(--orange)',
    sub:   `${NAVIGATION_DATA.routeDistance} km · ${NAVIGATION_DATA.routeDifficulty}`,
  },
  {
    label: 'Model Conf.',
    value: MODEL_METRICS.accuracy,
    unit:  '%',
    icon:  BrainCircuit,
    color: 'var(--text-muted)',
    sub:   MODEL_METRICS.modelName,
  },
];

function MissionStrip() {
  return (
    <div className="mission-strip">
      {METRICS.map(m => (
        <div key={m.label} className="mission-strip__cell">
          <div className="mission-strip__value-row">
            <m.icon size={14} style={{ color: m.color, flexShrink: 0 }} />
            <span className="mission-strip__value" style={{ color: m.color }}>
              {m.value}
              {m.unit && <span className="mission-strip__unit">{m.unit}</span>}
            </span>
          </div>
          <div style={{
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--text-secondary)',
            marginTop: 2,
            fontFamily: 'Inter, sans-serif',
          }}>
            {m.label}
          </div>
          <div className="mission-strip__sub">{m.sub}</div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MAP FLOATING PANELS
───────────────────────────────────────────────────────── */

/** Top-left: Mission Workspace */
function MissionWorkspacePanel() {
  return (
    <div className="float-panel float-panel--tl" style={{ minWidth: 196, padding: '10px 14px' }}>
      <div className="float-panel-label">Mission Workspace</div>

      <div style={{
        fontSize: 12, fontWeight: 700, color: 'var(--text-primary)',
        fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1.2, marginBottom: 8,
      }}>
        {MISSION_META.name}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {[
          { label: 'MID',    value: MISSION_META.missionId },
          { label: 'REGION', value: 'Lunar South Pole' },
          { label: 'SOL',    value: MISSION_META.sol.toString() },
          { label: 'STATUS', value: MISSION_META.status },
        ].map(({ label, value }) => (
          <div key={label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{
              fontSize: 9, color: 'var(--text-dim)',
              fontFamily: 'Inter, sans-serif', fontWeight: 600,
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              {label}
            </span>
            <span className="float-panel-value" style={{ fontSize: 11 }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 8, paddingTop: 8,
        borderTop: '1px solid var(--border-light)',
        display: 'flex', alignItems: 'center', gap: 5,
      }}>
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          background: 'var(--green)', flexShrink: 0,
          animation: 'pulse-ring 2s infinite',
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
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
              width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
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
    { label: 'ROUTE',   value: `${NAVIGATION_DATA.routeDistance} km` },
    { label: 'SAFETY',  value: `${NAVIGATION_DATA.safetyScore}%`      },
    { label: 'ENERGY',  value: `${NAVIGATION_DATA.energyConsumption}`  },
    { label: 'STATUS',  value: NAVIGATION_DATA.routeDifficulty        },
  ];

  return (
    <div className="float-panel float-panel--bc" style={{ padding: '8px 16px' }}>
      <div style={{ display: 'flex', align: 'center', gap: 20 }}>
        {stats.map((s, i) => (
          <React.Fragment key={s.label}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 8, fontWeight: 700, letterSpacing: '0.10em',
                textTransform: 'uppercase', color: 'var(--text-dim)',
                fontFamily: 'Inter, sans-serif', marginBottom: 1,
              }}>
                {s.label}
              </div>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 12, fontWeight: 600, color: 'var(--text-primary)',
              }}>
                {s.value}
              </div>
            </div>
            {i < stats.length - 1 && (
              <div style={{ width: 1, background: 'var(--border)', alignSelf: 'stretch', margin: '0 2px' }} />
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
    <div className="float-panel float-panel--br" style={{ minWidth: 152, padding: '10px 14px' }}>
      <div className="float-panel-label" style={{ marginBottom: 6 }}>Mission Status</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'Inter, sans-serif' }}>
            Ice Score
          </span>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 700,
            color: '#4A90D9',
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

        <div style={{ marginTop: 4 }}>
          <RiskBadge level={HAZARD_DATA.overallRiskLevel} />
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
                borderColor: isActive ? 'var(--orange)' : 'var(--border)',
                background: isActive ? 'var(--orange-dim)' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.15s',
                color: isActive ? 'var(--orange-deep)' : 'var(--text-dim)',
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
   LANDING CANDIDATES TABLE
───────────────────────────────────────────────────────── */
function LandingCandidatesTable() {
  // Use the top candidate ice regions displayed as landing data (best we have in missionData)
  const sites = ICE_DETECTION.candidateTable ?? [];
  return (
    <div className="sci-card">
      <div className="sci-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <MapPin size={12} style={{ color: 'var(--orange)' }} />
          <span className="sci-card-title">Safe Landing Candidates</span>
        </div>
        <span style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>
          {sites.length} sites
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
              <th>Confidence</th>
            </tr>
          </thead>
          <tbody>
            {sites.map(site => (
              <tr key={site.id}>
                <td>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 11, fontWeight: 600, color: 'var(--text-dim)',
                  }}>
                    {site.id}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>
                    {site.name}
                  </span>
                </td>
                <td>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>
                    {site.lat.toFixed(2)}°N
                  </span>
                </td>
                <td>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>
                    {site.lon.toFixed(1)}°E
                  </span>
                </td>
                <td>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>
                    {site.area} km²
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700,
                      color: site.prob >= 80 ? 'var(--green)' : site.prob >= 60 ? 'var(--amber)' : 'var(--text-muted)',
                    }}>
                      {site.prob}%
                    </span>
                    <div className="prog-bar-track" style={{ width: 44 }}>
                      <div
                        className="prog-bar-fill"
                        style={{
                          width: `${site.prob}%`,
                          background: site.prob >= 80 ? 'var(--green)' : site.prob >= 60 ? 'var(--amber)' : 'var(--text-dim)',
                        }}
                      />
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
          <Snowflake size={12} style={{ color: '#4A90D9' }} />
          <span className="sci-card-title">Candidate Ice-Rich Regions</span>
        </div>
        <span style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>
          {regions.length} regions
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
              <th>Est. Depth</th>
              <th>Confidence</th>
            </tr>
          </thead>
          <tbody>
            {regions.slice(0, 7).map(region => (
              <tr key={region.id}>
                <td>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                    fontWeight: 600, color: 'var(--orange)',
                  }}>
                    #{region.id.replace('R-', '')}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>
                    {region.name}
                  </span>
                </td>
                <td>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10 }}>
                    {region.lat.toFixed(2)}°, {region.lon.toFixed(1)}°
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700,
                      color: region.prob >= 80 ? '#4A90D9' : 'var(--text-secondary)',
                    }}>
                      {region.prob}%
                    </span>
                    <div className="prog-bar-track" style={{ width: 44 }}>
                      <div
                        className="prog-bar-fill"
                        style={{ width: `${region.prob}%`, background: '#4A90D9' }}
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>
                    {region.area} km²
                  </span>
                </td>
                <td>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>
                    ~{region.depth} m
                  </span>
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
  { id: 'dem',    name: 'Digital Elevation Model', source: 'LRO LOLA',           unit: 'meters',  color: '#F47C20', statusLabel: 'DEM',  status: 'LOADED' },
  { id: 'slope',  name: 'Slope Map',               source: 'Horn\'s Method',     unit: 'degrees', color: '#9B59B6', statusLabel: 'SLOPE',status: 'COMPUTED' },
  { id: 'illum',  name: 'Illumination Map',        source: 'LRO LROC WAC',       unit: 'percent', color: '#F5C542', statusLabel: 'ILLUM',status: 'LOADED' },
  { id: 'psr',    name: 'PSR Mask',                source: 'LRO LROC',           unit: 'binary',  color: '#4A90D9', statusLabel: 'PSR',  status: 'LOADED' },
  { id: 'radar',  name: 'Radar CPR Layer',         source: 'Mini-RF / Chand.-1', unit: 'ratio',   color: '#7AA874', statusLabel: 'CPR',  status: 'PENDING' },
  { id: 'crater', name: 'Crater Density',          source: 'LRO LROC Catalog',   unit: 'km⁻²',   color: '#E07B54', statusLabel: 'CDM',  status: 'PENDING' },
];

const THUMB_GRADIENTS = {
  dem:    'linear-gradient(135deg, #1a2a3a 0%, #0d1825 40%, #F47C2022 100%)',
  slope:  'linear-gradient(135deg, #1a1a2e 0%, #0d0d1a 40%, #9B59B622 100%)',
  illum:  'linear-gradient(135deg, #1a1a0d 0%, #0d0d05 40%, #F5C54222 100%)',
  psr:    'linear-gradient(135deg, #0d1a2a 0%, #060d17 40%, #4A90D922 100%)',
  radar:  'linear-gradient(135deg, #0d1a0d 0%, #060d06 40%, #7AA87422 100%)',
  crater: 'linear-gradient(135deg, #1a140d 0%, #0d0a06 40%, #E07B5422 100%)',
};

function LayerCard({ layer, index }) {
  const [active, setActive] = useState(false);

  return (
    <div
      className={`layer-card${active ? ' active' : ''}`}
      onClick={() => setActive(v => !v)}
    >
      {/* Thumbnail */}
      <div
        className="layer-card__thumb"
        style={{ background: THUMB_GRADIENTS[layer.id] }}
      >
        {/* Decorative grid lines to look like a raster */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 160 72"
          style={{ position: 'absolute', inset: 0, opacity: 0.25 }}
        >
          {[20,40,60,80,100,120,140].map(x => (
            <line key={x} x1={x} y1={0} x2={x} y2={72} stroke={layer.color} strokeWidth="0.5" />
          ))}
          {[18,36,54].map(y => (
            <line key={y} x1={0} y1={y} x2={160} y2={y} stroke={layer.color} strokeWidth="0.5" />
          ))}
          {/* Simulated gradient noise */}
          {Array.from({ length: 24 }).map((_, i) => (
            <rect
              key={i}
              x={(i % 8) * 20}
              y={Math.floor(i / 8) * 24}
              width={20} height={24}
              fill={layer.color}
              opacity={0.04 + (i % 5) * 0.03}
            />
          ))}
        </svg>

        {/* Status dot top-right */}
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
            position: 'absolute', inset: 0, background: 'rgba(244,124,32,0.08)',
            borderRadius: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Eye size={18} style={{ color: 'var(--orange)' }} />
          </div>
        )}
      </div>

      <div className="layer-card__body">
        <div className="layer-card__name">{layer.name}</div>
        <div className="layer-card__meta">{layer.source} · {layer.unit}</div>
        <span
          className={`layer-card__badge ${
            layer.status === 'LOADED' || layer.status === 'COMPUTED'
              ? 'badge-green' : 'badge-silver'
          }`}
        >
          {layer.statusLabel} · {layer.status}
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   DASHBOARD PAGE
───────────────────────────────────────────────────────── */
export default function Dashboard() {
  const [activeLayers, setActiveLayers] = useState(LAYER_STATUS);

  const toggleLayer = useCallback(id => {
    setActiveLayers(prev =>
      prev.map(l => l.id === id ? { ...l, active: !l.active } : l)
    );
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>

      {/* ── 1. Mission Overview Strip ───────────────────── */}
      <MissionStrip />

      {/* ── 2. Map Hero Section ─────────────────────────── */}
      <div className="map-hero-section">
        {/* Map container — relatively positioned so float panels overlay it */}
        <div className="map-hero-container">
          <LunarMap
            height={500}
            showLayerPanel={false}
          />

          {/* ── Floating HUD Panels ──────────────────────── */}
          <MissionWorkspacePanel />
          <ActiveLayersPanel layers={activeLayers} onToggle={toggleLayer} />
          <RouteStatusPanel />
          <MissionStatusPanel />
          <LayerTogglePanel activeLayers={activeLayers} onToggle={toggleLayer} />
        </div>
      </div>

      {/* ── 3. Content below map ────────────────────────── */}
      <div style={{ padding: '0 24px 24px' }}>

        {/* ── Section: Mission Decision ─────────────────── */}
        <SectionHead label="Mission Decision" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <LandingCandidatesTable />
          <IceCandidatesTable />
        </div>

        {/* ── Section: Scientific Analytics ─────────────── */}
        <SectionHead label="Scientific Analytics" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="sci-card">
            <div className="sci-card-header">
              <span className="sci-card-title">Ice Probability Distribution</span>
            </div>
            <div className="sci-card-body" style={{ padding: '12px 8px 8px' }}>
              <IceProbabilityChart data={ICE_DETECTION.trend} height={200} />
            </div>
          </div>

          <div className="sci-card">
            <div className="sci-card-header">
              <span className="sci-card-title">Feature Importance</span>
            </div>
            <div className="sci-card-body" style={{ padding: '12px 8px 8px' }}>
              <FeatureImportanceChart data={ICE_DETECTION.featureImportance} height={200} />
            </div>
          </div>

          <div className="sci-card">
            <div className="sci-card-header">
              <span className="sci-card-title">Model Confidence Distribution</span>
            </div>
            <div className="sci-card-body" style={{ padding: '12px 8px 8px' }}>
              <ConfidenceDistribution data={ICE_DETECTION.confidenceDistribution} height={200} />
            </div>
          </div>

          <div className="sci-card">
            <div className="sci-card-header">
              <span className="sci-card-title">Elevation Profile · Route Path</span>
            </div>
            <div className="sci-card-body" style={{ padding: '12px 8px 8px' }}>
              <ElevationProfile data={NAVIGATION_DATA.elevationProfile} height={200} />
            </div>
          </div>
        </div>

        {/* ── Section: GIS Data Layers ───────────────────── */}
        <SectionHead label="GIS Data Layers" />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 14,
        }}>
          {LAYER_CARDS.map((layer, i) => (
            <LayerCard key={layer.id} layer={layer} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
