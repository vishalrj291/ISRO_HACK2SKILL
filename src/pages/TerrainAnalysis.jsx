import React, { useState } from 'react';
import { Loader, Mountain, AlertCircle, TrendingUp, Layers, MapPin, Activity } from 'lucide-react';
import DataUpload from '../components/upload/DataUpload';
import ElevationProfile from '../components/charts/ElevationProfile';
import { useAnalyseDEM, useDetectLandingSites } from '../data/hooks/useApi';
import { TERRAIN_LAYERS } from '../data/missionData';

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

function StatCard({ label, value, unit, color = 'var(--text-primary)', sub }) {
  return (
    <div className="sci-card" style={{ padding: '14px 16px' }}>
      <div style={{
        fontSize: 9, fontWeight: 700, letterSpacing: '0.10em',
        textTransform: 'uppercase', color: 'var(--text-dim)',
        fontFamily: 'Inter, sans-serif', marginBottom: 6,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 24, fontWeight: 700, color, lineHeight: 1,
        letterSpacing: '-0.02em',
      }}>
        {value ?? '—'}
        {unit && (
          <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-dim)', marginLeft: 4 }}>
            {unit}
          </span>
        )}
      </div>
      {sub && (
        <div style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'Inter, sans-serif', marginTop: 3 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function RiskBadge({ score }) {
  if (score == null) return null;
  const cls = score < 7 ? 'badge-green' : score < 15 ? 'badge-amber' : 'badge-red';
  const label = score < 7 ? 'SAFE' : score < 15 ? 'MODERATE' : 'HIGH SLOPE';
  return <span className={`badge ${cls}`}>{label}</span>;
}

/* ─── HeatMap mini-visual using SVG ─────────────────────── */
function GridVisual({ grid, title, colorFn }) {
  if (!grid?.data) return (
    <div style={{
      height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-tertiary)', borderRadius: 6,
      fontSize: 11, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace',
    }}>
      NO DATA — RUN ANALYSIS
    </div>
  );

  const rows = grid.data.length;
  const cols = grid.data[0]?.length || 1;
  const cellW = 200 / cols;
  const cellH = 140 / rows;
  const max = Math.max(...grid.data.flat().filter(v => v != null));

  return (
    <div>
      <div style={{
        fontSize: 10, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace',
        marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em',
      }}>
        {title} · {rows}×{cols}
      </div>
      <svg viewBox={`0 0 200 140`} style={{ width: '100%', height: 160, borderRadius: 6 }}>
        {grid.data.map((row, r) =>
          row.map((v, c) => (
            <rect
              key={`${r}-${c}`}
              x={c * cellW} y={r * cellH}
              width={cellW} height={cellH}
              fill={v == null ? '#1a2030' : colorFn(v / max)}
            />
          ))
        )}
      </svg>
    </div>
  );
}

function slopeColor(t) {
  if (t < 0.2) return `hsl(220,80%,${20 + t * 80}%)`;
  if (t < 0.5) return `hsl(${160 - t * 100},70%,45%)`;
  return `hsl(${10 + t * 20},80%,${50 - t * 20}%)`;
}

function triColor(t) {
  return `hsl(${270 - t * 220},${60 + t * 30}%,${60 - t * 30}%)`;
}

export default function TerrainAnalysis() {
  const [uploadedFile, setUploaded] = useState(null);
  const { analyse, data: demData, loading: demLoading, error: demError } = useAnalyseDEM();
  const { detect, data: siteData, loading: siteLoading, error: siteError } = useDetectLandingSites();

  const onUpload = (result) => {
    setUploaded(result);
    analyse(result.file_id);
  };

  const runLandingSites = () => {
    if (uploadedFile) detect({ demFileId: uploadedFile.file_id });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* ── Page Header ─────────────────────────────────── */}
      <div className="page-header">
        <div>
          <div className="page-title">Terrain Analysis</div>
          <div className="page-subtitle">LRO LOLA DEM · HORN'S SLOPE · TRI · SAFE-AREA DETECTION</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {demError && (
            <span style={{ fontSize: 11, color: 'var(--red)', fontFamily: 'JetBrains Mono, monospace', display: 'flex', alignItems: 'center', gap: 5 }}>
              <AlertCircle size={12} /> {demError}
            </span>
          )}
          {uploadedFile && (
            <button className="btn btn-primary" onClick={runLandingSites} disabled={siteLoading}>
              {siteLoading ? <Loader size={12} className="animate-spin" /> : <MapPin size={12} />}
              Detect Landing Sites
            </button>
          )}
        </div>
      </div>

      <div className="page-body flex-1 overflow-y-auto" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* ── Section: Upload DEM ───────────────────────── */}
        <SectionHead label="Upload DEM Raster" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 4 }}>
          {/* Upload zone */}
          <div className="sci-card">
            <div className="sci-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <Layers size={12} style={{ color: 'var(--orange)' }} />
                <span className="sci-card-title">LRO LOLA DEM — GeoTIFF</span>
              </div>
              {uploadedFile && (
                <span className="badge badge-green">✓ LOADED</span>
              )}
            </div>
            <div className="sci-card-body">
              <DataUpload onUpload={onUpload} acceptedTypes=".tif,.tiff,.geotiff" />
            </div>
          </div>

          {/* File info */}
          <div className="sci-card">
            <div className="sci-card-header">
              <span className="sci-card-title">Raster Metadata</span>
              {demLoading && <Loader size={11} className="animate-spin" style={{ color: 'var(--orange)' }} />}
            </div>
            <div className="sci-card-body">
              {uploadedFile ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { k: 'File',   v: uploadedFile.original_name },
                    { k: 'Size',   v: `${(uploadedFile.size_bytes / 1e6).toFixed(1)} MB` },
                    { k: 'Dims',   v: `${uploadedFile.rows} × ${uploadedFile.cols} px` },
                    { k: 'Bands',  v: uploadedFile.bands },
                    { k: 'Driver', v: uploadedFile.driver },
                    { k: 'CRS',    v: uploadedFile.crs ?? 'N/A' },
                    { k: 'NoData', v: uploadedFile.nodata ?? 'None' },
                  ].map(({ k, v }) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--border-light)' }}>
                      <span style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</span>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-primary)', maxWidth: 200, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ height: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Mountain size={28} style={{ color: 'var(--border)' }} />
                  <span style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>
                    AWAITING DEM UPLOAD
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Section: DEM Statistics ───────────────────── */}
        {demData && (
          <>
            <SectionHead label="Terrain Statistics" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 4 }}>
              <StatCard label="Avg Slope"     value={demData.average_slope_deg?.toFixed(2)}    unit="°"   color={demData.average_slope_deg < 7 ? 'var(--green)' : 'var(--amber)'} sub="Horn's method" />
              <StatCard label="Max Slope"     value={demData.maximum_slope_deg?.toFixed(1)}     unit="°"   color="var(--red)"    sub="Steepest pixel" />
              <StatCard label="Avg Elevation" value={demData.average_elevation_m?.toFixed(0)}   unit="m"   color="var(--text-primary)" sub="Mean surface altitude" />
              <StatCard label="Elev. Range"   value={demData.elevation_range_m?.toFixed(0)}     unit="m"   color="var(--orange)" sub="Max – Min" />
              <StatCard label="Safe Area"     value={demData.safe_area_percent?.toFixed(1)}     unit="%"   color="var(--green)"  sub="Slope < 7°" />
              <StatCard label="Avg Roughness" value={demData.average_roughness_m?.toFixed(3)}   unit="m"   color="var(--text-primary)" sub="TRI RMS" />
              <StatCard label="Min Elevation" value={demData.min_elevation_m?.toFixed(0)}       unit="m"   color="var(--text-muted)" />
              <StatCard label="Max Elevation" value={demData.max_elevation_m?.toFixed(0)}       unit="m"   color="var(--text-muted)" />
            </div>

            {/* ── Heatmaps ─────────────────────────────── */}
            <SectionHead label="Computed Raster Layers" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 4 }}>
              <div className="sci-card">
                <div className="sci-card-header">
                  <span className="sci-card-title">Slope Map — degrees</span>
                  <span className="badge badge-orange">COMPUTED</span>
                </div>
                <div className="sci-card-body">
                  <GridVisual grid={demData.slope_grid} title="SLOPE" colorFn={slopeColor} />
                </div>
              </div>
              <div className="sci-card">
                <div className="sci-card-header">
                  <span className="sci-card-title">Terrain Ruggedness Index</span>
                  <span className="badge badge-orange">COMPUTED</span>
                </div>
                <div className="sci-card-body">
                  <GridVisual grid={demData.tri_grid} title="TRI" colorFn={triColor} />
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── Section: Landing Site Results ─────────────── */}
        {siteData && (
          <>
            <SectionHead label="Safe Landing Site Candidates" />
            <div className="sci-card" style={{ marginBottom: 4 }}>
              <div className="sci-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <MapPin size={12} style={{ color: 'var(--orange)' }} />
                  <span className="sci-card-title">Top Candidates</span>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>
                    Safe area: <strong style={{ color: 'var(--green)' }}>{siteData.safe_area_percent?.toFixed(1)}%</strong>
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>
                    {siteData.total_safe_pixels?.toLocaleString()} safe px
                  </span>
                </div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Site</th>
                      <th>Latitude</th>
                      <th>Longitude</th>
                      <th>Slope</th>
                      <th>Roughness</th>
                      <th>Illumination</th>
                      <th>Suitability</th>
                      <th>Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {siteData.candidates?.map(site => (
                      <tr key={site.id}>
                        <td>
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 600, color: 'var(--orange)' }}>
                            LS-{site.id.toString().padStart(2, '0')}
                          </span>
                        </td>
                        <td><span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>{site.latitude?.toFixed(4)}°</span></td>
                        <td><span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>{site.longitude?.toFixed(4)}°</span></td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>{site.slope_deg?.toFixed(2)}°</span>
                            <div className="prog-bar-track" style={{ width: 40 }}>
                              <div className="prog-bar-fill" style={{ width: `${Math.min(site.slope_deg / 15 * 100, 100)}%`, background: site.slope_deg < 7 ? 'var(--green)' : 'var(--amber)' }} />
                            </div>
                          </div>
                        </td>
                        <td><span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>{site.roughness_m?.toFixed(3)} m</span></td>
                        <td>
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>
                            {site.illumination != null ? `${(site.illumination * 100).toFixed(1)}%` : '—'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700, color: site.suitability_score >= 0.8 ? 'var(--green)' : site.suitability_score >= 0.6 ? 'var(--amber)' : 'var(--red)' }}>
                              {(site.suitability_score * 100).toFixed(0)}%
                            </span>
                            <div className="prog-bar-track" style={{ width: 44 }}>
                              <div className="prog-bar-fill" style={{ width: `${site.suitability_score * 100}%`, background: site.suitability_score >= 0.8 ? 'var(--green)' : site.suitability_score >= 0.6 ? 'var(--amber)' : 'var(--red)' }} />
                            </div>
                          </div>
                        </td>
                        <td><RiskBadge score={site.slope_deg} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── Loading + error states ───────────────────── */}
        {demLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 0', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>
            <Loader size={14} className="animate-spin" style={{ color: 'var(--orange)' }} />
            COMPUTING SLOPE · TRI · STATISTICS…
          </div>
        )}
        {siteError && (
          <div style={{ display: 'flex', gap: 8, padding: 12, background: 'var(--red-bg)', border: '1px solid rgba(185,74,72,0.3)', borderRadius: 6, color: 'var(--red)', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>
            <AlertCircle size={14} style={{ flexShrink: 0 }} /> {siteError}
          </div>
        )}

      </div>
    </div>
  );
}
