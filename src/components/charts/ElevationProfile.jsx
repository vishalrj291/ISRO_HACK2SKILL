import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';

const DarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
      borderRadius: 4,
      padding: '8px 12px',
      fontSize: 11,
      fontFamily: 'JetBrains Mono, monospace',
      boxShadow: 'var(--shadow-lg)',
    }}>
      <div style={{ color: 'var(--text-dim)', marginBottom: 4, fontSize: 9 }}>
        Dist: {typeof label === 'number' ? label.toFixed(2) : label} km
      </div>
      <div style={{ color: 'var(--orange)', fontWeight: 700 }}>
        Elev: {payload[0]?.value} m
      </div>
    </div>
  );
};

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
      <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="var(--orange)" stopOpacity={0.25} />
            <stop offset="95%" stopColor="var(--orange)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
        <XAxis
          dataKey="dist"
          tick={{ fontSize: 9, fill: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${typeof v === 'number' ? v.toFixed(1) : v}km`}
          label={{ value: 'Distance (km)', position: 'insideBottom', offset: -2, fill: 'var(--text-dim)', fontSize: 9 }}
        />
        <YAxis
          tick={{ fontSize: 9, fill: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v}m`}
          label={{ value: 'Elevation (m)', angle: -90, position: 'insideLeft', offset: 14, fill: 'var(--text-dim)', fontSize: 9 }}
        />
        <Tooltip content={<DarkTooltip />} />
        <Area
          type="monotone"
          dataKey="elev"
          stroke="var(--orange)"
          strokeWidth={1.5}
          fill="url(#elevGrad)"
          dot={false}
          activeDot={{ r: 3, fill: 'var(--orange)', stroke: 'var(--bg-elevated)', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
