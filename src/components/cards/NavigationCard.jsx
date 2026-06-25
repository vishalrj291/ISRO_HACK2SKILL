import React from 'react';
import { Route, Zap, Shield } from 'lucide-react';

export default function NavigationCard({ data }) {
  const dist   = data?.total_distance_m  != null
    ? `${(data.total_distance_m / 1000).toFixed(2)} km`
    : data?.routeDistance != null ? `${data.routeDistance} km` : '—';
  const energy = data?.estimated_energy  != null
    ? data.estimated_energy.toFixed(1)
    : data?.energyConsumption ?? '—';
  const safety = data?.safety_score      != null
    ? `${(data.safety_score * 100).toFixed(0)}%`
    : data?.safetyScore != null ? `${data.safetyScore}%` : '—';
  const steps  = data?.path_length_steps ?? '—';
  const found  = data?.found;

  const safetyColor = parseFloat(safety) > 75
    ? 'var(--green)'
    : parseFloat(safety) > 50
    ? 'var(--amber)'
    : 'var(--red)';

  return (
    <div className="sci-card">
      <div className="sci-card-header">
        <span className="sci-card-title">Navigation Route</span>
        <Route size={13} style={{ color: 'var(--orange)' }} />
      </div>
      <div className="sci-card-body">
        {found === false && (
          <div style={{
            background: 'rgba(194,77,77,0.1)', border: '1px solid rgba(194,77,77,0.3)',
            borderRadius: 4, padding: '8px 12px', marginBottom: 12,
            fontSize: 11, color: 'var(--red)', fontFamily: 'JetBrains Mono, monospace',
          }}>
            NO PATH FOUND — terrain impassable
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'Distance',  value: dist,   icon: Route,  color: 'var(--orange)' },
            { label: 'Safety',    value: safety,  icon: Shield, color: safetyColor    },
            { label: 'Steps',     value: steps,   icon: Route,  color: 'var(--silver)' },
            { label: 'Energy',    value: energy,  icon: Zap,    color: 'var(--amber)' },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 18, fontWeight: 600, color,
              }}>{value}</div>
              <div className="metric-label">{label}</div>
            </div>
          ))}
        </div>

        {data?.path_waypoints?.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', marginBottom: 6 }}>
              WAYPOINTS ({data.path_waypoints.length})
            </div>
            <div style={{ maxHeight: 80, overflowY: 'auto' }}>
              {data.path_waypoints.filter((_, i) => i % Math.max(1, Math.floor(data.path_waypoints.length / 5)) === 0)
                .slice(0, 5)
                .map((wp, i) => (
                  <div key={i} style={{
                    fontSize: 10, color: 'var(--text-muted)',
                    fontFamily: 'JetBrains Mono, monospace',
                    borderBottom: '1px solid var(--border)',
                    padding: '3px 0',
                  }}>
                    WP-{wp.step}: {wp.latitude.toFixed(4)}°, {wp.longitude.toFixed(4)}°
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
