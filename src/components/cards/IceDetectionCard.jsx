import React from 'react';
import { Snowflake, TrendingUp } from 'lucide-react';

export default function IceDetectionCard({ data }) {
  const prob = data?.average_ice_probability != null
    ? (data.average_ice_probability * 100).toFixed(1)
    : data?.overallProbability ?? '—';

  const candidates = data?.top_candidate_regions?.length
    ?? data?.candidateRegions
    ?? '—';

  const color = parseFloat(prob) > 70
    ? 'var(--green)'
    : parseFloat(prob) > 40
    ? 'var(--amber)'
    : 'var(--text-muted)';

  return (
    <div className="sci-card">
      <div className="sci-card-header">
        <span className="sci-card-title">Ice Detection</span>
        <Snowflake size={13} style={{ color: '#60A5FA' }} />
      </div>
      <div className="sci-card-body">
        <div className="metric-value" style={{ color, fontSize: 32 }}>
          {prob}
          <span className="metric-unit">%</span>
        </div>
        <div className="metric-label">Average ice probability</div>

        <div style={{ marginTop: 12, display: 'flex', gap: 16 }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
              {candidates}
            </div>
            <div className="metric-label">Candidates</div>
          </div>
          {data?.high_probability_area_pct != null && (
            <div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 16, fontWeight: 600, color: 'var(--orange)' }}>
                {data.high_probability_area_pct.toFixed(1)}%
              </div>
              <div className="metric-label">High prob. area</div>
            </div>
          )}
        </div>

        {data?.component_weights && (
          <div style={{ marginTop: 12 }}>
            {Object.entries(data.component_weights).map(([k, v]) => (
              <div key={k} style={{ marginBottom: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase' }}>{k}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>{(v * 100).toFixed(0)}%</span>
                </div>
                <div className="prog-bar-track">
                  <div className="prog-bar-fill" style={{ width: `${v * 100}%`, background: 'var(--orange)' }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
