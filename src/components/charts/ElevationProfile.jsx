import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';

export default function ElevationProfile({ data, height = 180 }) {
  if (!data || !data.length) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'var(--text-dim)', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>
          NO ELEVATION DATA
        </span>
      </div>
    );
  }

  // Support both backend format {distance_m, elevation_m} and local format {dist, elev}
  const chartData = data.map((d) => ({
    dist: d.dist ?? d.distance_m,
    elev: d.elev ?? d.elevation_m,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="var(--silver-muted)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--silver-muted)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="dist"
          tick={{ fontSize: 9, fill: 'var(--text-dim)' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${typeof v === 'number' ? v.toFixed(1) : v}km`}
        />
        <YAxis
          tick={{ fontSize: 9, fill: 'var(--text-dim)' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v}m`}
        />
        <Tooltip
          formatter={(v) => [`${v} m`, 'Elevation']}
          labelFormatter={(l) => `Dist: ${typeof l === 'number' ? l.toFixed(2) : l}km`}
          contentStyle={{
            background: 'var(--bg-elevated)', border: '1px solid var(--border-light)',
            borderRadius: 4, fontSize: 11, fontFamily: 'JetBrains Mono, monospace',
          }}
        />
        <Area
          type="monotone"
          dataKey="elev"
          stroke="var(--silver)"
          strokeWidth={1.5}
          fill="url(#elevGrad)"
          dot={false}
          activeDot={{ r: 3, fill: 'var(--silver)' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
