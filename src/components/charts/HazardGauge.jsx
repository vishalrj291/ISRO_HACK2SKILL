import React from 'react';

// SVG arc-style hazard gauge
export default function HazardGauge({ value = 0, size = 120 }) {
  const pct    = Math.min(Math.max(value, 0), 100);
  const angle  = (pct / 100) * 180; // 0–180° sweep
  const r      = 44;
  const cx     = size / 2;
  const cy     = size / 2 + 10;

  // Convert angle to SVG path point on the arc
  const toXY = (deg) => {
    const rad = ((deg - 180) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  const start  = toXY(0);
  const end    = toXY(angle);
  const large  = angle > 90 ? 1 : 0;

  let color = 'var(--green)';
  if (pct > 66) color = 'var(--red)';
  else if (pct > 33) color = 'var(--amber)';

  return (
    <svg width={size} height={size * 0.7} viewBox={`0 0 ${size} ${size * 0.7}`}>
      {/* Track arc */}
      <path
        d={`M ${toXY(0).x} ${toXY(0).y} A ${r} ${r} 0 1 1 ${toXY(180).x} ${toXY(180).y}`}
        fill="none"
        stroke="var(--border)"
        strokeWidth={6}
        strokeLinecap="round"
      />
      {/* Value arc */}
      {pct > 0 && (
        <path
          d={`M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
        />
      )}
      {/* Labels */}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize={18} fontWeight={600}
        fill="var(--text-primary)" fontFamily="JetBrains Mono, monospace">
        {pct}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize={9}
        fill="var(--text-dim)" fontFamily="JetBrains Mono, monospace">
        HAZARD INDEX
      </text>
      <text x={cx - r - 2} y={cy + 4} textAnchor="middle" fontSize={8} fill="var(--text-dim)">0</text>
      <text x={cx + r + 2} y={cy + 4} textAnchor="middle" fontSize={8} fill="var(--text-dim)">100</text>
    </svg>
  );
}
