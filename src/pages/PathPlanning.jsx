import React, { useState } from 'react';
import { Loader, Route, AlertCircle, Navigation, Sliders, ChevronRight, Target } from 'lucide-react';
import DataUpload from '../components/upload/DataUpload';
import ElevationProfile from '../components/charts/ElevationProfile';
import LunarMap from '../components/map/LunarMap';
import { usePlanRoute } from '../data/hooks/useApi';
import { NAVIGATION_DATA } from '../data/missionData';

/* ─── Shared helpers ─────────────────────────────────────── */
function SectionHead({ label }) {
  return (
    <div className="section-head">
      <div className="section-head__pip" />
      <span className="section-head__label">{label}</span>
      <div className="section-head__rule" />
    </div>
  );
}

function MetricPill({ label, value, unit, color = 'var(--text-primary)' }) {
  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      padding: '10px 14px',
      boxShadow: 'var(--shadow-xs)',
    }}>
      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--text-dim)', fontFamily: 'Inter, sans-serif', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 22, fontWeight: 700, color, lineHeight: 1 }}>
        {value ?? '—'}
        {unit && <span style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 400, marginLeft: 3 }}>{unit}</span>}
      </div>
    </div>
  );
}

/* ─── Coordinate input group ─────────────────────────────── */
function CoordInput({ label, value, onChange, rows, cols, color = 'var(--orange)' }) {
  return (
    <div>
      <div style={{
        fontSize: 9, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase',
        color, fontFamily: 'Inter, sans-serif', marginBottom: 8,
        display: 'flex', alignItems: 'center', gap: 5,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
        {label}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div>
          <div style={{ fontSize: 9, color: 'var(--text-dim)', marginBottom: 4, fontFamily: 'JetBrains Mono, monospace' }}>
            ROW (0–{rows - 1})
          </div>
          <input
            className="sci-input"
            type="number"
            min={0}
            max={rows - 1}
            value={value.row}
            onChange={e => onChange({ ...value, row: parseInt(e.target.value) || 0 })}
            style={{ width: '100%', fontFamily: 'JetBrains Mono, monospace' }}
          />
        </div>
        <div>
          <div style={{ fontSize: 9, color: 'var(--text-dim)', marginBottom: 4, fontFamily: 'JetBrains Mono, monospace' }}>
            COL (0–{cols - 1})
          </div>
          <input
            className="sci-input"
            type="number"
            min={0}
            max={cols - 1}
            value={value.col}
            onChange={e => onChange({ ...value, col: parseInt(e.target.value) || 0 })}
            style={{ width: '100%', fontFamily: 'JetBrains Mono, monospace' }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Waypoint table ─────────────────────────────────────── */
function WaypointTable({ waypoints }) {
  return (
    <div style={{ overflowX: 'auto', maxHeight: 220, overflowY: 'auto' }}>
      <table className="data-table">
        <thead>
          <tr>
            <th>Step</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Elevation</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {waypoints.map(wp => (
            <tr key={wp.id ?? wp.step}>
              <td>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 600, color: 'var(--orange)' }}>
                  {(wp.id ?? wp.step).toString().padStart(3, '0')}
                </span>
              </td>
              <td><span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>{(wp.lat ?? wp.latitude)?.toFixed(4)}°</span></td>
              <td><span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>{(wp.lon ?? wp.longitude)?.toFixed(4)}°</span></td>
              <td>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-muted)' }}>
                  {wp.elev != null ? `${wp.elev} m` : '—'}
                </span>
              </td>
              <td>
                {wp.type && (
                  <span className={`badge ${
                    wp.type === 'START' ? 'badge-green'  :
                    wp.type === 'END'   ? 'badge-orange' : 'badge-silver'
                  }`}>
                    {wp.type}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PathPlanning() {
  const [demId,    setDemId]    = useState(null);
  const [hazardId, setHazardId] = useState(null);
  const [demMeta,  setDemMeta]  = useState({ rows: 1000, cols: 1000 });
  const [tab,      setTab]      = useState('dem');
  const [start,    setStart]    = useState({ row: 0,   col: 0   });
  const [goal,     setGoal]     = useState({ row: 100, col: 100 });
  const [slopePen, setSlopePen] = useState(2.0);
  const [hazardPen,setHazardPen]= useState(5.0);
  const { plan, data, loading, error } = usePlanRoute();

  const onUpload = (result) => {
    if (tab === 'dem') {
      setDemId(result.file_id);
      setDemMeta({ rows: result.rows, cols: result.cols });
      setGoal({ row: Math.min(100, result.rows - 1), col: Math.min(100, result.cols - 1) });
    }
    if (tab === 'hazard') setHazardId(result.file_id);
  };

  const runPlan = () => {
    if (!demId) return;
    plan({
      demFileId:    demId,
      hazardFileId: hazardId || null,
      start, goal,
      slopePenalty:  slopePen,
      hazardPenalty: hazardPen,
    });
  };

  /* Merge with static fallback */
  const display = data || {
    found:             true,
    path_length_steps: NAVIGATION_DATA.waypoints.length,
    total_distance_m:  NAVIGATION_DATA.routeDistance * 1000,
    estimated_energy:  NAVIGATION_DATA.energyConsumption,
    safety_score:      NAVIGATION_DATA.safetyScore / 100,
    path_waypoints:    [],
  };

  const roverPath = data?.path_waypoints?.map(wp => [wp.latitude, wp.longitude]) ?? [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* ── Page Header ─────────────────────────────────── */}
      <div className="page-header">
        <div>
          <div className="page-title">Path Planning</div>
          <div className="page-subtitle">A* COST-SURFACE ROUTING · SLOPE + HAZARD PENALTY · WAYPOINT OPTIMISATION</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {error && (
            <span style={{ fontSize: 11, color: 'var(--red)', fontFamily: 'JetBrains Mono, monospace', display: 'flex', alignItems: 'center', gap: 5 }}>
              <AlertCircle size={12} /> {error}
            </span>
          )}
          <button className="btn btn-primary" onClick={runPlan} disabled={!demId || loading}>
            {loading ? <Loader size={12} className="animate-spin" /> : <Route size={12} />}
            Plan Route
          </button>
        </div>
      </div>

      <div className="page-body flex-1 overflow-y-auto" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* ── Section: Inputs ──────────────────────────── */}
        <SectionHead label="Route Configuration" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 4 }}>
          {/* Upload */}
          <div className="sci-card">
            <div className="sci-card-header">
              <span className="sci-card-title">Dataset Upload</span>
            </div>
            <div className="sci-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Tab strip */}
              <div style={{ display: 'flex', gap: 6 }}>
                {[
                  { id: 'dem',    label: 'DEM',    req: '(req)', loaded: !!demId    },
                  { id: 'hazard', label: 'Hazard', req: '(opt)', loaded: !!hazardId },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    style={{
                      padding: '5px 10px', borderRadius: 4,
                      border: '1px solid',
                      borderColor: tab === t.id ? 'var(--orange)' : 'var(--border)',
                      background: tab === t.id ? 'var(--orange-dim)' : 'transparent',
                      cursor: 'pointer', fontSize: 10, fontFamily: 'Inter, sans-serif',
                      fontWeight: 600,
                      color: tab === t.id ? 'var(--orange-deep)' : 'var(--text-muted)',
                    }}
                  >
                    {t.label} {t.req} {t.loaded && '✓'}
                  </button>
                ))}
              </div>
              <DataUpload onUpload={onUpload} acceptedTypes=".tif,.tiff,.geotiff" />
            </div>
          </div>

          {/* Coordinates */}
          <div className="sci-card">
            <div className="sci-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <Navigation size={12} style={{ color: 'var(--orange)' }} />
                <span className="sci-card-title">Start / Goal Coordinates</span>
              </div>
            </div>
            <div className="sci-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <CoordInput
                label="Start Position"
                value={start}
                onChange={setStart}
                rows={demMeta.rows}
                cols={demMeta.cols}
                color="var(--green)"
              />
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ChevronRight size={14} style={{ color: 'var(--text-dim)' }} />
              </div>
              <CoordInput
                label="Goal Position"
                value={goal}
                onChange={setGoal}
                rows={demMeta.rows}
                cols={demMeta.cols}
                color="var(--orange)"
              />
            </div>
          </div>

          {/* A* Parameters */}
          <div className="sci-card">
            <div className="sci-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <Sliders size={12} style={{ color: 'var(--orange)' }} />
                <span className="sci-card-title">A* Algorithm Parameters</span>
              </div>
            </div>
            <div className="sci-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Slope penalty */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontFamily: 'Inter, sans-serif', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    Slope Penalty
                  </span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700, color: 'var(--orange)' }}>
                    {slopePen.toFixed(1)}×
                  </span>
                </div>
                <input
                  type="range" min={0} max={10} step={0.1} value={slopePen}
                  onChange={e => setSlopePen(parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                  <span style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>0 (ignore)</span>
                  <span style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>10 (avoid)</span>
                </div>
              </div>

              {/* Hazard penalty */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontFamily: 'Inter, sans-serif', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    Hazard Penalty
                  </span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700, color: 'var(--red)' }}>
                    {hazardPen.toFixed(1)}×
                  </span>
                </div>
                <input
                  type="range" min={0} max={20} step={0.5} value={hazardPen}
                  onChange={e => setHazardPen(parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                  <span style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>0 (ignore)</span>
                  <span style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>20 (strict)</span>
                </div>
              </div>

              {/* Cost function info */}
              <div style={{
                background: 'var(--bg-tertiary)', borderRadius: 6, padding: '8px 12px',
                fontFamily: 'JetBrains Mono, monospace', fontSize: 9, lineHeight: 1.8,
                color: 'var(--text-secondary)', border: '1px solid var(--border-light)',
              }}>
                <div style={{ color: 'var(--text-dim)', fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>Step cost</div>
                cost = dist + <span style={{ color: 'var(--orange)' }}>{slopePen}×slope</span>
                {' + '}<span style={{ color: 'var(--red)' }}>{hazardPen}×hazard</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Section: Route Results ────────────────────── */}
        <SectionHead label="Route Analysis" />

        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
          <MetricPill
            label="Path Found"
            value={display.found ? 'YES' : 'NO'}
            color={display.found ? 'var(--green)' : 'var(--red)'}
          />
          <MetricPill
            label="Total Distance"
            value={(display.total_distance_m / 1000).toFixed(2)}
            unit="km"
            color="var(--text-primary)"
          />
          <MetricPill
            label="Safety Score"
            value={(display.safety_score * 100).toFixed(1)}
            unit="%"
            color={display.safety_score > 0.8 ? 'var(--green)' : display.safety_score > 0.6 ? 'var(--amber)' : 'var(--red)'}
          />
          <MetricPill
            label="Est. Energy"
            value={display.estimated_energy?.toFixed(1)}
            unit="J"
            color="var(--orange)"
          />
        </div>

        {/* Map + elevation side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 4 }}>
          <div className="sci-card">
            <div className="sci-card-header">
              <span className="sci-card-title">Route Map</span>
              <span style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>
                {display.path_length_steps} waypoints
              </span>
            </div>
            <div style={{ height: 300 }}>
              <LunarMap height={300} roverPath={roverPath} showLayerPanel={false} />
            </div>
          </div>

          <div className="sci-card">
            <div className="sci-card-header">
              <span className="sci-card-title">Elevation Profile · Route Path</span>
            </div>
            <div className="sci-card-body" style={{ padding: '10px 8px 8px' }}>
              <ElevationProfile data={NAVIGATION_DATA.elevationProfile} height={260} />
            </div>
          </div>
        </div>

        {/* ── Section: Waypoints ────────────────────────── */}
        <SectionHead label="Waypoint Log" />
        <div className="sci-card" style={{ marginBottom: 4 }}>
          <div className="sci-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <Target size={12} style={{ color: 'var(--orange)' }} />
              <span className="sci-card-title">Route Waypoints</span>
            </div>
          </div>
          <WaypointTable waypoints={
            data?.path_waypoints?.length > 0
              ? data.path_waypoints
              : NAVIGATION_DATA.waypoints
          } />
        </div>

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 0', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>
            <Loader size={14} className="animate-spin" style={{ color: 'var(--orange)' }} />
            RUNNING A* PATHFINDING ON COST SURFACE…
          </div>
        )}
      </div>
    </div>
  );
}
