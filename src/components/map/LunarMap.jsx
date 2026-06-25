import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, LayersControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MISSION_META, HAZARD_DATA, NAVIGATION_DATA } from '../../data/missionData';

// Fix Leaflet default icon issue with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const CENTER = [MISSION_META.lat, MISSION_META.lon];

// Custom SVG marker factories
function makeIcon(color, label, size = 10) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size + 8}" height="${size + 8}">
      <circle cx="${(size + 8) / 2}" cy="${(size + 8) / 2}" r="${size / 2}" 
        fill="${color}" stroke="white" stroke-width="1.5" opacity="0.9"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [size + 8, size + 8],
    iconAnchor: [(size + 8) / 2, (size + 8) / 2],
    popupAnchor: [0, -(size + 8) / 2],
  });
}

const landingIcon  = makeIcon('#7AA874', 'LS', 12);
const iceIcon      = makeIcon('#60A5FA', 'IC', 10);
const hazardIcon   = makeIcon('#C24D4D', 'HZ', 10);
const roverIcon    = makeIcon('#F47C20', 'RV', 14);

// Layer panel floating inside map — shown only when showLayerPanel=true
function LayerPanel({ layers, toggleLayer }) {
  return (
    <div style={{
      position: 'absolute', top: 12, right: 12, zIndex: 1000,
      background: 'rgba(255,255,255,0.93)',
      border: '1px solid rgba(216,221,230,0.9)',
      borderRadius: 8,
      padding: '10px 14px',
      minWidth: 172,
      backdropFilter: 'blur(6px)',
      boxShadow: '0 4px 8px rgba(16,24,40,0.08)',
    }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 8, color: 'var(--text-dim)',
        letterSpacing: '0.12em', marginBottom: 8,
        textTransform: 'uppercase', fontWeight: 700,
        fontFamily: 'Inter, sans-serif',
      }}>
        GIS LAYERS
      </div>
      {layers.map((layer) => (
        <label key={layer.id} style={{
          display: 'flex', alignItems: 'center', gap: 7,
          marginBottom: 5, cursor: 'pointer',
        }}>
          <input
            type="checkbox"
            checked={layer.active}
            onChange={() => toggleLayer(layer.id)}
            style={{ accentColor: 'var(--orange)', cursor: 'pointer' }}
          />
          <span style={{
            fontSize: 11,
            fontFamily: 'Inter, sans-serif',
            color: layer.active ? 'var(--text-secondary)' : 'var(--text-dim)',
            fontWeight: layer.active ? 500 : 400,
          }}>
            {layer.label}
          </span>
          {layer.color && (
            <span style={{
              width: 7, height: 7, borderRadius: 2,
              background: layer.active ? layer.color : 'var(--border)',
              flexShrink: 0, marginLeft: 'auto',
            }} />
          )}
        </label>
      ))}
    </div>
  );
}

export default function LunarMap({
  landingSites    = [],
  iceRegions      = [],
  roverPath       = [],
  height          = 480,
  showLayerPanel  = true,   // Set false to suppress internal panel (Dashboard uses its own)
}) {
  const [layerState, setLayerState] = useState([
    { id: 'landing',  label: 'Safe Landing Sites', active: true,  color: '#7AA874' },
    { id: 'ice',      label: 'Ice-Rich Regions',   active: true,  color: '#60A5FA' },
    { id: 'hazard',   label: 'Hazard Zones',        active: true,  color: '#C24D4D' },
    { id: 'path',     label: 'Rover Path',          active: true,  color: '#F47C20' },
  ]);

  const toggleLayer = (id) =>
    setLayerState((prev) =>
      prev.map((l) => (l.id === id ? { ...l, active: !l.active } : l))
    );

  const isActive = (id) => layerState.find((l) => l.id === id)?.active;

  // Merge backend data with static hazard zones for the demo
  const displayHazards = HAZARD_DATA.hazardZones;

  // Rover path: prefer backend result, fallback to static waypoints
  const pathCoords =
    roverPath.length > 0
      ? roverPath
      : NAVIGATION_DATA.waypoints.map((w) => [w.lat, w.lon]);

  // Landing sites: prefer backend result
  const displayLanding =
    landingSites.length > 0
      ? landingSites.map((s) => ({
          lat: s.latitude, lon: s.longitude,
          label: `Site ${s.id}`,
          sublabel: `Slope: ${s.slope_deg?.toFixed(1)}° | Score: ${(s.suitability_score * 100).toFixed(0)}%`,
        }))
      : [];

  // Ice regions: prefer backend result
  const displayIce =
    iceRegions.length > 0
      ? iceRegions.map((r) => ({
          lat: r.latitude, lon: r.longitude,
          label: `Ice Candidate ${r.rank}`,
          sublabel: `Score: ${(r.ice_score * 100).toFixed(1)}%`,
        }))
      : [];

  return (
    <div style={{
      position: 'relative', height,
      borderRadius: 8,
      overflow: 'hidden',
      border: '1px solid var(--border)',
    }}>
      <MapContainer
        center={CENTER}
        zoom={5}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        {/* Base tile — USGS Moon terrain tiles */}
        <TileLayer
          url="https://s3.amazonaws.com/opmbuilder/301_moon/tiles/4/2/{z}/{x}/{y}.png"
          attribution='LROC WAC · USGS'
          errorTileUrl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        />

        {/* Zoom control re-placed to bottom-left */}
        <div className="leaflet-bottom leaflet-left" style={{ marginBottom: 8, marginLeft: 8 }} />

        {/* ── Safe Landing Sites ── */}
        {isActive('landing') && displayLanding.map((site, i) => (
          <Marker key={`ls-${i}`} position={[site.lat, site.lon]} icon={landingIcon}>
            <Popup>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>
                <strong>{site.label}</strong><br />
                {site.sublabel}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* ── Ice Candidate Regions ── */}
        {isActive('ice') && displayIce.map((ice, i) => (
          <CircleMarker
            key={`ic-${i}`}
            center={[ice.lat, ice.lon]}
            radius={6}
            pathOptions={{ color: '#60A5FA', fillColor: '#60A5FA', fillOpacity: 0.5, weight: 1.5 }}
          >
            <Popup>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>
                <strong>{ice.label}</strong><br />{ice.sublabel}
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* ── Hazard Zones ── */}
        {isActive('hazard') && displayHazards.map((hz) => (
          <CircleMarker
            key={hz.id}
            center={[hz.lat, hz.lon]}
            radius={hz.radius * 6}
            pathOptions={{
              color: hz.severity === 'HIGH' ? '#C24D4D' : hz.severity === 'MODERATE' ? '#D9A441' : '#7AA874',
              fillOpacity: 0.2,
              weight: 1.5,
            }}
          >
            <Popup>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>
                <strong>{hz.id}</strong> — {hz.type}<br />Severity: {hz.severity}
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* ── Rover Path ── */}
        {isActive('path') && pathCoords.length > 1 && (
          <Polyline
            positions={pathCoords}
            pathOptions={{ color: '#F47C20', weight: 2, dashArray: '5 3', opacity: 0.85 }}
          />
        )}

        {/* ── Rover current position ── */}
        <Marker
          position={[MISSION_META.roverPosition.lat, MISSION_META.roverPosition.lon]}
          icon={roverIcon}
        >
          <Popup>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>
              <strong>ROVER POSITION</strong><br />
              LAT: {MISSION_META.roverPosition.lat}°<br />
              LON: {MISSION_META.roverPosition.lon}°
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Floating layer control — only rendered when showLayerPanel is true */}
      {showLayerPanel && <LayerPanel layers={layerState} toggleLayer={toggleLayer} />}

      {/* Map credits overlay */}
      <div style={{
        position: 'absolute', bottom: 6, left: 8, zIndex: 1000,
        fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
        color: 'rgba(255,255,255,0.35)',
        letterSpacing: '0.05em',
        pointerEvents: 'none',
      }}>
        LRO WAC · LOLA DEM · Mini-RF · DIVINER
      </div>
    </div>
  );
}
