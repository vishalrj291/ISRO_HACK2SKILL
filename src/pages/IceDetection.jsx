import React, { useState } from 'react';
import { Loader, Snowflake, AlertCircle, Radio, Thermometer, Sun, Navigation, CheckCircle } from 'lucide-react';
import DataUpload from '../components/upload/DataUpload';
import IceProbabilityChart from '../components/charts/IceProbabilityChart';
import FeatureImportanceChart from '../components/charts/FeatureImportanceChart';
import ConfidenceDistribution from '../components/charts/ConfidenceDistribution';
import { useIceProbability } from '../data/hooks/useApi';
import { ICE_DETECTION } from '../data/missionData';

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

/* ─── Data source config ─────────────────────────────────── */
const SOURCE_TYPES = [
  {
    id:    'radar',
    label: 'Mini-RF Radar',
    sub:   'CPR · Circular Polarisation Ratio',
    icon:  Radio,
    color: '#7AA874',
    desc:  'Mini-RF synthetic aperture radar CPR data from Chandrayaan-1 / LRO. Key indicator of ice in permanently shadowed regions.',
    weight: 0.40,
  },
  {
    id:    'psr',
    label: 'PSR Mask',
    sub:   'Permanently Shadowed Regions',
    icon:  Navigation,
    color: '#4A90D9',
    desc:  'Binary or probability mask of permanently shadowed regions derived from LROC illumination modeling.',
    weight: 0.30,
  },
  {
    id:    'temperature',
    label: 'Diviner Temperature',
    sub:   'Thermal Infrared · 7.5–400 μm',
    icon:  Thermometer,
    color: '#C24D4D',
    desc:  'Lunar surface brightness temperature from the Diviner Lunar Radiometer. PSR temperatures < 110 K enable water ice stability.',
    weight: 0.20,
  },
  {
    id:    'illumination',
    label: 'Illumination Map',
    sub:   'Annual Solar Illumination Fraction',
    icon:  Sun,
    color: '#F5C542',
    desc:  'Average solar illumination derived from LROC WAC temporal mosaics. Low values correlate with potential ice preservation.',
    weight: 0.10,
  },
];

function WeightBar({ weight }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div className="prog-bar-track" style={{ flex: 1 }}>
        <div className="prog-bar-fill" style={{ width: `${weight * 100}%`, background: '#4A90D9' }} />
      </div>
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-muted)', width: 32, textAlign: 'right' }}>
        {(weight * 100).toFixed(0)}%
      </span>
    </div>
  );
}

export default function IceDetection() {
  const [uploads, setUploads]   = useState({});
  const [activeType, setActive] = useState('radar');
  const { compute, data, loading, error } = useIceProbability();

  const onUpload = (result) => {
    setUploads((prev) => ({ ...prev, [result.type ?? activeType]: result.file_id }));
  };

  const runIce = () => {
    compute({
      radarFileId:        uploads.radar        || '',
      temperatureFileId:  uploads.temperature  || '',
      psrFileId:          uploads.psr          || '',
      illuminationFileId: uploads.illumination || '',
    });
  };

  const uploadedCount = Object.keys(uploads).length;
  const activeSrc = SOURCE_TYPES.find(s => s.id === activeType);

  /* Merge API result with static fallback */
  const display = data || {
    average_ice_probability:  ICE_DETECTION.overallProbability,
    max_ice_score:            ICE_DETECTION.candidateTable?.[0]?.prob ?? 92,
    high_probability_area_pct: 18.4,
    top_candidate_regions:    [],
    component_weights:        Object.fromEntries(SOURCE_TYPES.map(s => [s.id, s.weight])),
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* ── Page Header ─────────────────────────────────── */}
      <div className="page-header">
        <div>
          <div className="page-title">Ice Detection</div>
          <div className="page-subtitle">MULTI-SOURCE COMPOSITE · RADAR · PSR · THERMAL · ILLUMINATION</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {error && (
            <span style={{ fontSize: 11, color: 'var(--red)', fontFamily: 'JetBrains Mono, monospace', display: 'flex', alignItems: 'center', gap: 5 }}>
              <AlertCircle size={12} /> {error}
            </span>
          )}
          <div style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>
            {uploadedCount}/4 sources
          </div>
          <button
            className="btn btn-primary"
            onClick={runIce}
            disabled={loading || uploadedCount === 0}
          >
            {loading ? <Loader size={12} className="animate-spin" /> : <Snowflake size={12} />}
            Compute Ice Probability
          </button>
        </div>
      </div>

      <div className="page-body flex-1 overflow-y-auto" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* ── Section: Data Sources ─────────────────────── */}
        <SectionHead label="Data Sources — Multi-Layer Upload" />

        {/* Source tab strip */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {SOURCE_TYPES.map(src => (
            <button
              key={src.id}
              onClick={() => setActive(src.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid',
                borderColor: activeType === src.id ? src.color : 'var(--border)',
                background: activeType === src.id ? `${src.color}14` : 'var(--bg-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s',
                fontFamily: 'Inter, sans-serif',
                fontSize: 11, fontWeight: 600,
                color: activeType === src.id ? src.color : 'var(--text-muted)',
              }}
            >
              <src.icon size={12} />
              {src.label}
              {uploads[src.id] && (
                <CheckCircle size={11} style={{ color: 'var(--green)', marginLeft: 2 }} />
              )}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 4 }}>
          {/* Upload panel */}
          <div className="sci-card">
            <div className="sci-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <activeSrc.icon size={12} style={{ color: activeSrc.color }} />
                <span className="sci-card-title">{activeSrc.label}</span>
              </div>
              {uploads[activeType]
                ? <span className="badge badge-green">✓ LOADED</span>
                : <span className="badge badge-silver">PENDING</span>
              }
            </div>
            <div className="sci-card-body">
              <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif', lineHeight: 1.6, marginBottom: 12 }}>
                {activeSrc.desc}
              </p>
              <DataUpload onUpload={onUpload} acceptedTypes=".tif,.tiff,.geotiff" />
            </div>
          </div>

          {/* Weight/composite info */}
          <div className="sci-card">
            <div className="sci-card-header">
              <span className="sci-card-title">Composite Formula &amp; Weights</span>
            </div>
            <div className="sci-card-body">
              {/* Formula */}
              <div style={{
                background: 'var(--bg-tertiary)', border: '1px solid var(--border-light)',
                borderRadius: 6, padding: '10px 14px', marginBottom: 14,
                fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                color: 'var(--text-secondary)', lineHeight: 1.8,
              }}>
                <div style={{ color: 'var(--text-dim)', marginBottom: 4, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Ice Score Formula</div>
                IceScore = <span style={{ color: '#7AA874' }}>0.40 × Radar</span>
                {' + '}<span style={{ color: '#4A90D9' }}>0.30 × PSR</span>
                {' + '}<span style={{ color: '#C24D4D' }}>0.20 × Temp</span>
                {' + '}<span style={{ color: '#F5C542' }}>0.10 × Illum</span>
              </div>

              {/* Source weights */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {SOURCE_TYPES.map(src => (
                  <div key={src.id}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <src.icon size={11} style={{ color: src.color }} />
                        <span style={{ fontSize: 11, fontFamily: 'Inter, sans-serif', color: 'var(--text-secondary)', fontWeight: 500 }}>
                          {src.label}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {uploads[src.id]
                          ? <span className="badge badge-green" style={{ fontSize: 8 }}>LOADED</span>
                          : <span className="badge badge-silver" style={{ fontSize: 8 }}>MISSING</span>
                        }
                      </div>
                    </div>
                    <WeightBar weight={display.component_weights?.[src.id] ?? src.weight} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Section: Results ──────────────────────────── */}
        <SectionHead label="Ice Probability Analysis" />

        {/* KPI cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
          <div className="sci-card" style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--text-dim)', fontFamily: 'Inter, sans-serif', marginBottom: 6 }}>
              Mean Ice Probability
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 30, fontWeight: 700, color: '#4A90D9', lineHeight: 1 }}>
              {display.average_ice_probability?.toFixed(1)}
              <span style={{ fontSize: 14, color: 'var(--text-dim)', fontWeight: 400, marginLeft: 3 }}>%</span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'Inter, sans-serif', marginTop: 3 }}>Across mapped region</div>
          </div>

          <div className="sci-card" style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--text-dim)', fontFamily: 'Inter, sans-serif', marginBottom: 6 }}>
              Peak Ice Score
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 30, fontWeight: 700, color: 'var(--green)', lineHeight: 1 }}>
              {display.max_ice_score?.toFixed(1)}
              <span style={{ fontSize: 14, color: 'var(--text-dim)', fontWeight: 400, marginLeft: 3 }}>%</span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'Inter, sans-serif', marginTop: 3 }}>Highest scoring pixel</div>
          </div>

          <div className="sci-card" style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--text-dim)', fontFamily: 'Inter, sans-serif', marginBottom: 6 }}>
              High-Prob. Area
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 30, fontWeight: 700, color: 'var(--amber)', lineHeight: 1 }}>
              {display.high_probability_area_pct?.toFixed(1)}
              <span style={{ fontSize: 14, color: 'var(--text-dim)', fontWeight: 400, marginLeft: 3 }}>%</span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'Inter, sans-serif', marginTop: 3 }}>Score &gt; 60%</div>
          </div>
        </div>

        {/* Charts grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 4 }}>
          <div className="sci-card">
            <div className="sci-card-header">
              <span className="sci-card-title">Ice Probability Trend · SOL</span>
            </div>
            <div className="sci-card-body" style={{ padding: '10px 8px 8px' }}>
              <IceProbabilityChart data={ICE_DETECTION.trend} height={200} />
            </div>
          </div>

          <div className="sci-card">
            <div className="sci-card-header">
              <span className="sci-card-title">Feature Importance — LunarIceNet-v2.1</span>
            </div>
            <div className="sci-card-body" style={{ padding: '10px 8px 8px' }}>
              <FeatureImportanceChart data={ICE_DETECTION.featureImportance} height={200} />
            </div>
          </div>
        </div>

        {/* Confidence distribution + candidate table */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginBottom: 4 }}>
          <div className="sci-card">
            <div className="sci-card-header">
              <span className="sci-card-title">Score Distribution</span>
            </div>
            <div className="sci-card-body" style={{ padding: '10px 8px 8px' }}>
              <ConfidenceDistribution data={ICE_DETECTION.confidenceDistribution} height={200} />
            </div>
          </div>

          <div className="sci-card">
            <div className="sci-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <Snowflake size={12} style={{ color: '#4A90D9' }} />
                <span className="sci-card-title">Top Candidate Regions</span>
              </div>
              <span style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>
                {ICE_DETECTION.candidateTable?.length ?? 0} total
              </span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Region Name</th>
                    <th>Lat / Lon</th>
                    <th>Ice Prob.</th>
                    <th>Area</th>
                    <th>Depth est.</th>
                    <th>Conf.</th>
                  </tr>
                </thead>
                <tbody>
                  {(display.top_candidate_regions?.length > 0
                    ? display.top_candidate_regions
                    : ICE_DETECTION.candidateTable
                  )?.slice(0, 7).map(r => (
                    <tr key={r.id ?? r.rank}>
                      <td>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 600, color: 'var(--orange)' }}>
                          {r.id ?? `#${r.rank}`}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>
                          {r.name ?? '—'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10 }}>
                          {(r.lat ?? r.latitude)?.toFixed(2)}°, {(r.lon ?? r.longitude)?.toFixed(1)}°
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700, color: '#4A90D9' }}>
                            {r.prob ?? (r.ice_score * 100)?.toFixed(1)}%
                          </span>
                          <div className="prog-bar-track" style={{ width: 40 }}>
                            <div className="prog-bar-fill" style={{ width: `${r.prob ?? (r.ice_score * 100)}%`, background: '#4A90D9' }} />
                          </div>
                        </div>
                      </td>
                      <td><span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>{r.area ?? '—'} km²</span></td>
                      <td><span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>~{r.depth ?? '—'} m</span></td>
                      <td>
                        <span className={`badge ${r.conf === 'HIGH' || r.conf === 'HIGH' ? 'badge-green' : r.conf === 'MED' ? 'badge-amber' : 'badge-silver'}`}>
                          {r.conf ?? '—'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 0', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>
            <Loader size={14} className="animate-spin" style={{ color: '#4A90D9' }} />
            COMPUTING ICE PROBABILITY COMPOSITE…
          </div>
        )}
      </div>
    </div>
  );
}
