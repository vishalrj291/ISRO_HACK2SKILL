import React, { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import TerrainExpandModal from './TerrainExpandModal';

/**
 * TerrainThumbnail
 * ─────────────────
 * Renders a compact thumbnail card for a terrain layer
 * (slope map, TRI, ice heatmap, hazard map).
 *
 * Props:
 *   title     — layer name shown in the card header
 *   grid      — JsonGrid object { rows, cols, data } from the backend
 *   colormap  — 'orange' | 'blue' | 'red' | 'gray'  (colour ramp preset)
 *   unit      — unit string shown in the footer
 */
export default function TerrainThumbnail({ title, grid, colormap = 'orange', unit = '' }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="sci-card terrain-thumb"
        style={{ cursor: 'pointer' }}
        onClick={() => setOpen(true)}
        title="Click to expand"
      >
        <div className="sci-card-header" style={{ padding: '8px 12px' }}>
          <span className="sci-card-title" style={{ fontSize: 9 }}>{title}</span>
          <Maximize2 size={10} style={{ color: 'var(--text-dim)' }} />
        </div>

        <div style={{ padding: 8 }}>
          {grid ? (
            <GridCanvas grid={grid} colormap={colormap} width={160} height={100} />
          ) : (
            <div style={{
              width: 160, height: 100,
              background: 'var(--bg-tertiary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 3,
            }}>
              <span style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>
                NO DATA
              </span>
            </div>
          )}
        </div>

        {unit && (
          <div style={{
            padding: '4px 12px', fontSize: 9,
            color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace',
            borderTop: '1px solid var(--border)',
          }}>
            {unit}
          </div>
        )}
      </div>

      {open && (
        <TerrainExpandModal
          title={title}
          grid={grid}
          colormap={colormap}
          unit={unit}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

// ── Inline canvas renderer ─────────────────────────────────────────────────
function GridCanvas({ grid, colormap, width, height }) {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !grid) return;
    const ctx = canvas.getContext('2d');
    const { rows, cols, data } = grid;

    // Find valid range
    let vmin = Infinity, vmax = -Infinity;
    for (const row of data) {
      for (const v of row) {
        if (v !== null) { vmin = Math.min(vmin, v); vmax = Math.max(vmax, v); }
      }
    }
    const span = vmax - vmin || 1;

    const cellW = width  / cols;
    const cellH = height / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const v = data[r]?.[c];
        if (v === null || v === undefined) {
          ctx.fillStyle = '#1a1f28';
        } else {
          const t = (v - vmin) / span;
          ctx.fillStyle = toColor(t, colormap);
        }
        ctx.fillRect(c * cellW, r * cellH, Math.ceil(cellW), Math.ceil(cellH));
      }
    }
  }, [grid, colormap, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ borderRadius: 3, display: 'block' }}
    />
  );
}

function toColor(t, map) {
  // t in [0, 1]
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  switch (map) {
    case 'blue':
      return `rgb(${clamp(20 + t * 30)}, ${clamp(80 + t * 80)}, ${clamp(160 + t * 95)})`;
    case 'red':
      return `rgb(${clamp(80 + t * 140)}, ${clamp(20 + t * 40)}, ${clamp(20 + t * 30)})`;
    case 'gray':
      return `rgb(${clamp(30 + t * 180)}, ${clamp(30 + t * 180)}, ${clamp(40 + t * 170)})`;
    case 'orange':
    default:
      if (t < 0.5) return `rgb(${clamp(20 + t * 80)}, ${clamp(30 + t * 60)}, ${clamp(50 + t * 20)})`;
      return `rgb(${clamp(60 + (t - 0.5) * 380)}, ${clamp(60 + (t - 0.5) * 120)}, ${clamp(30)})`;
  }
}

export { GridCanvas, toColor };
