import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

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

  const colors = ['#C24D4D', '#D9A441', '#7AA874', 'var(--orange)', '#7AA874'];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="range" tick={{ fontSize: 9, fill: 'var(--text-dim)' }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 9, fill: 'var(--text-dim)' }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            background: 'var(--bg-elevated)', border: '1px solid var(--border-light)',
            borderRadius: 4, fontSize: 11, fontFamily: 'JetBrains Mono, monospace',
          }}
        />
        <Bar dataKey="count" radius={[2, 2, 0, 0]} barSize={24}>
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
