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
      <div style={{ color: 'var(--text-dim)', marginBottom: 4, fontSize: 9 }}>{label}</div>
      <div style={{ color: 'var(--orange)', fontWeight: 700 }}>
        Importance: {payload[0]?.value !== undefined ? `${(payload[0].value * 100).toFixed(1)}%` : '—'}
      </div>
    </div>
  );
};

export default function FeatureImportanceChart({ data, height = 180 }) {
  if (!data || !data.length) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'var(--text-dim)', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>
          NO MODEL DATA
        </span>
      </div>
    );
  }

  const sorted = [...data].sort((a, b) => b.importance - a.importance);

  // Color gradient from orange (most important) to dim
  const barColors = ['var(--orange)', '#D9733A', '#B86A32', '#8A5A30', '#5A4428', '#3A2E20'];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={sorted}
        layout="vertical"
        margin={{ top: 4, right: 20, left: 4, bottom: 4 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" horizontal={false} />
        <XAxis
          type="number"
          domain={[0, 0.4]}
          tick={{ fontSize: 9, fill: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
          label={{ value: 'Importance (%)', position: 'insideBottom', offset: -2, fill: 'var(--text-dim)', fontSize: 9 }}
        />
        <YAxis
          type="category"
          dataKey="feature"
          tick={{ fontSize: 9, fill: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}
          tickLine={false}
          axisLine={false}
          width={115}
        />
        <Tooltip content={<DarkTooltip />} />
        <Bar dataKey="importance" radius={[0, 2, 2, 0]} barSize={9}>
          {sorted.map((_, i) => (
            <Cell key={i} fill={barColors[Math.min(i, barColors.length - 1)]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
