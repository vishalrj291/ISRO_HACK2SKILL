import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

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

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={sorted}
        layout="vertical"
        margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
        <XAxis
          type="number"
          domain={[0, 0.4]}
          tick={{ fontSize: 9, fill: 'var(--text-dim)' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
        />
        <YAxis
          type="category"
          dataKey="feature"
          tick={{ fontSize: 9, fill: 'var(--text-muted)' }}
          tickLine={false}
          axisLine={false}
          width={110}
        />
        <Tooltip
          formatter={(v) => [`${(v * 100).toFixed(1)}%`, 'Importance']}
          contentStyle={{
            background: 'var(--bg-elevated)', border: '1px solid var(--border-light)',
            borderRadius: 4, fontSize: 11, fontFamily: 'JetBrains Mono, monospace',
          }}
        />
        <Bar dataKey="importance" radius={[0, 2, 2, 0]} barSize={10}>
          {sorted.map((_, i) => (
            <Cell
              key={i}
              fill={i === 0 ? 'var(--orange)' : i === 1 ? '#E08530' : 'var(--silver-muted)'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
