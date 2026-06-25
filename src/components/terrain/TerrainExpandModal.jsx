import React from 'react';
import { X } from 'lucide-react';
import { GridCanvas } from './TerrainThumbnail';

/**
 * TerrainExpandModal
 * ──────────────────
 * Full-screen modal that renders a large-format heatmap of a terrain grid.
 * Shown when the user clicks a TerrainThumbnail.
 */
export default function TerrainExpandModal({ title, grid, colormap, unit, onClose }) {
  // Compute basic stats from grid
  let vmin = Infinity, vmax = -Infinity, validCount = 0;
  if (grid) {
    for (const row of grid.data) {
      for (const v of row) {
        if (v !== null && v !== undefined) {
          vmin = Math.min(vmin, v);
          vmax = Math.max(vmax, v);
          validCount++;
        }
      }
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box"
        style={{ width: '80vw', maxWidth: 900 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sci-card-header" style={{ borderRadius: '8px 8px 0 0' }}>
          <div>
            <span className="sci-card-title">{title}</span>
            {unit && (
              <span style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', marginLeft: 8 }}>
                [{unit}]
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)' }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Canvas */}
        <div style={{ padding: 16, display: 'flex', gap: 16 }}>
          {grid ? (
            <GridCanvas
              grid={grid}
              colormap={colormap}
              width={Math.min(700, window.innerWidth * 0.6)}
              height={400}
            />
          ) : (
            <div style={{
              width: 700, height: 400,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--bg-tertiary)', borderRadius: 4,
            }}>
              <span style={{ color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>
                NO RASTER DATA — Upload and run analysis first
              </span>
            </div>
          )}

          {/* Stats panel */}
          {grid && (
            <div style={{ minWidth: 140, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', marginBottom: 6 }}>
                  RASTER INFO
                </div>
                {[
                  { label: 'ROWS',   value: grid.rows },
                  { label: 'COLS',   value: grid.cols },
                  { label: 'PIXELS', value: validCount.toLocaleString() },
                  { label: 'MIN',    value: isFinite(vmin) ? vmin.toFixed(4) : '—' },
                  { label: 'MAX',    value: isFinite(vmax) ? vmax.toFixed(4) : '—' },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '4px 0', borderBottom: '1px solid var(--border)',
                    fontSize: 10, fontFamily: 'JetBrains Mono, monospace',
                  }}>
                    <span style={{ color: 'var(--text-dim)' }}>{label}</span>
                    <span style={{ color: 'var(--text-primary)' }}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Colormap legend */}
              <div>
                <div style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', marginBottom: 6 }}>
                  COLOUR SCALE
                </div>
                <div style={{
                  height: 120, width: 20, borderRadius: 3,
                  background: getGradientStyle(colormap),
                  marginBottom: 4,
                }} />
                <div style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>
                  <div>{isFinite(vmax) ? vmax.toFixed(2) : 'max'}</div>
                  <div style={{ marginTop: 90 }}>{isFinite(vmin) ? vmin.toFixed(2) : 'min'}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getGradientStyle(colormap) {
  switch (colormap) {
    case 'blue':   return 'linear-gradient(to bottom, rgb(115,210,255), rgb(20,80,160))';
    case 'red':    return 'linear-gradient(to bottom, rgb(220,60,50), rgb(80,20,20))';
    case 'gray':   return 'linear-gradient(to bottom, rgb(210,210,220), rgb(30,30,40))';
    default:       return 'linear-gradient(to bottom, rgb(244,124,32), rgb(20,30,50))';
  }
}
