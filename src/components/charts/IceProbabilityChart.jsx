import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-elevated)', border: '1px solid var(--border-light)',
      borderRadius: 4, padding: '8px 12px', fontSize: 11,
      fontFamily: 'JetBrains Mono, monospace',
    }}>
      <div style={{ color: 'var(--text-dim)', marginBottom: 4 }}>{label}</div>
      <div style={{ color: 'var(--orange)' }}>
        P(ice) = <strong>{payload[0]?.value?.toFixed(1)}%</strong>
      </div>
    </div>
  );
};

export default function IceProbabilityChart({ data, height = 180 }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'var(--text-dim)', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>
          NO DATA — RUN ICE ANALYSIS
        </span>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="iceGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="var(--orange)" stopOpacity={0.25} />
            <stop offset="95%" stopColor="var(--orange)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="sol" tick={{ fontSize: 10, fill: 'var(--text-dim)' }} tickLine={false} axisLine={false} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text-dim)' }} tickLine={false} axisLine={false} unit="%" />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={60} stroke="var(--orange)" strokeDasharray="4 4" strokeOpacity={0.4} />
        <Area
          type="monotone"
          dataKey="prob"
          stroke="var(--orange)"
          strokeWidth={1.5}
          fill="url(#iceGrad)"
          dot={false}
          activeDot={{ r: 3, fill: 'var(--orange)' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
