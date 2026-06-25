import React, { useState } from 'react';
import { Layers, Eye, EyeOff } from 'lucide-react';

/**
 * LayerControl
 * ─────────────
 * Standalone layer-toggle panel used on the Data Layers page and
 * as a floating overlay inside the map. Accepts a layers array
 * and fires onToggle(id) when a layer's visibility changes.
 *
 * Props:
 *   layers    — [{ id, label, color, active, source, unit }]
 *   onToggle  — (id: string) => void
 *   compact   — boolean — if true renders in compact (icon-only) mode
 */
export default function LayerControl({ layers = [], onToggle = () => {}, compact = false }) {
  const [expanded, setExpanded] = useState(!compact);

  if (compact && !expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="btn btn-ghost"
        style={{ padding: '6px 8px' }}
        title="Open layer control"
      >
        <Layers size={13} />
      </button>
    );
  }

  return (
    <div
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 5,
        minWidth: 200,
        fontSize: 11,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          borderBottom: '1px solid var(--border)',
          cursor: compact ? 'pointer' : 'default',
        }}
        onClick={compact ? () => setExpanded(false) : undefined}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Layers size={11} style={{ color: 'var(--orange)' }} />
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
            letterSpacing: '0.1em', color: 'var(--text-dim)', textTransform: 'uppercase',
          }}>
            GIS Layers
          </span>
        </div>
        <span style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>
          {layers.filter((l) => l.active).length}/{layers.length}
        </span>
      </div>

      {/* Layer rows */}
      <div>
        {layers.map((layer, i) => (
          <div
            key={layer.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '7px 12px',
              borderBottom: i < layers.length - 1 ? '1px solid rgba(42,51,64,0.5)' : 'none',
              cursor: 'pointer',
              transition: 'background 0.12s',
            }}
            onClick={() => onToggle(layer.id)}
          >
            {/* Colour swatch */}
            <span style={{
              width: 8, height: 8, borderRadius: 2, flexShrink: 0,
              background: layer.color || 'var(--silver-muted)',
              opacity: layer.active ? 1 : 0.35,
            }} />

            {/* Label + source */}
            <div style={{ flex: 1 }}>
              <div style={{
                color: layer.active ? 'var(--text-primary)' : 'var(--text-dim)',
                fontWeight: layer.active ? 500 : 400,
                transition: 'color 0.12s',
              }}>
                {layer.label}
              </div>
              {layer.source && (
                <div style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', marginTop: 1 }}>
                  {layer.source}{layer.unit ? ` · ${layer.unit}` : ''}
                </div>
              )}
            </div>

            {/* Eye toggle */}
            {layer.active
              ? <Eye size={11} style={{ color: 'var(--orange)', flexShrink: 0 }} />
              : <EyeOff size={11} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
            }
          </div>
        ))}
      </div>
    </div>
  );
}
