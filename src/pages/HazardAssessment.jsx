import React, { useState } from 'react';
import { Loader, AlertTriangle, AlertCircle, Shield, Activity } from 'lucide-react';
import DataUpload from '../components/upload/DataUpload';
import { useHazardMap } from '../data/hooks/useApi';
import { HAZARD_DATA } from '../data/missionData';

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

/* ─── Semi-circle gauge ──────────────────────────────────── */
function HazardGauge({ score }) {
  // score: 0–1
  const S = score ?? 0;
  const radius = 80;
  const cx = 100;
  const cy = 100;
  const startAngle = -180;
  const endAngle   = 0;
  const arcLen = endAngle - startAngle; // 180°

  function polar(angle, r = radius) {
    const rad = (angle * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  }

  const trackStart = polar(startAngle);
  const trackEnd  = polar(endAngle);
  const fillEnd   = polar(startAngle + S * arcLen);
  const needleEnd = polar(startAngle + S * arcLen, radius - 14);

  const fillColor = S < 0.35 ? 'var(--green)' : S < 0.65 ? 'var(--amber)' : 'var(--red)';
  const label     = S < 0.35 ? 'LOW'          : S < 0.65 ? 'MODERATE'      : 'HIGH';

  return (
    <svg viewBox="0 0 200 120" style={{ width: '100%', maxWidth: 220 }}>
      {/* Track */}
      <path
        d={`M ${trackStart.x} ${trackStart.y} A ${radius} ${radius} 0 0 1 ${trackEnd.x} ${trackEnd.y}`}
        fill="none" stroke="var(--border-light)" strokeWidth={12} strokeLinecap="round"
      />
      {/* Fill */}
      <path
        d={`M ${trackStart.x} ${trackStart.y} A ${radius} ${radius} 0 ${S > 0.5 ? 1 : 0} 1 ${fillEnd.x} ${fillEnd.y}`}
        fill="none" stroke={fillColor} strokeWidth={12} strokeLinecap="round"
      />
      {/* Needle */}
      <line x1={cx} y1={cy} x2={needleEnd.x} y2={needleEnd.y}
        stroke={fillColor} strokeWidth={2.5} strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r={5} fill={fillColor} />
      {/* Center value */}
      <text x={cx} y={cy - 16} textAnchor="middle" fontFamily="JetBrains Mono, monospace"
        fontSize={24} fontWeight={700} fill={fillColor}>
        {(S * 100).toFixed(0)}
      </text>
      <text x={cx} y={cy - 4} textAnchor="middle" fontFamily="Inter, sans-serif"
        fontSize={9} fontWeight={700} fill="var(--text-dim)" letterSpacing="0.08em">
        /100
      </text>
      {/* Label */}
      <text x={cx} y={cy + 14} textAnchor="middle" fontFamily="Inter, sans-serif"
        fontSize={9} fontWeight={700} fill={fillColor} letterSpacing="0.10em">
        {label} HAZARD
      </text>
      {/* Ticks */}
      {[0, 0.25, 0.5, 0.75, 1].map(t => {
        const p1 = polar(startAngle + t * arcLen, radius + 6);
        const p2 = polar(startAngle + t * arcLen, radius + 12);
        return <line key={t} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="var(--border)" strokeWidth={1} />;
      })}
    </svg>
  );
}

/* ─── Risk distribution bar ──────────────────────────────── */
function RiskDistributionBar({ high, medium, low }) {
  return (
    <div>
      <div style={{ display: 'flex', height: 12, borderRadius: 6, overflow: 'hidden', marginBottom: 10 }}>
        <div style={{ width: `${high}%`,   background: 'var(--red)',   transition: 'width 0.6s ease' }} />
        <div style={{ width: `${medium}%`, background: 'var(--amber)', transition: 'width 0.6s ease' }} />
        <div style={{ width: `${low}%`,    background: 'var(--green)', transition: 'width 0.6s ease' }} />
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        {[
          { label: 'HIGH',     pct: high,   color: 'var(--red)'   },
          { label: 'MODERATE', pct: medium, color: 'var(--amber)' },
          { label: 'LOW',      pct: low,    color: 'var(--green)' },
        ].map(({ label, pct, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: color, flexShrink: 0 }} />
            <span style={{ fontSize: 10, fontFamily: 'Inter, sans-serif', color: 'var(--text-muted)' }}>
              {label}: <strong style={{ color, fontFamily: 'JetBrains Mono, monospace' }}>{pct?.toFixed(1)}%</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Hazard zone table ──────────────────────────────────── */
function HazardZoneTable({ zones }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="data-table">
        <thead>
          <tr>
            <th>Zone ID</th>
            <th>Hazard Type</th>
            <th>Coordinates</th>
            <th>Radius</th>
            <th>Severity</th>
          </tr>
        </thead>
        <tbody>
          {zones.map(hz => (
            <tr key={hz.id}>
              <td>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 600, color: 'var(--orange)' }}>
                  {hz.id}
                </span>
              </td>
              <td>
                <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{hz.type}</span>
              </td>
              <td>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10 }}>
                  {hz.lat.toFixed(2)}°N · {hz.lon.toFixed(2)}°E
                </span>
              </td>
              <td>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>{hz.radius} km</span>
              </td>
              <td>
                <span className={`badge ${
                  hz.severity === 'HIGH'     ? 'badge-red'   :
                  hz.severity === 'MODERATE' ? 'badge-amber' : 'badge-green'
                }`}>
                  {hz.severity}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Slope distribution bars ────────────────────────────── */
function SlopeDistribution({ data }) {
  const max = Math.max(...data.map(d => d.area));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {data.map(({ range, area }) => (
        <div key={range} style={{ display: 'grid', gridTemplateColumns: '48px 1fr 40px', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-dim)', textAlign: 'right' }}>
            {range}
          </span>
          <div className="prog-bar-track" style={{ height: 8 }}>
            <div className="prog-bar-fill" style={{
              width: `${(area / max) * 100}%`,
              background: range.includes('>30') ? 'var(--red)'
                        : range.includes('20') ? 'var(--amber)'
                        : range.includes('10') ? '#D9A441'
                        : 'var(--green)',
            }} />
          </div>
          <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)', textAlign: 'right' }}>
            {area}%
          </span>
        </div>
      ))}
    </div>
  );
}

export default function HazardAssessment() {
  const [demId,    setDemId]    = useState(null);
  const [shadowId, setShadowId] = useState(null);
  const [tab,      setTab]      = useState('dem');
  const { generate, data, loading, error } = useHazardMap();

  const onUpload = (result) => {
    if (tab === 'dem')    setDemId(result.file_id);
    if (tab === 'shadow') setShadowId(result.file_id);
  };

  const run = () => {
    if (demId) generate({ demFileId: demId, shadowFileId: shadowId || '' });
  };

  const displayData = data || {
    hazard_score:         HAZARD_DATA.severityScore / 100,
    high_risk_area_pct:   (HAZARD_DATA.highRisk    / 56) * 100,
    medium_risk_area_pct: (HAZARD_DATA.moderateRisk / 56) * 100,
    low_risk_area_pct:    (HAZARD_DATA.lowRisk      / 56) * 100,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* ── Page Header ─────────────────────────────────── */}
      <div className="page-header">
        <div>
          <div className="page-title">Hazard Assessment</div>
          <div className="page-subtitle">SLOPE CLASSIFICATION · TRI ROUGHNESS · PERMANENT SHADOW ZONES</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {error && (
            <span style={{ fontSize: 11, color: 'var(--red)', fontFamily: 'JetBrains Mono, monospace', display: 'flex', alignItems: 'center', gap: 5 }}>
              <AlertCircle size={12} /> {error}
            </span>
          )}
          <button className="btn btn-primary" onClick={run} disabled={!demId || loading}>
            {loading ? <Loader size={12} className="animate-spin" /> : <AlertTriangle size={12} />}
            Generate Hazard Map
          </button>
        </div>
      </div>

      <div className="page-body flex-1 overflow-y-auto" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* ── Section: Upload ───────────────────────────── */}
        <SectionHead label="Upload Raster Datasets" />

        {/* Tab strip */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {[
            { id: 'dem',    label: 'DEM Raster',    suffix: '(required)', color: 'var(--orange)', loaded: !!demId    },
            { id: 'shadow', label: 'Shadow Mask',   suffix: '(optional)', color: '#4A90D9',       loaded: !!shadowId },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 16px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid',
                borderColor: tab === t.id ? t.color : 'var(--border)',
                background: tab === t.id ? `${t.color}14` : 'var(--bg-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s',
                fontFamily: 'Inter, sans-serif',
                fontSize: 11, fontWeight: 600,
                color: tab === t.id ? t.color : 'var(--text-muted)',
              }}
            >
              {t.label}
              <span style={{ fontSize: 9, opacity: 0.7 }}>{t.suffix}</span>
              {t.loaded && <span style={{ color: 'var(--green)', fontSize: 10 }}>✓</span>}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 4 }}>
          <div className="sci-card">
            <div className="sci-card-header">
              <span className="sci-card-title">
                {tab === 'dem' ? 'Digital Elevation Model' : 'PSR / Shadow Mask'}
              </span>
              {(tab === 'dem' ? demId : shadowId)
                ? <span className="badge badge-green">✓ LOADED</span>
                : <span className="badge badge-silver">{tab === 'shadow' ? 'OPTIONAL' : 'PENDING'}</span>
              }
            </div>
            <div className="sci-card-body">
              <DataUpload onUpload={onUpload} acceptedTypes=".tif,.tiff,.geotiff" />
            </div>
          </div>

          {/* Static info panel */}
          <div className="sci-card">
            <div className="sci-card-header">
              <span className="sci-card-title">Hazard Classification Method</span>
            </div>
            <div className="sci-card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Slope component',    weight: '55%', color: 'var(--orange)', desc: 'Horn\'s slope > 7° = hazardous' },
                  { label: 'TRI Roughness',       weight: '30%', color: 'var(--amber)',  desc: 'Surface irregularity index' },
                  { label: 'Shadow mask',         weight: '15%', color: '#4A90D9',       desc: 'PSR = low illumination risk', opt: true },
                ].map(item => (
                  <div key={item.label} style={{ paddingBottom: 10, borderBottom: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
                        {item.label}
                        {item.opt && <span style={{ fontSize: 9, color: 'var(--text-dim)', marginLeft: 4 }}>(optional)</span>}
                      </span>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700, color: item.color }}>
                        {item.weight}
                      </span>
                    </div>
                    <div style={{ height: 4, background: 'var(--border-light)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: item.color, width: item.weight, borderRadius: 2 }} />
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'Inter, sans-serif', marginTop: 3 }}>{item.desc}</div>
                  </div>
                ))}

                <div style={{
                  background: 'var(--bg-tertiary)', borderRadius: 6, padding: '8px 12px',
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 10, lineHeight: 1.8,
                  color: 'var(--text-secondary)', border: '1px solid var(--border-light)',
                }}>
                  <div style={{ color: 'var(--text-dim)', fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>Score formula</div>
                  Hazard = <span style={{ color: 'var(--orange)' }}>0.55×slope</span>
                  {' + '}<span style={{ color: 'var(--amber)' }}>0.30×TRI</span>
                  {' + '}<span style={{ color: '#4A90D9' }}>0.15×shadow</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Section: Hazard Results ───────────────────── */}
        <SectionHead label="Hazard Analysis Results" />

        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16, marginBottom: 16 }}>
          {/* Gauge */}
          <div className="sci-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--text-dim)', fontFamily: 'Inter, sans-serif', marginBottom: 8, alignSelf: 'flex-start' }}>
              Overall Hazard Index
            </div>
            <HazardGauge score={displayData.hazard_score} />
          </div>

          {/* Risk breakdown */}
          <div className="sci-card">
            <div className="sci-card-header">
              <span className="sci-card-title">Risk Area Distribution</span>
            </div>
            <div className="sci-card-body">
              <RiskDistributionBar
                high={displayData.high_risk_area_pct}
                medium={displayData.medium_risk_area_pct}
                low={displayData.low_risk_area_pct}
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 20 }}>
                {[
                  { label: 'High Risk',  pct: displayData.high_risk_area_pct,   count: HAZARD_DATA.highRisk,     color: 'var(--red)'   },
                  { label: 'Moderate',   pct: displayData.medium_risk_area_pct, count: HAZARD_DATA.moderateRisk, color: 'var(--amber)' },
                  { label: 'Low Risk',   pct: displayData.low_risk_area_pct,    count: HAZARD_DATA.lowRisk,      color: 'var(--green)' },
                ].map(({ label, pct, count, color }) => (
                  <div key={label} style={{ background: 'var(--bg-tertiary)', borderRadius: 6, padding: '12px 14px', border: '1px solid var(--border-light)' }}>
                    <div style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'Inter, sans-serif', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 22, fontWeight: 700, color, lineHeight: 1 }}>
                      {pct?.toFixed(1)}<span style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 400 }}>%</span>
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'Inter, sans-serif', marginTop: 2 }}>
                      {count} zones
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'Inter, sans-serif', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Slope angle distribution
                </div>
                <SlopeDistribution data={HAZARD_DATA.slopeDistribution} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Section: Hazard Zones ─────────────────────── */}
        <SectionHead label="Catalogued Hazard Zones" />
        <div className="sci-card" style={{ marginBottom: 4 }}>
          <div className="sci-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <AlertTriangle size={12} style={{ color: 'var(--red)' }} />
              <span className="sci-card-title">Hazard Zone Registry</span>
            </div>
            <span style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>
              {HAZARD_DATA.hazardZones.length} zones · {HAZARD_DATA.cratersDetected} craters detected
            </span>
          </div>
          <HazardZoneTable zones={HAZARD_DATA.hazardZones} />
        </div>

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 0', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>
            <Loader size={14} className="animate-spin" style={{ color: 'var(--amber)' }} />
            CLASSIFYING HAZARD PIXELS…
          </div>
        )}
      </div>
    </div>
  );
}
