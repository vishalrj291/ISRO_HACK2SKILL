import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import { TERRAIN_LAYERS } from '../data/missionData';

export default function DataLayers() {
  const [activeLayer, setActive] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="page-header">
        <div>
          <div className="page-title">Data Layers</div>
          <div className="page-subtitle">RASTER DATASET CATALOGUE · LRO · DIVINER · MINI-RF</div>
        </div>
      </div>
      <div className="page-body flex-1 overflow-y-auto" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {TERRAIN_LAYERS.map((layer) => (
          <div
            key={layer.id}
            className="sci-card terrain-thumb"
            style={{ border: activeLayer === layer.id ? '1px solid var(--orange)' : '1px solid var(--border)', cursor: 'pointer' }}
            onClick={() => setActive(layer.id === activeLayer ? null : layer.id)}
          >
            <div className="sci-card-header">
              <span className="sci-card-title">{layer.label}</span>
              <span className="badge badge-silver" style={{ fontSize: 9 }}>{layer.source}</span>
            </div>
            <div className="sci-card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <div style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>UNIT</div>
                  <div style={{ fontSize: 13, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>{layer.unit}</div>
                </div>
                <div>
                  <div style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>RANGE</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{layer.range}</div>
                </div>
              </div>
              {activeLayer === layer.id && (
                <div style={{ marginTop: 10, padding: '8px 10px', background: 'rgba(244,124,32,0.08)', border: '1px solid rgba(244,124,32,0.2)', borderRadius: 3, fontSize: 10, color: 'var(--orange)', fontFamily: 'JetBrains Mono, monospace' }}>
                  LAYER SELECTED — Upload a GeoTIFF on the Upload Dataset page to activate this layer.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
