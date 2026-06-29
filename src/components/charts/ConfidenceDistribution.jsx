import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
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
      <div style={{ color: 'var(--text-dim)', marginBottom: 4, fontSize: 9 }}>Ice Prob. Range</div>
      <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{label}</div>
      <div style={{ color: 'var(--ice)', fontWeight: 700, marginTop: 2 }}>
        Regions: {payload[0]?.value}
      </div>
    </div>
  );
};

export default function ConfidenceDistribution({ data, height = 180 }) {
  if (!data || !data.length) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'var(--text-dim)', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>
          NO DATA
        </span>
      </div>
    );
  }

  // Color ramp: red → amber → green (low → high probability)
  const barColors = [
    'var(--red)',
    'var(--amber)',
    'var(--orange)',
    'var(--ice)',
    'var(--green)',
  ];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
        <XAxis
          dataKey="range"
          tick={{ fontSize: 9, fill: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}
          tickLine={false}
          axisLine={false}
          label={{ value: 'Probability Range', position: 'insideBottom', offset: -2, fill: 'var(--text-dim)', fontSize: 9 }}
        />
        <YAxis
          tick={{ fontSize: 9, fill: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}
          tickLine={false}
          axisLine={false}
          label={{ value: 'Region Count', angle: -90, position: 'insideLeft', offset: 14, fill: 'var(--text-dim)', fontSize: 9 }}
        />
        <Tooltip content={<DarkTooltip />} />
        <Bar dataKey="count" radius={[3, 3, 0, 0]} barSize={26}>
          {data.map((_, i) => (
            <Cell key={i} fill={barColors[Math.min(i, barColors.length - 1)]} opacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
