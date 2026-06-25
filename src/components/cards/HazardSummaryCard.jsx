import React from 'react';
import { AlertTriangle } from 'lucide-react';
import HazardGauge from '../charts/HazardGauge';

export default function HazardSummaryCard({ data }) {
  const score    = data?.hazard_score     != null ? Math.round(data.hazard_score * 100)  : data?.severityScore ?? 0;
  const highPct  = data?.high_risk_area_pct  ?? (data?.highRisk  ? `${data.highRisk} zones`  : '—');
  const medPct   = data?.medium_risk_area_pct ?? (data?.moderateRisk ? `${data.moderateRisk} zones` : '—');
  const lowPct   = data?.low_risk_area_pct   ?? (data?.lowRisk   ? `${data.lowRisk} zones`   : '—');

  const fmt = (v) => typeof v === 'number' ? `${v.toFixed(1)}%` : v;

  return (
    <div className="sci-card">
      <div className="sci-card-header">
        <span className="sci-card-title">Hazard Assessment</span>
        <AlertTriangle size={13} style={{ color: 'var(--amber)' }} />
      </div>
      <div className="sci-card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <HazardGauge value={score} size={140} />

        <div style={{ width: '100%', display: 'flex', gap: 8, justifyContent: 'center' }}>
          {[
            { label: 'HIGH',   value: fmt(highPct),  color: 'var(--red)'   },
            { label: 'MED',    value: fmt(medPct),   color: 'var(--amber)' },
            { label: 'LOW',    value: fmt(lowPct),   color: 'var(--green)' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 600, color }}>
                {value}
              </div>
              <div style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
