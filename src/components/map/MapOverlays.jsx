import React from 'react';
import { CircleMarker, Polyline, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';

/**
 * MapOverlays
 * ────────────
 * Composable overlay layer components rendered inside a <MapContainer>.
 * Each component is independently optional so the parent can selectively
 * mount only what it needs.
 *
 * Exports:
 *   LandingSiteOverlay  — renders candidate landing-site markers
 *   IceRegionOverlay    — renders ice-candidate circle markers
 *   HazardOverlay       — renders hazard-zone circles
 *   RoverPathOverlay    — renders the planned route polyline + waypoints
 */

// ── Safe Landing Sites ─────────────────────────────────────────────────────
export function LandingSiteOverlay({ sites = [], visible = true }) {
  if (!visible || !sites.length) return null;

  return sites.map((site, i) => {
    const pos = site.latitude != null
      ? [site.latitude, site.longitude]
      : [site.lat, site.lon];

    const score = site.suitability_score ?? 1;
    const radius = 6 + score * 4;
    const color  = score > 0.75 ? '#7AA874' : score > 0.5 ? '#D9A441' : '#8A96A4';

    return (
      <CircleMarker
        key={`ls-${i}`}
        center={pos}
        radius={radius}
        pathOptions={{ color, fillColor: color, fillOpacity: 0.55, weight: 2 }}
      >
        <Tooltip direction="top" permanent={false}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>
            <strong>Site {site.id ?? i + 1}</strong><br />
            Slope: {site.slope_deg?.toFixed(1) ?? '—'}° ·
            Score: {site.suitability_score != null ? (site.suitability_score * 100).toFixed(0) + '%' : '—'}
          </div>
        </Tooltip>
      </CircleMarker>
    );
  });
}

// ── Ice Candidate Regions ──────────────────────────────────────────────────
export function IceRegionOverlay({ regions = [], visible = true }) {
  if (!visible || !regions.length) return null;

  return regions.map((r, i) => {
    const pos = r.latitude != null
      ? [r.latitude, r.longitude]
      : [r.lat, r.lon];
    const iceScore = r.ice_score ?? r.prob / 100 ?? 0.5;
    const radius   = 5 + iceScore * 6;

    return (
      <CircleMarker
        key={`ice-${i}`}
        center={pos}
        radius={radius}
        pathOptions={{
          color: '#60A5FA',
          fillColor: '#60A5FA',
          fillOpacity: 0.35 + iceScore * 0.35,
          weight: 1.5,
        }}
      >
        <Tooltip>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>
            <strong>Ice Region {r.rank ?? i + 1}</strong><br />
            P(ice): {(iceScore * 100).toFixed(1)}%
          </div>
        </Tooltip>
      </CircleMarker>
    );
  });
}

// ── Hazard Zones ───────────────────────────────────────────────────────────
export function HazardOverlay({ zones = [], visible = true }) {
  if (!visible || !zones.length) return null;

  const severityColor = (s) =>
    s === 'HIGH' || s === 'high' ? '#C24D4D'
    : s === 'MODERATE' || s === 'medium' ? '#D9A441'
    : '#7AA874';

  return zones.map((z, i) => {
    const pos    = [z.lat ?? z.latitude, z.lon ?? z.longitude];
    const radius = (z.radius ?? 0.5) * 8;

    return (
      <CircleMarker
        key={`hz-${i}`}
        center={pos}
        radius={radius}
        pathOptions={{
          color: severityColor(z.severity),
          fillColor: severityColor(z.severity),
          fillOpacity: 0.18,
          weight: 1.5,
          dashArray: '4 3',
        }}
      >
        <Tooltip>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>
            <strong>{z.id ?? `HZ-${i + 1}`}</strong> — {z.type ?? 'Hazard'}<br />
            Severity: {z.severity ?? '—'}
          </div>
        </Tooltip>
      </CircleMarker>
    );
  });
}

// ── Rover Path ─────────────────────────────────────────────────────────────
export function RoverPathOverlay({ waypoints = [], visible = true }) {
  if (!visible || waypoints.length < 2) return null;

  const positions = waypoints.map((w) => [
    w.latitude ?? w.lat,
    w.longitude ?? w.lon,
  ]);

  return (
    <>
      {/* Path line */}
      <Polyline
        positions={positions}
        pathOptions={{
          color: '#F47C20',
          weight: 2,
          dashArray: '6 4',
          opacity: 0.85,
        }}
      />

      {/* Start marker */}
      <CircleMarker
        center={positions[0]}
        radius={6}
        pathOptions={{ color: '#7AA874', fillColor: '#7AA874', fillOpacity: 0.9, weight: 2 }}
      >
        <Tooltip permanent direction="top">
          <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}>START</span>
        </Tooltip>
      </CircleMarker>

      {/* End marker */}
      <CircleMarker
        center={positions[positions.length - 1]}
        radius={6}
        pathOptions={{ color: '#C24D4D', fillColor: '#C24D4D', fillOpacity: 0.9, weight: 2 }}
      >
        <Tooltip permanent direction="top">
          <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}>GOAL</span>
        </Tooltip>
      </CircleMarker>
    </>
  );
}
