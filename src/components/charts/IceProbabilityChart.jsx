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
      <div style={{ color: 'var(--text-dim)', marginBottom: 4, fontSize: 10 }}>SOL {label}</div>
      <div style={{ color: 'var(--ice)', fontWeight: 700 }}>
        P(ice) = {payload[0]?.value?.toFixed(1)}%
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
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="iceGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="var(--ice)" stopOpacity={0.30} />
            <stop offset="95%" stopColor="var(--ice)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
        <XAxis
          dataKey="sol"
          tick={{ fontSize: 9, fill: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}
          tickLine={false}
          axisLine={false}
          label={{ value: 'Mission Sol', position: 'insideBottom', offset: -2, fill: 'var(--text-dim)', fontSize: 9 }}
        />
        <YAxis
          domain={[55, 100]}
          tick={{ fontSize: 9, fill: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}
          tickLine={false}
          axisLine={false}
          unit="%"
          label={{ value: 'P(Ice) %', angle: -90, position: 'insideLeft', offset: 18, fill: 'var(--text-dim)', fontSize: 9 }}
        />
        <Tooltip content={<DarkTooltip />} />
        <ReferenceLine y={60} stroke="var(--amber)" strokeDasharray="4 4" strokeOpacity={0.5}
          label={{ value: 'Threshold', position: 'right', fill: 'var(--amber)', fontSize: 9 }} />
        <Area
          type="monotone"
          dataKey="prob"
          stroke="var(--ice)"
          strokeWidth={1.5}
          fill="url(#iceGrad)"
          dot={false}
          activeDot={{ r: 3, fill: 'var(--ice)', stroke: 'var(--bg-elevated)', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
