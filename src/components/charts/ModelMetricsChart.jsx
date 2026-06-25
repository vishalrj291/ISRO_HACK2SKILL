import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

export default function ModelMetricsChart({ data, height = 200 }) {
  if (!data || !data.length) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'var(--text-dim)', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>
          NO MODEL HISTORY
        </span>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="version" tick={{ fontSize: 10, fill: 'var(--text-dim)' }} tickLine={false} axisLine={false} />
        <YAxis domain={[75, 100]} tick={{ fontSize: 10, fill: 'var(--text-dim)' }} tickLine={false} axisLine={false} unit="%" />
        <Tooltip
          contentStyle={{
            background: 'var(--bg-elevated)', border: '1px solid var(--border-light)',
            borderRadius: 4, fontSize: 11, fontFamily: 'JetBrains Mono, monospace',
          }}
        />
        <Legend wrapperStyle={{ fontSize: 10, color: 'var(--text-muted)' }} />
        <Line type="monotone" dataKey="accuracy" stroke="var(--orange)" strokeWidth={1.5} dot={{ r: 3 }} name="Accuracy" />
        <Line type="monotone" dataKey="f1" stroke="var(--green)" strokeWidth={1.5} dot={{ r: 3 }} name="F1 Score" strokeDasharray="4 2" />
      </LineChart>
    </ResponsiveContainer>
  );
}
